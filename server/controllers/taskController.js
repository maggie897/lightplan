const path = require('path');
const crypto = require('crypto');
const Task = require('../models/Task');
const { s3 } = require('../aws/s3');
const { GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { getNextDueDate } = require('../utils/recurrence');

// Generate a unique S3 object key for a user's uploaded file
function makeS3Key(userId, originalname) {
  const extname = path.extname(originalname);
  const name = crypto.randomBytes(8).toString('hex');
  return `task/${userId}/${Date.now()}-${name}${extname}`;
}

// Upload image to S3 and link to task
exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file provided' });

    const Key = makeS3Key(req.user.id, req.file.originalname);

    await s3.send(new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    }));

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { imageKey: Key },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

// Get all tasks for authenticated user, auto-update recurring tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.userId });
    const now = new Date();

    const updatedTasks = await Promise.all(tasks.map(async t => {
      if (t.isRecurring && t.dueDate && new Date(t.dueDate) < now) {
        let nextDue = new Date(t.dueDate);

        while (true) {
          const candidate = getNextDueDate(nextDue, t.recurrence);
          if (!candidate || candidate > now) break;
          nextDue = candidate;
        }

        if (nextDue > new Date(t.dueDate)) {
          t.dueDate = nextDue;
          t.completed = false;
          await Task.updateOne({ _id: t._id }, { dueDate: nextDue, completed: false });
        }
      }
      return t;
    }));

    res.json(updatedTasks);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
}; 

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get signed image URL from S3 for a task
exports.getImageUrl = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    if (!task.imageKey) return res.json({ url: null });

    const getCommand = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: task.imageKey,
    });

    const url = await getSignedUrl(s3, getCommand, { expiresIn: 300 });
    res.json({ url });
  } catch (err) {
    console.error('Sign failed:', err);
    res.status(500).json({ message: 'Failed to sign URL' });
  }
};

// Create a new task 
exports.createTask = async (req, res) => {
  try {
    const { title, tag, dueDate, dueTime, details, isRecurring, recurrence, reminder } = req.body;

    // Reject past-due tasks
    if (dueDate && dueTime) {
      const dueDateTime = new Date(`${dueDate}T${dueTime}:00`);
      if (dueDateTime < new Date()) {
        return res.status(400).json({ message: 'Due date/time cannot be in the past' });
      }
    }

    // Upload image to S3 (if present)
    let imageKey;
    if (req.file) {
      const key = makeS3Key(req.user.id, req.file.originalname);
      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
      }));
      imageKey = key;
    }

    // Validate recurrence logic
    const rec = recurrence ? JSON.parse(recurrence) : undefined;
    if (rec?.frequency && !dueDate) {
      return res.status(400).json({ message: 'Repeat frequency requires a due date' });
    }

    // Duplicate task protection
    const recentTask = await Task.findOne({
      userId: req.user.id,
      title,
      dueDate,
      dueTime,
      createdAt: { $gte: new Date(Date.now() - 5000) }
    });
    if (recentTask) {
      return res.status(429).json({ message: 'Duplicate task detected' });
    }

    const newTask = new Task({
      userId: req.user.id,
      title,
      tag,
      dueDate,
      dueTime,
      details,
      imageKey: imageKey || null,
      isRecurring: isRecurring === 'true' || isRecurring === true,
      recurrence: rec,
      reminder: Number(reminder) || 0
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id, userId: req.user.id });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const payload = { ...req.body };

    if (payload.recurrence && typeof payload.recurrence === 'string') {
      payload.recurrence = JSON.parse(payload.recurrence);
    }

    if (payload.recurrence?.frequency === 'Weekly') {
      payload.recurrence.interval = payload.recurrence.interval === 2 ? 2 : 1;
    }

    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      payload,
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
};

  
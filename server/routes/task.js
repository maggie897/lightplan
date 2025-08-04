const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer'); 
const path = require('path'); 
const { log, error } = require('console');

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null,'uploads/'); 
  },
  filename: function(req, file, cb){
    const filename = Date.now();
    cb(null, filename+path.extname(file.originalname));
  }
});
const upload = multer({storage: storage}); 

router.post('/upload/:taskId', upload.single('image'), async(req,res)=>{
  try{
    const task = await Task.findById(req.params.taskId); 
    if(!task) return res.status(404).json({message: 'Task not found'}); 

    task.imagePath = req.file.filename;
    await task.save(); 
    res.status(200).json({message: 'image updated'}); 
  }catch(err){
    res.status(500).json({message: 'upload failed', error: err.message}); 
  }
})

router.get('/', verifyToken, async(req,res)=>{
  try{
    const tasks = await Task.find({userId: req.userId});
    res.json(tasks); 
  }catch(err){
    res.status(500).json({message: 'Server Error'}); 
  }
}); 

router.get('/:id', async(req,res)=>{
  try{
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(404).json({message: 'task not found'});
    res.json(task);
  }catch(err){
    res.status(500).json({message: 'server error'})
  }
})

router.post('/', verifyToken, upload.single('image'), async(req,res)=>{
  try{
    const {title, tag, dueDate, details} = req.body;
    const imagePath = req.file? req.file.filename : null; 

    const newTask = new Task({
      userId: req.user.id,
      title,
      tag,
      dueDate,
      details,
      imagePath: imagePath || null
    });
    await newTask.save();
    res.status(201).json(newTask); 
  }catch(err){
    res.status(500).json({message: 'Server Error', error: err.message}); 
  }
}); 

router.delete('/:id', verifyToken, async(req,res)=>{
  try{
    await Task.deleteOne({_id: req.params.id, userId: req.user.id});
    res.json({message: 'Task deleted'}); 
  }catch(err){
    res.status(500).json({message: 'Server Error'});   
  }
})

router.put('/:id', verifyToken, async(req,res) =>{
  try{
    const {title, tag, dueDate, completed, details, imagePath} = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      {_id: req.params.id, userId: req.user.id},
      {title, tag, dueDate, completed, details,imagePath},
      {new:true}
    );
    res.json(updatedTask); 
  }catch(err){
    res.status(500).json({message: 'Server Error'})
  }
})

module.exports = router; 
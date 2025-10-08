const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const multer = require('multer');
const taskController = require('../controllers/taskController');

// Setup multer for file uploads to memory
const upload = multer({ storage: multer.memoryStorage() }); 
  
// Task routes mapped to controller functions
router.get('/', verifyToken, taskController.getTasks);
router.get('/:id', taskController.getTaskById);
router.get('/:id/imageUrl', verifyToken, taskController.getImageUrl);

router.post('/', verifyToken, upload.single('image'), taskController.createTask);
router.post('/:id/image', verifyToken, upload.single('image'), taskController.uploadImage);

router.put('/:id', verifyToken, taskController.updateTask);
router.delete('/:id', verifyToken, taskController.deleteTask);
  
module.exports = router; 
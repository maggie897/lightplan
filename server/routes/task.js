const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, async(req,res)=>{
  try{
    const tasks = await Task.find({userId: req.userId});
    res.json(tasks); 
  }catch(err){
    res.status(500).json({message: 'Server Error'}); 
  }
}); 

router.post('/', verifyToken, async(req,res)=>{
  try{
    const newTask = new Task({
      userId: req.user.id,
      title: req.body.title,
    });
    await newTask.save();
    res.status(201).json(newTask); 
  }catch(err){
    res.status(500).json({message: 'Server Error'}); 
  }
}); 

module.exports = router; 
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
    const {title, tag, dueDate} = req.body;
    const newTask = new Task({
      userId: req.user.id,
      title,
      tag,
      dueDate
    });
    await newTask.save();
    res.status(201).json(newTask); 
  }catch(err){
    res.status(500).json({message: 'Server Error'}); 
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
    const {title, tag, dueDate, completed} = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      {_id: req.params.id, userId: req.user.id},
      {title, tag, dueDate, completed},
      {new:true}
    );
    res.json(updatedTask); 
  }catch(err){
    res.status(500).json({message: 'Server Error'})
  }
})

module.exports = router; 
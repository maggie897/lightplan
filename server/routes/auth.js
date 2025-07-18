const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.post('/register', async(req,res)=>{
  try{
    const {username, email, password} = req.body;
    
    const existingUser = await User.findOne({username}); 
    if(existingUser){
      return res.status(409).json({message: 'Username already taken'})
    }

    const existingEmail = await User.findOne({email}); 
    if(existingEmail){
      return res.status(409).json({message: 'Email already existed'})
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const newUser = new User({username,email, password: hashedPassword});
    await newUser.save(); 
    res.status(201).json({message: 'User created successfully'}); 
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'server error'})
  }
}); 

router.post('/login', async(req,res)=>{
  try{
    const {loginInput, password} = req.body;
    
    const user = await User.findOne({
      $or: [{username: loginInput}, {email: loginInput}]
    });

    if(!user){
      return res.status(400).json({message: 'Invalid username/email'});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      res.status(400).json({message: 'Invalid password'});
    }

    const token = jwt.sign(
      {id: user._id, username: user.username},
      process.env.JWT_SECRET,
      {expiresIn:process.env.JWT_EXPIRES_IN}
    ); 

    res.status(200).json({message: 'login successfully', 
      token,
      user: {username: user.username, email: user.email}}); 
  }catch(err){
    console.error(err);
    res.status(500).json({message: 'server error'}); 
  }
}); 

module.exports = router; 
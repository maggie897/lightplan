// Load a .env file 
require('dotenv').config();

// Connect to MongoDB via Mongoose
const mongoose = require('mongoose'); 

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.error('MongoDB connection error: ', err));

const express = require('express');
const cors = require('cors');
const app = express(); 
// Listen port will be loaded from .env file, or use 5000
const port = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

const authRoutes= require('./routes/auth'); 
app.use('/api/auth', authRoutes); 

//Start server
app.listen(port,()=>{
  console.log(`server is running on http://localhost:${port}/`)
})
// Load a .env file 
require('dotenv').config();

const mongoose = require('mongoose'); 
const authRoutes= require('./routes/auth'); 
const taskRoutes = require('./routes/task'); 

// Connect to MongoDB via Mongoose
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('MongoDB connected'))
.catch(err=>console.error('MongoDB connection error: ', err));

const express = require('express');
const cors = require('cors');
const app = express(); 
const path = require('path'); 

// Listen port will be loaded from .env file, or use 5000
const port = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes); 
app.use('/api/task', taskRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 


//Start server
if(require.main === module){
  app.listen(port,()=>{
    console.log(`server is running on http://localhost:${port}/`)
  })
}

module.exports = app; 

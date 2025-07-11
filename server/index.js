// Load a .env file 
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express(); 
// Listen port will be loaded from .env file, or use 5000
const port = process.env.PORT || 5000; 

app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
  res.send('lightplan backend is running')
})

//Start server
app.listen(port,()=>{
  console.log(`server is running on http://localhost:${port}/`)
})
const crypto = require('crypto');
const bcrypt = require('bcrypt'); 

function generateOTP(){
  return ('' + Math.floor(100000 + Math.random() * 900000)); 
}

function generateToken(){
  return crypto.randomBytes(32).toString('hex');
}

async function hashValue(value) {
  return bcrypt.hash(value, 10); 
}

async function compareHash(value, hash) {
  return bcrypt.compare(value,hash); 
}

module.exports = {generateOTP, generateToken, hashValue, compareHash}; 
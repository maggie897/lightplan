const jwt=require('jsonwebtoken');

const verifyToken = (req,res,next) =>{
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({message: 'no token provided'}); 

  const token = authHeader.split(' ')[1];
  if(!token) return res.status(401).json({message: 'token missing'}); 

  try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded;
    req.userId = decoded.id;
    next();
  }catch(err){
    return res.status(401).json({message: 'invalid token'});
  }
}; 

module.exports = verifyToken; 
const jwt = require('jsonwebtoken');

const autentication= (req,res,next)=>{
const token = req.headers.authorization?.split(" ")[1];

if(!token){
   return res.send('login first')
}

jwt.verify(token, 'secret' , (err,decoded)=>{
    if (err) {
        return res.send({ message: 'Unauthorized: Invalid token' });
      }
    console.log(decoded);
    req.userId = decoded.userId;
})

next();
}

module.exports={autentication};


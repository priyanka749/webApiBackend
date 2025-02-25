const jwt= require("jsonwebtoken");

const SECRET_KEY= "3e4e2edff417b77fd9d27502ccb53e329c43c0976405f9858a50bbc79752b77c";

function authenticateToken(req,res,next){
    const token=req.header('Authorization')?.split(' ')[1];
    if(!token){
        res.status(401).send("Access Denied: No Token Provided");
    }

    try{
    const verified=jwt.verify(token,SECRET_KEY);
    req.user=verified;
    next();
    }catch(e){
        res.status(400).send("Invalid Token");
    }
}

function authorizeRole(role){
    return (req,res,next)=>{
        if(req.user.role!==role){
            return res.status(403).send("You are not authorized to access this resource");
        }
        next();
    }
}

module.exports={authenticateToken,authorizeRole};

// Middleware to authorize based on roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Access denied. Insufficient permissions." });
      }
      next();
    };
  };
 import jwt from "jsonwebtoken";

 export const verifyTokenMiddleware=(req,res,next)=>{
    
    try{
   const token=req.cookies.token;//get token from cookies
    if(!token){
        return res.status(401).json({message:"No token provided"});
    }const verifiedToken=jwt.verify(token,process.env.JWT_SECRET);//verify token
    req.user=verifiedToken;//attach user info to request object
    next();//proceed to next middleware or route handler
    }catch(error){
        return res.status(403).json({message:"Invalid or expired token",error:error.message});
    }
};

export const isAdminMiddleware=(req,res,next)=>{
    const role=req.user.role;
    if(role!=='admin'){
        return res.status(403).json({message:"Access denied. Admins only."});
    }
    next();
}



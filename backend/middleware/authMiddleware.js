 export const verifyTokenMiddleware=(req,res,next)=>{
    
    try{
        const authHeader=req.headers['authorization'];

        if(!authHeader||!authHeader.startsWith('Bearer '))
            return res.status(401).json({message:"Authorization header missing or malformed"});

        const token =authHeader.split(' ')[1];// Will give ['Bearer','tokenvalue'] we want index 1 so tokenvalue
        if(!token) return res.status(401).json({message:"Token missing"});

        const decoded=jwt.verifuy(token,process.env.JWT_SECRET);//verify token
        req.user=decoded;//attach decoded user info to request object so that other middlewares or route handlers can access it
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


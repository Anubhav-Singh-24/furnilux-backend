import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config();

export const validateToken = (req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null){
        return res.status(403).json({msg:"Access token is missing"})
    }
    jwt.verify(token, process.env.ACCESS_SECRET_KEY,(error,user)=>{
        if(error){
            return res.status(401).json({msg:"Invalid access token"})
        }
        req.user = user;
        next();
    });
}
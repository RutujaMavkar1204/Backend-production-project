import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiErrors} from '../utils/ApiErrors.js'
import jwt from 'jsonwebtoken'
import {User} from '../models/user.model.js'

const verifyJWT=asyncHandler(async(req,res,next)=>{
    try{
        const token =req.cookies?.AccessToken || req.header("Authorization")?.replace('Bearer ', "");

        if(!token){
            throw new ApiErrors(400, "Unauthorized request")
        }

        const decodedToken =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if(!decodedToken){
            throw new ApiErrors(400, "Unauthorized request 2")
        }
        const user=await User.findById(decodedToken._id).select("-password -refreshToken" )
        if(!user){
            throw new ApiErrors(400, "Invalid access token")
        }
        req.user=user;
        next()

    }
    catch(error){
        console.log("error: ", error)
        throw new ApiErrors(error?.message ||'error in access token ')
    }
})

export {verifyJWT}
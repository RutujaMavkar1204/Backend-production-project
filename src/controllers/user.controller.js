import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiErrors} from '../utils/ApiErrors.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
const registerUser=asyncHandler(async (req, res)=>{
    /*
    1.get user details from frontend
    2.check validation
    3.check if the user exist already
    4.check for the images-avatar
    5.upload on cloudinary
    6.create a user-create entry in db
    7.remove refresh token and password from response
    8.check for user creation 
    9.send res
    */

      const {fullName, username, email, password}=req.body;
      
      if(
        [fullName, username, email, password].some((field)=>(
            field?.trim==""
        ))
      ){
        throw new ApiErrors(401,"all fields are compulsary")
      }

      const ExistedUser=User.findOne({
        $or:[{email}, {username}]
      })
      if(ExistedUser){
        throw new ApiErrors(409,"user already exist")
      }
      const avatarLocalPath=req.files?.avatar[0]?.path;
      const coverImageLocalPath=req.files?.coverImage[0]?.path;
      

      const avatar=await uploadOnCloudinary(avatarLocalPath);
      const coverImage=await uploadOnCloudinary(coverImageLocalPath);
      if(!avatar){
        throw new ApiErrors(401,"avatar fiels is required")
      }

     const user=await User.create({
        fullName:fullName.toLowerCase,
        email,
        username,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",

      })

      const CreatedUser=User.findById(user._id).select(
        "-password -refreshToken"
      )
      if(!CreatedUser){
        throw new ApiErrors(500,"Something went wrong");
      }

      return res.status(201).json(
        new ApiResponse(200, CreatedUser, "user register succesfully" )
      )


})

export {registerUser}
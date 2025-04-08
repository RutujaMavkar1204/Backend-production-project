import {asyncHandler} from '../utils/asyncHandler.js'
import {ApiErrors} from '../utils/ApiErrors.js'
import {User} from '../models/user.model.js'
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import {ApiResponse} from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'

const GenerateRefreshAndAccessTokens= async (userId)=>{
  try{
    const user=await User.findById(userId);
    const AccessToken= await user.generateAccessTokens()
    const RefreshToken= await user.generateRefreshTokens()

    user.refreshToken=RefreshToken;
    await user.save({validateBeforeSave: false})

    return { AccessToken,RefreshToken}


  }
  catch(error){
    console.log("error:",error)
    throw new ApiErrors(500, "something went wrong")
  }
}
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

      const ExistedUser=await User.findOne({
        $or:[{email}, {username}]
      })
      if(ExistedUser){
        throw new ApiErrors(409,"user already exist")
      }
      
      const avatarLocalPath=req.files?.avatar[0]?.path;

      let coverImageLocalPath
       
      if(req.files && Array.isArray(req.files.coverImage) &&req.files.coverImage.length>0){
        coverImageLocalPath=req.files?.coverImage[0]?.path;
      }
    

      const avatar=await uploadOnCloudinary(avatarLocalPath);
      const coverImage=await uploadOnCloudinary(coverImageLocalPath);
    
      if(!avatar){
        throw new ApiErrors(401,"avatar field is required")
      }

     const user=await User.create({
        fullName:fullName.toLowerCase,
        email,
        username,
        password,
        avatar:avatar.url,
        coverImage:coverImage?.url||"",

      })

      const CreatedUser=await User.findById(user._id).select(
        "-password -refreshToken"
      )
      if(!CreatedUser){
        throw new ApiErrors(500,"Something went wrong");
      }

      return res.status(201).json(
        new ApiResponse(200, CreatedUser, "user register succesfully" )
      )


})

const login=asyncHandler(async(req,res)=>{
  /*
  1.get detail from user
  2.check is user is present
  3.compare password
  4.generate refresh and access token
  5.send cookie 
   */ 


  const {email, username, password}=req.body
   
  if(!(username || email)){
    throw new ApiErrors(400, "username or email is required");
  }

  const user =await User.findOne({
    $or:[{username}, {email}]
  })
  if(!user){
    throw new ApiErrors(404, "No such user exists");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if(!isPasswordValid){
    throw new ApiErrors(400, "Invalid Credentials");
  }
  

const {AccessToken,RefreshToken}=await GenerateRefreshAndAccessTokens(user._id);

const loggedInUser= await User.findById(user._id).select(
  "-password -RefreshToken"
)
const options={
 httpOnly:true,
 secure:true
}
res.
status(200)
.cookie("RefreshToken", RefreshToken, options)
.cookie("AccessToken", AccessToken, options)
.json(
  new ApiResponse(
    200,
    {
      user:loggedInUser,RefreshToken, AccessToken
    },
    "user logged in successful"
  )
)



})

const logout=asyncHandler(async(req,res)=>{
        User.findByIdAndUpdate(
          req.user._id,
          {
            $set:{
              AccessToken:undefined
            }
          },
          {
            new:true
          }
        )
        const options={
          httpOnly:true,
          secure:true,

        }
        res
        .status(200)
        .clearCookie('AccessToken', options)
        .clearCookie('RefreshToken', options)
        .json(
          new ApiResponse(200,{},"user is logged out successfully "))
})

const refreshedAccessToken=asyncHandler(async(req,res)=>{
    try{
     const incomingRefreshToken= await req.cookies?.AccessToken||req.body.AccessToken

     if(incomingRefreshToken){
      throw new ApiErrors(401, 'unauthorized access');
     }

     const decodeToken= jwt.verify(incomingRefreshToken, process.env.ACCESS_TOKEN_SECRET)
     const user = await User.findById(decodeToken?._id);

     if(!user){
      throw new ApiErrors(401, 'invalid refresh token');
     }

     if(incomingRefreshToken!==user.refreshToken){
      throw new ApiErrors(401, 'refresh token is expired or used');
     }

     const {AccessToken,newRefreshToken}=await GenerateRefreshAndAccessTokens(user?._id)
      const options={
        secure:true,
        httpOnly:true
      }
      res
      .status(200)
      .cookie("AccessToken" ,AccessToken, options)
      .cookie("newRefreshToken" ,newRefreshToken, options)
      .json(
        new ApiResponse(200,{
          AccessToken,
          refreshToken:newRefreshToken
        },
      "Access Token is Refreshed")
      )




     




    }
    catch(error){
      
      throw new ApiErrors(400,error?.message||"Access token is not refreshed")
    }
})
export {
  registerUser,
  login,
  logout,
  refreshedAccessToken

}
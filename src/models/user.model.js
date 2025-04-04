import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,

    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,

    },
    fullName:{
        type:String,
        required:true,
        trim:true,
        index:true,

    },
    watchHistory:[
        {
        type:Schema.Types.ObjectId,
        ref:'Video',

    }
],
    coverImage:{
        type:String,//cloudnary

    },
    avatar:{
        type:String,
        required:true,

    },
    password:{
        type:String,
        required:[true,'password is required']

    },
    refreshToken:{
        type:String,

    },
},{timeStamps:true})

userSchema.pre('save',async function(next){
    if(!this.isModified("password")){return next()}
     this.password=await bcrypt.hash(this.password, 10)
    next();
})
userSchema.methods.isPasswordCorrect=async function(password){
  return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccesTokens=function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email:this.email
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:ACCESS_TOKEN_EXPIRY,
        }
    )
    
}
userSchema.methods.generateRefeshTokens=function(){
    return jwt.sign(
        {
            _id:this._id,

        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:REFRESH_TOKEN_EXPIRY
        }
    )
}
export const User=mongoose.model('User', userSchema)
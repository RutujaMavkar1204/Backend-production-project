import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SCECRET,

})

const uploadOnCloudinary=async()=>{
    try{
        if(!localFilepath)return null;
        const response=await cloudinary.uploader.upload(localFilepath,{
            resource_type:auto,
        })
        console.log('File is sucessfully uploaded on cloudinary',response.url);
        return response;

    }
    catch(error){
        fs.unlinkSync(localFilePath);
        return null;
    }
}
export {uploadOnCloudinary}
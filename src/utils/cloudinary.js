import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    // Function to upload an image to Cloudinary
    const uploadImageOnCloudinary=async (localFilePath)=>{
        try {
            if(!localFilePath) return null;
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:'auto'
            });
            //File uploaded Successfully on cloudinary  
            fs.unlinkSync(localFilePath)
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath)  //Remove The locally saved Temp file as the Upload option failed
            return null
        }
    }
export { uploadImageOnCloudinary};
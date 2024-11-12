import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
    // Configuration
    cloudinary.config({ 
        cloud_name:process.env.CLOUDINARY_NAME , 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    });
    
    // Function to upload an image to Cloudinary
    const UploadImageOnCloudinary=async (localFilePath)=>{
        try {
            if(!localFilePath) return null;
            const response = await cloudinary.uploader.upload(localFilePath,{
                resource_type:'auto'
            });
            //File uploaded Successfully on cloudinary  
            console.log("File Uploaded Successfully on cloudinary: ", response.url)
            return response;
        } catch (error) {
            fs.unlinkSync(localFilePath)  //Remove The locally saved Temp file as the Upload option failed
            return null
        }
    }
export { UploadImageOnCloudinary};
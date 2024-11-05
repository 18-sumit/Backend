import { v2 } from 'cloudinary'
import fs from 'fs' // fs = file system , to handle filesystem , delete (unlink file)


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLODINARY_API_KEY,
    api_secret: process.env.CLODINARY_API_SECRET
});



const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null

        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        // after  file has been uploaded successfully
        console.log('File is Uploaded on Cloudinary', response.url);
        return response;

    } catch (error) {
        fs.unlinkSync(localFilePath) // remove the locally saved temporaryfile as the upload operation got failed
        return null ;
    }
}


export {uploadOnCloudinary}
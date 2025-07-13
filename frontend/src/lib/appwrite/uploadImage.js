import { ID } from "appwrite";
import { appwriteConfig, storage } from "./config";

// import { ImageGravity } from "appwrite";
export async function uploadFile(file){
    // console.log("Uploading file:", file);
    // console.log(appwriteConfig);
    try {
        const uploadedFile  = await storage.createFile(
            appwriteConfig.storageId, // Storage ID
             ID.unique(), // // Unique ID for the file
            file
        );
        console.log("File uploaded yes:", uploadedFile);
        return uploadedFile;
   

        
    } catch (error) {
        console.log(error);
    }
}

export function getFilePreview(fileId){
    try {
        const fileUrl = storage.getFileView(
            appwriteConfig.storageId, // Storage ID
            fileId, // File ID
            2000,// Expiration time in seconds (optional)
            2000,
            'center',
            100
        );
        if(fileUrl === null){
           throw new Error("File not found or invalid file ID");
        }
        return fileUrl;
    } catch (error) {
        console.log(error);
    }
}
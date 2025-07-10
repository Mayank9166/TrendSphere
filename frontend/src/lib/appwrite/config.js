import { Client,storage} from 'appwrite';

export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    storageId: import.meta.env.VITE_APPWRITE_STORAGE_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
}
export const client = new Client();

client
    .setEndpoint(appwriteConfig.url) // Your Appwrite Endpoint')
    .setProject(appwriteConfig.projectId); // Replace with your project ID

export const storage = new Storage(client);
u

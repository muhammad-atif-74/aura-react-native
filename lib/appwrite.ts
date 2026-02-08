import { File } from '@/app/(tabs)/create';
import { Post } from '@/types';
import axios from "axios";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.atif.aura",
    projectId: "69609e79001d747179b4",
    databaseId: "69609fee002555a88898",
    usersTable: "users",
    videosTable: "videos",
    storageId: "6960a1e0001c0bdf052c"
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);


const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client);

export const createUser = async (email: string, password: string, username: string) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username);
        if (!newAccount) throw Error;

        const avatar = avatars.getInitials({
            name: username,
        }).toString();

        const newUser = await databases.createDocument({
            databaseId: appwriteConfig.databaseId,
            collectionId: appwriteConfig.usersTable,
            documentId: newAccount.$id,
            data: {
                accountId: newAccount.$id,
                username,
                email,
                avatar: avatar
            }
        })

        return newUser;
    }
    catch (err: any) {
        console.log("Error creating user:", err);
        throw new Error(err);
    }

}

export const signIn = async (email: string, password: string) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    }
    catch (err: any) {
        console.log("Error signing in:", err);
        throw new Error(err);
    }
}

export const signOut = async () => {
    try {
        if (!(await account.get())) {
            console.log("No user is currently signed in.");
            return;
        }
        await account.deleteSession('current');
        console.log("Signed out successfully")
    }
    catch (err: any) {
        console.log("Error signing out:", err);
        throw new Error(err);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentLoggedUser = await account.get();
        console.log("Current logged user:", currentLoggedUser);

        const currentUser = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersTable,
            currentLoggedUser.$id
        );

        console.log("Current user data:", currentUser);

        return currentUser;
    }
    catch (err: any) {
        if (err?.type === "user_unauthorized" || err?.code === 401) {
            return null;
        }

        console.log("Unexpected error getting current user:", err);
        throw err;
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videosTable,
            [Query.orderDesc('$createdAt'), Query.limit(10)]
        );

        // console.log("___ Posts from Appwrite:", posts);

        return posts.documents.map((doc) => ({
            $id: doc.$id,
            title: doc.title,
            prompt: doc.prompt,
            videoUrl: doc.video,
            thumbnailUrl: doc.thumbnail,
            createdAt: doc.$createdAt,
        })) as Post[]
    }
    catch (err: any) {
        console.log("Error getting posts:", err);
        throw new Error(err);
    }
}


export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videosTable,
            [Query.orderDesc('$createdAt'), Query.limit(10)]
        );

        console.log("___ Latest from Appwrite:", posts);

        return posts.documents.map((doc) => ({
            $id: doc.$id,
            title: doc.title,
            prompt: doc.prompt,
            videoUrl: doc.video,
            thumbnailUrl: doc.thumbnail,
            createdAt: doc.$createdAt,
        })) as Post[]
    }
    catch (err: any) {
        console.log("Error getting posts:", err);
        throw new Error(err);
    }
}

export const searchPosts = async (query: string) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videosTable,
            [Query.search('title', query)]
        );

        return posts.documents.map((doc) => ({
            $id: doc.$id,
            title: doc.title,
            prompt: doc.prompt,
            videoUrl: doc.video,
            thumbnailUrl: doc.thumbnail,
            createdAt: doc.$createdAt,
        })) as Post[]
    }
    catch (err: any) {
        console.log("Error getting posts:", err);
        throw new Error(err);
    }
}


export const getUserPosts = async (userId: string) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.videosTable,
            [Query.equal('creator', userId), Query.orderDesc('$createdAt') ]
        );

        return posts.documents.map((doc) => ({
            $id: doc.$id,
            title: doc.title,
            prompt: doc.prompt,
            videoUrl: doc.video,
            thumbnailUrl: doc.thumbnail,
            createdAt: doc.$createdAt,
        })) as Post[]
    }
    catch (err: any) {
        console.log("Error getting posts:", err);
        throw new Error(err);
    }
}

const uploadFile = async (
    file: any,
    type: "image" | "video"
) => {
    if (!file?.uri) return null;

    const formData = new FormData();

    formData.append("file", {
        uri: file.uri,
        name: file.name || `upload.${type === "image" ? "jpg" : "mp4"}`,
        type: file.mimeType || (type === "image" ? "image/jpeg" : "video/mp4"),
    } as any);

    formData.append("upload_preset", "Unsigned");

    const uploadUrl =
        type === "image"
            ? "https://api.cloudinary.com/v1_1/dslzcqalg/image/upload"
            : "https://api.cloudinary.com/v1_1/dslzcqalg/video/upload";

    const res = await axios.post(uploadUrl, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        timeout: 30000,
    });

    return res.data.secure_url;
};


interface PostData {
    title: string;
    video: File | null;
    thumbnail: File | null;
    prompt: string;
    userId: string;
}
export const createPost = async (formData: PostData) => {
    try {
        console.log("createPost: ", formData)
        const [thumbnailUrl, videoUrl] = await Promise.all([
            uploadFile(formData.thumbnail, 'image'),
            uploadFile(formData.video, 'video'),
        ]);

        console.log("Final data: ", {
            title: formData.title,
            prompt: formData.prompt,
            thumbnail: thumbnailUrl,
            video: videoUrl,
            creator: formData.userId
        })


        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.videosTable,
            ID.unique(),
            {
                title: formData.title,
                prompt: formData.prompt,
                thumbnail: thumbnailUrl,
                video: videoUrl,
                creator: formData.userId
            }
        )

        return newPost;

    }
    catch (err: any) {
        console.log("Error creating post:", err);
        throw new Error(err);
    }
}
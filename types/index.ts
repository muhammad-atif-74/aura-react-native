export type Post = {
    $id: string;
    title: string;
    prompt: string;
    videoUrl: string;
    thumbnailUrl: string;
    createdAt: string;
    creator: User;
    bookmarks: string[]; // array of userIds who bookmarked the post
}

export type User = {
    $id: string;
    username: string;
    avatar: string;
    email: string;
    createdAt?: string;
}
import { useGlobalContext } from '@/context/GlobalProvider';
import { bookmarkPost, deletePost } from '@/lib/appwrite';
import { Post } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, Text, TouchableOpacity, View } from 'react-native';

const VideoCard = ({ post: { $id, title, thumbnailUrl, videoUrl, prompt, bookmarks }, isOwnItem = false }: { post: Post, isOwnItem?: boolean }) => {
    const [play, setPlay] = useState(false);
    const { user, setRefreshFeed } = useGlobalContext();
    const [loadingImage, setLoadingImage] = useState(true);

    const isBookmarked = bookmarks?.includes(user && user.$id);

    const handlebookmark = async (id: string, bookmark: boolean) => {
        try {
            await bookmarkPost(id, user.$id, bookmark);
            setRefreshFeed(true); // Trigger feed refresh after bookmarking
        }
        catch (err: any) {
            Alert.alert("Error", "Failed to bookmark the post. Please try again.");
        }
    }

    const handleDelete = async (id: string) => {
        try{
            await deletePost(id);
            Alert.alert("Success", "Post deleted successfully.");
            setRefreshFeed(true); // Trigger feed refresh after deletion
        }
        catch(err: any){
            Alert.alert("Error", "Failed to delete the post. Please try again.");
        }

    }

    return (
        <View className='flex-col items-center px-4 mb-14'>
            <View className='flex-row gap-3 items-center'>
                <View className='justify-center items-center flex-1 flex-row'>
                    <View className='relative w-[64px] h-[64px] rounded-lg border border-secondary justify-center items-center p-0.5'>
                        <Image
                            source={{ uri: thumbnailUrl }}
                            className='w-full h-full rounded-lg'
                            resizeMode='cover'

                        />


                    </View>
                    <View className='flex-1 ml-3 justify-center gap-y-1'>
                        <Text className='text-white text-sm font-semibold' numberOfLines={1}>{title}</Text>
                        <Text className='text-xs text-gray-100 ' numberOfLines={1}>{user && user.username || "username"}</Text>

                    </View>
                </View>

                <View className='pt-2 flex items-center flex-row gap-4'>
                    {
                        isOwnItem &&
                        <TouchableOpacity activeOpacity={0.7} onPress={() => handleDelete($id)}>
                            <FontAwesome name="trash-o" size={18} color="white" />
                        </TouchableOpacity>
                    }
                    <TouchableOpacity activeOpacity={0.7} onPress={() => handlebookmark($id, isBookmarked ? false : true)}>
                        {
                            isBookmarked ? (
                                <FontAwesome name="heart" size={18} color="red" />
                            ) : (
                                <FontAwesome name="heart-o" size={18} color="white" />
                            )
                        }
                    </TouchableOpacity>
                </View>
            </View>

            {
                play ? (
                    <View

                        className="w-full h-60 rounded-xl"
                    >
                        <Video
                            source={{ uri: videoUrl }}
                            className='w-full h-60 rounded-xl'
                            resizeMode={ResizeMode.CONTAIN}
                            style={{ width: '100%', height: '100%' }}
                            useNativeControls
                            shouldPlay
                            onPlaybackStatusUpdate={status => {
                                if (status.didJustFinish) {
                                    setPlay(false);
                                }
                            }}
                        />

                    </View>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setPlay(true)}
                        className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'>
                        <Image
                            source={{ uri: thumbnailUrl }}
                            className='w-full h-full rounded-xl mt-3'
                            resizeMode='cover'
                            onLoadStart={() => setLoadingImage(true)}
                            onLoadEnd={() => setLoadingImage(false)}
                        />
                        {
                            loadingImage && (
                                <View className='absolute inset-0 justify-center items-center bg-gray-300 rounded-lg'>
                                    <ActivityIndicator size="small" color="#999" className='mt-2' />
                                </View>
                            )
                        }
                        {
                            !loadingImage && (
                                <FontAwesome className='absolute' name="play-circle" size={48} color="gray" />

                            )
                        }

                    </TouchableOpacity>
                )
            }

        </View>
    )
}

export default VideoCard
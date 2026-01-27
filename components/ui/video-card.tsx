import { Post } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { ResizeMode, Video } from 'expo-av';
import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

const VideoCard = ({ post: { title, thumbnailUrl, videoUrl, prompt, creator: { username, avatar } } }: { post: Post }) => {
    const [play, setPlay] = useState(false)
    return (
        <View className='flex-col items-center px-4 mb-14'>
            <View className='flex-row gap-3 items-start'>
                <View className='justify-center items-center flex-1 flex-row'>
                    <View className='w-[64px] h-[64px] rounded-lg border border-secondary justify-center items-center p-0.5'>
                        <Image
                            source={{ uri: thumbnailUrl }}
                            className='w-full h-full rounded-lg'
                            resizeMode='cover'
                        />

                    </View>
                    <View className='flex-1 ml-3 justify-center gap-y-1'>
                        <Text className='text-white text-sm font-semibold' numberOfLines={1}>{title}</Text>
                        <Text className='text-xs text-gray-100 ' numberOfLines={1}>{"username"}</Text>

                    </View>
                </View>

                <View className='pt-2'>
                    <MaterialCommunityIcons name="dots-vertical" size={24} color="white" />
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
                ): (
                    <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setPlay(true)}
                    className='w-full h-60 rounded-xl mt-3 relative justify-center items-center'>
                        <Image
                            source={{ uri: thumbnailUrl }}
                            className='w-full h-full rounded-xl mt-3'
                            resizeMode='cover'
                        />
                       <FontAwesome className='absolute' name="play-circle" size={48} color="gray" />

                    </TouchableOpacity>
                )
            }

        </View>
    )
}

export default VideoCard
import { Post } from '@/types';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ResizeMode, Video } from 'expo-av';
import React from 'react';
import { ActivityIndicator, FlatList, ImageBackground, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';

const zoomIn: Animatable.CustomAnimation = {
    from: {
        transform: [{ scale: 0.9 }],
    },
    to: {
        transform: [{ scale: 1.1 }],
    },
}

const zoomOut = {
    from: {
        transform: [{ scale: 1.1 }],
    },
    to: {
        transform: [{ scale: 0.9 }],
    },
}

export const TrendingItem = ({ activeItem, item }: { activeItem: string, item: Post }) => {
    const [playing, setPlaying] = React.useState(false);
    const [loadingImage, setLoadingImage] = React.useState(true);
    return (
        <Animatable.View
            className='mr-5 '
            animation={activeItem === item.$id ? zoomIn : zoomOut}
            duration={500}
        >
            {
                playing ? (
                    <View

                        className="w-52 h-72 mt-3 rounded-[35px] overflow-hidden shadow-lg bg-white/10 justify-center items-center"
                    >
                        <Video
                            source={{ uri: item.videoUrl }}
                            className='w-52 h-72 rounded-[35px] mt-3 shadow-lg bg-white/10'
                            resizeMode={ResizeMode.CONTAIN}
                            style={{ width: '100%', height: '100%' }}
                            useNativeControls
                            shouldPlay
                            onPlaybackStatusUpdate={status => {
                                if (status.didJustFinish) {
                                    setPlaying(false);
                                }
                            }}
                        />

                    </View>
                ) : (
                    <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={() => setPlaying(true)}
                        className='relative justify-center items-center'>
                        <ImageBackground
                            source={{ uri: item.thumbnailUrl }}
                            className='w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40'
                            resizeMode='cover'
                            onLoadStart={() => setLoadingImage(true)}
                            onLoadEnd={() => setLoadingImage(false)}
                        />
                        {
                            loadingImage && (
                                <View className='absolute w-full h-full  rounded-[35px] inset-0 justify-center items-center bg-gray-300'>
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

        </Animatable.View>
    )
}

interface TrendingProps {
    posts: Post[];
}

const Trending = ({ posts }: TrendingProps) => {
    const [activeItem, setActiveItem] = React.useState<string>(
        posts && posts.length > 0 ? posts[0].$id : ''
    );
    const viewableItemsChanged = ({ viewableItems }: any) => {
        if (viewableItems.length > 0) {
            setActiveItem(viewableItems[0].key);
        }
    }
    return (
        <FlatList
            data={posts}
            keyExtractor={(item) => item.$id.toString()}
            renderItem={({ item }) => (
                <TrendingItem activeItem={activeItem} item={item} />
            )}
            onViewableItemsChanged={viewableItemsChanged}
            viewabilityConfig={{
                itemVisiblePercentThreshold: 70
            }}
            contentOffset={{ x: 170, y: 0 }}
            horizontal
        />
    )
}

export default Trending
import EmptyState from '@/components/ui/empty-state'
import SearchInput from '@/components/ui/search-input'
import Trending from '@/components/ui/trending'
import VideoCard from '@/components/ui/video-card'
import { Images } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalProvider'
import useAppwrite from '@/hooks/use-appwrite'
import { getAllPosts, getLatestPosts } from '@/lib/appwrite'
import { Post } from '@/types'
import React, { useEffect, useState } from 'react'
import { FlatList, Image, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Home = () => {
  const [refreshing, setRefreshing] = useState(false)
    const { user, refreshFeed, setRefreshFeed } = useGlobalContext()
  
  const {
    data: posts,
    refetch,
    dataLoading: postsLoading
  } = useAppwrite<Post[]>(getAllPosts)

  const {
    data: latestPosts,
    refetch: refetchLatestPosts,
    dataLoading: latestPostsLoading
  } = useAppwrite<Post[]>(getLatestPosts)


  const onRefresh = async () => {
    setRefreshing(true)
    // fetch videos
    await refetch()
    await refetchLatestPosts()
    setRefreshing(false)
  }

  useEffect(() => {
    if (refreshFeed) {
      onRefresh()
      setRefreshFeed(false)
    }
  }, [refreshFeed])
 
  return (
    <SafeAreaView className='bg-primary h-full'>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => (
          <VideoCard post={item} />
        )}

        ListHeaderComponent={() => (
          <View className='my-6 px-4 space-y-6'>
            <View className='flex-row items-center justify-between mb-6'>
              <View>
                <Text className='text-sm text-gray-100 font-medium mb-2'>Welcome Back</Text>
                <Text className='text-2xl text-white font-semibold font-poppins'>{user && user?.username || "Guest"}</Text>
              </View>
              <View className=''>
                <Image
                  source={Images.logoSm}
                  className='w-9 h-9'
                  resizeMode='contain'
                />
              </View>
            </View>


            {/* searchbar  */}
            <SearchInput />

            <View className='pt-5 flex-1 w-full'>
              <Text className='text-[#CDCDE0] text-base mb-4'>Latest videos</Text>

              <Trending posts={latestPosts}/>
              
            </View>
          </View>
          
        )}

        ListEmptyComponent={() => (
          <EmptyState title='No videos found' subTitle='Be the first to create new video'/>
        )}

        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

    </SafeAreaView>
  )
}

export default Home
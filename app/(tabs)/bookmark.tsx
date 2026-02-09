import EmptyState from '@/components/ui/empty-state'
import VideoCard from '@/components/ui/video-card'
import { useGlobalContext } from '@/context/GlobalProvider'
import useAppwrite from '@/hooks/use-appwrite'
import { getBookmarks } from '@/lib/appwrite'
import { Post } from '@/types'
import React, { useEffect, useState } from 'react'
import { FlatList, RefreshControl, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const bookmark = () => {
  const { user, refreshFeed, setRefreshFeed } = useGlobalContext()
  const [refreshing, setRefreshing] = useState(false)

  
  const {
    data: posts,
    refetch,
    dataLoading: postsLoading
  } = useAppwrite<Post[]>(() => getBookmarks(user.$id))

  const onRefresh = async () => {
    setRefreshing(true)
    // fetch videos
    await refetch()
    // await getBookmarks(user.$id)
    setRefreshing(false)
  }

  useEffect(() => {
    if(refreshFeed){
      onRefresh()
      setRefreshFeed(false)
    }
  }, [refreshFeed])

  if(!user) return


  return (
    <SafeAreaView className='bg-primary h-full '>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => (
          <VideoCard post={item} />
        )}

        ListHeaderComponent={() => (
          <View className='my-6 px-4 w-full justify-center  mb-2 mt-6'>
            <Text className='text-[22px] font-medium font-poppins mb-[40px] text-white'>Bookmarks</Text>
          </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState title='No videos found' subTitle='No videos found for this search query' />
        )}

        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}

      />
    </SafeAreaView>

  )
}

export default bookmark
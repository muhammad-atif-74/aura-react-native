import EmptyState from '@/components/ui/empty-state'
import SearchInput from '@/components/ui/search-input'
import VideoCard from '@/components/ui/video-card'
import { Images } from '@/constants/theme'
import useAppwrite from '@/hooks/use-appwrite'
import { searchPosts } from '@/lib/appwrite'
import { Post } from '@/types'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect } from 'react'
import { FlatList, Image, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Search = () => {
  const {query } = useLocalSearchParams()

  const searchQuery =
  typeof query === 'string' ? query : ''

  const {
    data: posts,
    refetch,
    dataLoading: postsLoading
  } = useAppwrite<Post[]>(() => searchPosts(searchQuery))

  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className='bg-primary h-full'>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => (
          <VideoCard post={item} />
        )}

        ListHeaderComponent={() => (
          <View className='my-6 px-4 '>
            <View className='flex-row items-center justify-between mb-6'>
              <View>
                <Text className='text-sm text-gray-100 font-medium'>Search Results</Text>
                <Text className='text-2xl text-white font-semibold font-poppins'>{query}</Text>
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
            <SearchInput initialQuery={searchQuery}/>
  
          </View>
          
        )}

        ListEmptyComponent={() => (
          <EmptyState title='No videos found' subTitle='No videos found for this search query'/>
        )}

      
      />

    </SafeAreaView>
  )
}

export default Search
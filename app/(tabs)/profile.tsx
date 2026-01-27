import EmptyState from '@/components/ui/empty-state'
import InfoBox from '@/components/ui/info-box'
import VideoCard from '@/components/ui/video-card'
import { useGlobalContext } from '@/context/GlobalProvider'
import useAppwrite from '@/hooks/use-appwrite'
import { getUserPosts, signOut } from '@/lib/appwrite'
import { Post } from '@/types'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { router } from 'expo-router'
import React from 'react'
import { FlatList, Image, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Profile = () => {
  const { user, isLoggedIn, setIsLoggedIn, setUser } = useGlobalContext()

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);
    router.replace('/signIn');
  }

  if(!user) return
  
  const {
    data: posts,
    refetch,
    dataLoading: postsLoading
  } = useAppwrite<Post[]>(() => getUserPosts(user.$id))

  return (
    <SafeAreaView className='bg-primary h-full'>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => (
          <VideoCard post={item} />
        )}

        ListHeaderComponent={() => (
          <View className='my-6 px-4 w-full justify-center items-center mb-12 mt-6'>
            <TouchableOpacity className='w-full items-end mb-10' onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={24} color="red" />
            </TouchableOpacity>

            <View className='w-16 h-16 border border-secondary rounded-lg justify-center items-center'>
              <Image 
                source={{ uri: user?.avatar }}
                className='w-[90%] h-[90%] rounded-lg'
                resizeMode='cover'
              />

            </View>

            <InfoBox title={user?.username} containerStyles="mt-5" titleStyles="text-lg" />

            <View className='mt-5 flex-row'>
            <InfoBox title={posts?.length || 0} subTitle='Posts' containerStyles="mr-10" titleStyles="text-xl" />
            <InfoBox title={"1.2k"} subTitle='Followers' titleStyles="text-xl" />

            </View>
          </View> 

        )}

        ListEmptyComponent={() => (
          <EmptyState title='No videos found' subTitle='No videos found for this search query' />
        )}


      />

    </SafeAreaView>
  )
}

export default Profile
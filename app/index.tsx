import CustomButton from '@/components/ui/custom-button'
import { Images } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalProvider'
import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  const {isLoading, isLoggedIn} = useGlobalContext();
  console.log("Index - isLoading:", isLoading, "isLoggedIn:", isLoggedIn);
  if(!isLoading && isLoggedIn) return <Redirect href={'/home'} />
  
  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full min-h-[85vh] items-center justify-center px-4">
          <Image
            source={Images.logo}
            className='w-[130px] h-[84px]]'
            resizeMode='contain'
          />
          <Image
            source={Images.splash}
            className='max-w-[389px] w-full h-[300px] '
            resizeMode='contain'
          />

          <View className='relative mt-5'>
            <Text className='text-3xl text-center text-white font-bold font-poppins'>Discover Endless Possibilities with {" "}
              <Text className='text-secondary'>Aora</Text>
            </Text>
            <Image
              source={Images.underline}
              className='w-[80px] h-[12px] absolute -bottom-2 right-[115px]'
              resizeMode='contain'
            />
          </View>

          <Text className='text-sm text-center text-white mt-6'>Where Creativity Meets Innovation: Embark on a Journey of Limitless Exploration with Aora</Text>

          <CustomButton 
            title='Continue with Email'
            handlePress={() => {router.push('/signIn')}}
            containerStyles={"w-full mt-7"}
            isLoading={false}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  )
}

export default index
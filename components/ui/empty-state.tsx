import { Images } from '@/constants/theme'
import { router } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'
import CustomButton from './custom-button'

const EmptyState = ({ title, subTitle }: { title: string, subTitle: string }) => {
    return (
        <View className='justify-center items-center px-4'>
            <Image
                source={Images.emptyState}
                className='w-48 h-48 mb-6'
                resizeMode='contain'
            />
            <Text className='text-xl text-white font-medium font-poppins'>{title}</Text>
            <Text className='text-sm text-gray-100 font-medium mt-2'>{subTitle}</Text>
            <CustomButton title='Create video' handlePress={() => {router.push('/create')}} containerStyles={"w-full my-5"}></CustomButton>
        </View>
    )
}

export default EmptyState
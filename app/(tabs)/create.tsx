import CustomButton from '@/components/ui/custom-button'
import FormField from '@/components/ui/form-field'
import { useGlobalContext } from '@/context/GlobalProvider'
import { createPost } from '@/lib/appwrite'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import { ResizeMode, Video } from 'expo-av'
import * as DocumentPicker from 'expo-document-picker'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export interface File {
  lastModified: number;
  mimeType?: string | undefined;
  name: string;
  size?: number | undefined;
  uri: string;
}

interface FormState {
  title: string;
  video: File | null;
  thumbnail: File | null;
  prompt: string;
}

const create = () => {
  const {user, setRefreshFeed} = useGlobalContext()

  const [uploading, setuploading] = useState(false)
  const [form, setform] = useState<FormState>({
    title: "",
    video: null,
    thumbnail: null,
    prompt: ""
  })
  const [videoError, setVideoError] = useState(false)

  const openPicker = async (type: "video" | "image") => {
    const result = await DocumentPicker.getDocumentAsync({
      type: type === "video" ? "video/*" : "image/*",
      copyToCacheDirectory: true
    })

    console.log("PICKER RESULT :___: ", result)

    if (!result.canceled) {
      if (type === "image") {
        setform({ ...form, thumbnail: result.assets[0] })
      }
      else if (type === "video") {
        setform({ ...form, video: result.assets[0] })
      }
    }
   
  }

  const handleSubmit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert("Error", "Please fill all the fields")
      return
    }

    setuploading(true)
    try{
      await createPost({...form, userId: user.$id})

      Alert.alert("Success", "Your post has been uploaded successfully!")
      setRefreshFeed(true)
      router.push('/home')
    }
    catch(err){
      Alert.alert("Error", err instanceof Error ? err.message : "An error occurred")
    }
    finally{
      setuploading(false)
      setform({
        title: "",
        video: null,
        thumbnail: null,
        prompt: ""
      })
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full '>
      <ScrollView className='my-6 px-4'>
        <Text className='text-[22px] font-medium font-poppins mb-[40px] text-white'>Upload Video</Text>

        <View className='flex flex-col gap-[22px]'>
          <FormField
            title="Video Title"
            value={form.title}
            handleChange={(text) => setform({ ...form, title: text })}
            otherStyles={""}
            placeholder='Give your video a catchy title'
          />

          <View>
            <Text className='text-base text-gray-100 font-medium mb-3'>Upload Video</Text>
            <TouchableOpacity onPress={() => openPicker("video")}>
              {
                form.video ? (
                  <View className="w-full h-[220px]">
                    {!videoError ? (
                      <Video
                        source={{ uri: form.video.uri }}
                        resizeMode={ResizeMode.COVER}
                        className='w-full h-[220px] rounded-lg'
                        useNativeControls
                        isLooping
                        shouldPlay={false}
                        style={{ width: '100%', height: 220 }}
                        onError={() => setVideoError(true)}
                      />
                    ) : (
                      <View className='w-full h-[220px] bg-[#1E1E2D] rounded-lg items-center justify-center'>
                        <FontAwesome5 name="video" size={40} color="#F59E0B" />
                        <Text className='text-white mt-2'>Video Selected</Text>
                        <Text className='text-gray-400 text-xs mt-1'>{form.video.name}</Text>
                      </View>
                    )}
                  </View>
                ) : (
                  <View className='w-full h-[150px] flex items-center justify-center rounded-lg bg-[#1E1E2D]'>
                    <View className='w-14 h-14 border border-dashed border-secondary flex items-center justify-center'>
                      <FontAwesome5 name="upload" size={20} color="#F59E0B" />
                    </View>
                  </View>
                )
              }
            </TouchableOpacity>
          </View>


          <View>
            <Text className='text-base text-gray-100 font-medium mb-3'>Thumbnail Image</Text>
            <TouchableOpacity onPress={() => openPicker("image")}>
              {
                form.thumbnail ? (
                  <Image
                    source={{ uri: form.thumbnail.uri }}
                    resizeMode={"cover"}
                    className='w-full h-[220px] rounded-lg'
                  />
                ) : (
                  <View className='w-full py-8 flex items-center justify-center rounded-lg bg-[#1E1E2D]'>
                    <View className='flex flex-row gap-4 items-center justify-center'>
                      <FontAwesome5 name="upload" size={20} color="#F59E0B" />
                      <Text className='text-sm text-gray-100 mt-2'>Choose a file</Text>
                    </View>
                  </View>
                )
              }
            </TouchableOpacity>
          </View>

          <FormField
            title="AI prompt"
            value={form.prompt}
            handleChange={(text) => setform({ ...form, prompt: text })}
            otherStyles={""}
            placeholder='The AI prompt of the video'
          />

          <CustomButton
            title='Submit and Publish'
            handlePress={handleSubmit}
            isLoading={uploading}
          />
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default create
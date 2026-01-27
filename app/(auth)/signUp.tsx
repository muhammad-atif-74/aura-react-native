import CustomButton from '@/components/ui/custom-button'
import FormField from '@/components/ui/form-field'
import { Images } from '@/constants/theme'
import { useGlobalContext } from '@/context/GlobalProvider'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, Image, ScrollView, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const signUp = () => {
  const {setUser, setIsLoggedIn} = useGlobalContext();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  })
  const [isSubmitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password) {
      Alert.alert("Error", "Please fill all the fields")
      return
    }
    setSubmitting(true)
    try {
      const result = await createUser(form.email, form.password, form.username)
      setUser(result)
      setIsLoggedIn(true)
      router.replace('/home')
    }
    catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "An error occurred")
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView className='bg-primary h-full'>
      <ScrollView>
        <View className='w-full justify-center h-[85vh] px-4 my-6'>
          <Image
            source={Images.logo}
            resizeMode='contain'
            className='w-[115px] h-[35px]'
          />

          <Text className='text-white font-semibold text-2xl mt-10'>Sign up</Text>

          <FormField
            title="Username"
            value={form.username}
            handleChange={(text) => setForm({ ...form, username: text })}
            otherStyles={"mt-10"}
          />

          <FormField
            title="Email"
            value={form.email}
            handleChange={(text) => setForm({ ...form, email: text })}
            otherStyles={"mt-7"}
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChange={(text) =>
              setForm({ ...form, password: text })
            }
            otherStyles={"mt-7"}
          />

          <CustomButton
            title='Sign in'
            handlePress={handleSubmit}
            isLoading={isSubmitting}
            containerStyles={"mt-8"}
          />

          <View className='justify-center items-center flex-row pt-5 gap-2'>
            <Text className='text-sm font-semibold text-gray-100'>Already have an account?</Text>
            <Link href={'/signIn'} className='text-sm font-semibold text-secondary'>
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default signUp
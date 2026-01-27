import AntDesign from '@expo/vector-icons/AntDesign';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

interface FormFieldProps {
    title: string;
    handleChange: (text: string) => void;
    value: string;
    otherStyles?: any;
    keyboardType?: any;
    placeholder?: string;
}

const FormField = ({title, handleChange, value, otherStyles, keyboardType, placeholder} : FormFieldProps) => {
    const [showPassword, setShowPassword] = useState(false)
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className='text-base text-gray-100 font-medium mb-3'>{title}</Text>
      <View className='w-full h-16 px-4 bg-[#1E1E2D] rounded-xl focus:border-secondary justify-center border border-[#232533] flex-row items-center'>
        <TextInput 
            className='flex-1 text-white font-semibold text-base'
            value={value}
            placeholder={placeholder}
            placeholderTextColor={"#7b7b8b"}
            onChangeText={handleChange}
            secureTextEntry={title === "Password" && !showPassword}
            keyboardType={keyboardType}
        />
        {
            title === "Password" && 
            <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            >
                {
                    !showPassword ? 
                    <AntDesign name="eye" size={24} color="#7B7B8B" />
                    : 
                    <AntDesign name="eye-invisible" size={24} color="#7B7B8B" />
                }
            </TouchableOpacity>
        }
      </View>
    </View>
  )
}

export default FormField
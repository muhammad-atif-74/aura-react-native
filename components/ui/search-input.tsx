
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, usePathname } from 'expo-router';
import React, { useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';

const SearchInput = ({initialQuery}: {initialQuery?: string}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");


  return (
    <View className={`space-y-2 `}>

      <View className='w-full h-16 px-4 bg-[#1E1E2D] rounded-xl focus:border-secondary justify-center border border-[#232533] flex-row items-center'>
        <TextInput
          className='text-base mt-0.5 text-[#CDCDE0] flex-1'
          value={query}
          placeholder={"Search for a video topic"}
          placeholderTextColor={"#cdcde0"}
          onChangeText={(e) => setQuery(e)}
          keyboardType={"default"}
        />

        <TouchableOpacity onPress={() => {
          if (!query) {
            Alert.alert("Missing query", "Please enter a search query");
            return;
          }
          if (pathname.startsWith("/search")) {
            router.setParams({ query });
          }
          else {
            router.push(`/search/${query}`);
          }
        }}>
          <Ionicons name="search-sharp" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SearchInput
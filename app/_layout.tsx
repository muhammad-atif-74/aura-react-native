import GlobalProvider from '@/context/GlobalProvider';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import '../global.css';

// appname
// APPWRITE_PROJECT_ID: "69609e79001d747179b4"
// APPWRITE_PROJECT_NAME: "react-native-aura"
// APPWRITE_PUBLIC_ENDPOINT: "https://fra.cloud.appwrite.io/v1"

SplashScreen.preventAutoHideAsync(); // prevent splash screen from autohiding

const RootLayout = () => {
  const [fontsLoaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
  })

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  return (
    // <Slot />
    <GlobalProvider>
      <Stack>
        <Stack.Screen
          name='index'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='(auth)'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name='(tabs)'
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
        name='search/[query]'
        options={{
          headerShown: false
        }}
        />
      </Stack>
    </GlobalProvider>

  )
}

export default RootLayout

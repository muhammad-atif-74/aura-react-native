import { Icons } from '@/constants/theme'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, Text, View } from 'react-native'

const TabIcon = ({ color, focused, icon, name }: { color: string, focused: boolean, icon: any, name: string }) => {
    return (
        <View className='items-center justify-center gap-1 min-w-14'>
            <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className='w-6 h-6'
            />
            <Text
                numberOfLines={1}
                className={`${focused ? 'font-bold' : 'font-semibold'} text-[10px]`} style={{ color: color }}>
                {name}
            </Text>
        </View>
    )
}

const _layout = () => {
    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#FFA001',
                    tabBarInactiveTintColor: '#CDCDE0',
                    tabBarStyle: {
                        backgroundColor: '#161622',
                        borderTopColor: '#232533',
                        borderTopWidth: 1,
                        height: 84
                    }
                }}
            >
                <Tabs.Screen
                    name='home'
                    options={{
                        headerShown: false,
                        title: 'Home',
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                color={color}
                                focused={focused}
                                icon={Icons.home}
                                name={"Home"}
                            />
                        )
                    }}
                />
                <Tabs.Screen
                    name='bookmark'
                    options={{
                        headerShown: false,
                        title: 'Bookmark',
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                color={color}
                                focused={focused}
                                icon={Icons.bookmark}
                                name={"Bookmark"}
                            />
                        )
                    }}
                />
                <Tabs.Screen
                    name='create'
                    options={{
                        headerShown: false,
                        title: 'Create',
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                color={color}
                                focused={focused}
                                icon={Icons.plus}
                                name={"Create"}
                            />
                        )
                    }}
                />
                <Tabs.Screen
                    name='profile'
                    options={{
                        headerShown: false,
                        title: 'Profile',
                        tabBarIcon: ({ color, focused }) => (
                            <TabIcon
                                color={color}
                                focused={focused}
                                icon={Icons.profile}
                                name={"Profile"}
                            />
                        )
                    }}
                />
            </Tabs>
        </>
    )
}

export default _layout
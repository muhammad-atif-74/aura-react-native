import React from 'react';
import { Text, View } from 'react-native';

interface InfoBoxProps {
    title?: string | number;
    subTitle?: string;
    containerStyles?: string;
    titleStyles?: string;
    subTitleStyles?: string;
}
const InfoBox = ({ title, subTitle, containerStyles, titleStyles }: InfoBoxProps) => {
    return (
        <View className={containerStyles}>
            <Text className={`text-white text-center font-semibold ${titleStyles}`}>{title}</Text>
            <Text className={`text-gray-400 text-center text-sm`}>{subTitle}</Text>
        </View>
    )
}

export default InfoBox
import React from 'react';
import { TextInputProps } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';

export const PDTextInput : React.FC<TextInputProps> = (props)=> {
    return (
        <TextInput
        { ...props }
        allowFontScaling
        maxFontSizeMultiplier={ 1.4 }
    />
    );
};

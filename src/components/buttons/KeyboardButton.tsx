import React from 'react';
import { InputAccessoryView, StyleSheet, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import { PDText } from '../PDText';
import { PDSpacing, PDColor, useTheme } from '../PDTheme';
import { PDView } from '../PDView';
import { PlatformSpecific } from '../PlatformSpecific';

interface KeyboardButtonProps extends TouchableOpacityProps {
    nativeID: string;
    bgColor?: PDColor;
    textColor?: PDColor
}

export const KeyboardButton : React.FC<KeyboardButtonProps> = (props) => {
    const { nativeID, bgColor = 'greyLight', textColor = 'white', children, ...touchableProps } = props;
    const theme = useTheme();

    const backgroundColor = theme.colors[bgColor];

    return (
        <PlatformSpecific include={ ['ios'] }>
            <InputAccessoryView nativeID={ nativeID } >
                <PDView style={ [styles.keyboardAccessoryContainer, { backgroundColor: theme.colors.white }] }>
                    <TouchableOpacity { ...touchableProps }  style={ [styles.buttonContainer, { backgroundColor }] } >
                        <PDText type="subHeading" color={ textColor } >
                            {children}
                        </PDText>
                    </TouchableOpacity>
                </PDView>
            </InputAccessoryView>
        </PlatformSpecific>
    );
};

const styles = StyleSheet.create({
    keyboardAccessoryContainer: {
        paddingHorizontal: PDSpacing.lg,
        paddingVertical: PDSpacing.md,
    },
    keyboardAccessoryButton: {
        marginHorizontal: PDSpacing.lg,
    },
    buttonContainer: {
        height: 40,
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

import React from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewProps } from 'react-native';
import TouchableScale, { TouchableScaleProps } from 'react-native-touchable-scale';

import { PDText } from '../PDText';
import { PDColor, PDSpacing, PDTextType, useTheme } from '../PDTheme';
import { PDView } from '../PDView';

export interface PDButtonProps extends ViewProps {
    onPress: () => void;
    touchableProps?: TouchableScaleProps;
    textStyle?: StyleProp<TextStyle>;
    textType?: PDTextType;
    textColor?: PDColor;
    bgColor?: PDColor;
}

export const PDButton: React.FC<PDButtonProps> = (props) => {
    const {
        onPress,
        children,
        style,
        textStyle,
        textType = 'subHeading',
        bgColor = 'blue',
        textColor = 'white',
        ...rest
    } = props;
    const theme = useTheme();

    const backgroundColor = bgColor !== undefined ? theme.colors[bgColor] : 'transparent';
    const colorStylesFromTheme = { backgroundColor };

    const viewStyles = StyleSheet.flatten([colorStylesFromTheme, style]);

    const hitSlop = 5;

    const touchableProps: TouchableScaleProps = {
        onPress,
        activeScale: 0.97,
        hitSlop: { top: hitSlop, left: hitSlop, bottom: hitSlop, right: hitSlop },
    };

    return (
        <TouchableScale { ...touchableProps } onPress={ onPress }>
            <PDView style={ [styles.container, viewStyles] } { ...rest }>
                <PDText type={ textType } color={ textColor } style={ textStyle }>
                    {children}
                </PDText>
            </PDView>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PDSpacing.lg,
        paddingVertical: PDSpacing.md,
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

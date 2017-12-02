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
    icon?: JSX.Element
    title: string;
}

export const PDButtonSolid: React.FC<PDButtonProps> = (props) => {
    const {
        onPress,
        style,
        textStyle,
        textType = 'buttonSmall',
        bgColor = 'blue',
        textColor = 'white',
        icon,
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
                {!!icon && (
                    <PDView style={ styles.iconContainer }>
                        {icon}
                    </PDView>
                )}
                <PDText type={ textType } color={ textColor } style={ textStyle }>
                    {props.title}
                </PDText>
            </PDView>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: PDSpacing.md,
        paddingVertical: 6,
        marginHorizontal: PDSpacing.sm,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    iconContainer:{
        marginRight: 4,
    },
});

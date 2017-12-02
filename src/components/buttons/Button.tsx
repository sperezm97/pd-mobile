import * as React from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';
import { PDText } from '~/components/PDText';
import { PDColor, useTheme } from '~/components/PDTheme';

interface ButtonProps {
    title: string;

    onPress: () => void;

    styles?: any;

    textStyles?: any;

    textColor?: PDColor;

    disabled?: boolean;

    hitSlop?: number;

    bgColor?: PDColor;
}

export const Button:React.FC<ButtonProps> = (props) => {
    const theme = useTheme();

    const handleButtonPress = () => {
        props.onPress();
    };

    const bgColor = theme.colors[props.bgColor ?? 'transparent'];
    const slop = props.hitSlop || 0;

    return (
        <TouchableScale
            style={ [{ backgroundColor: bgColor }, props.styles] }
            onPress={ handleButtonPress }
            disabled={ props.disabled }
            activeScale={ 0.97 }
            hitSlop={ { top: slop, left: slop, bottom: slop, right: slop } }>
            <PDText
                type="default"
                color={ props.textColor ?? 'white' }
                style={ props.textStyles ? props.textStyles : styles.text }>
                {props.title}
            </PDText>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    text: {
        flex: 1,
        textAlign: 'center',
        margin: '.5%',
    },
});

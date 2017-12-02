import * as React from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';
import { PDColor } from '../PDTheme';

interface ButtonProps {
    onPress: () => void;

    styles?: any;

    textStyles?: any;

    textColor?: PDColor;

    disabled?: boolean;

    hitSlop?: number;
}

export const ButtonWithChildren: React.FunctionComponent<ButtonProps> = (props) => {
    const handleButtonPress = () => {
        props.onPress();
    };

    const slop = props.hitSlop || 0;
    const propStyles = StyleSheet.flatten(props.styles);
    return (
        <TouchableScale
            style={ [styles.container, propStyles] }
            onPress={ handleButtonPress }
            disabled={ props.disabled }
            activeScale={ 0.97 }
            hitSlop={ { top: slop, left: slop, bottom: slop, right: slop } }>
            {props.children}
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    container: {},
    text: {
        flex: 1,
        textAlign: 'center',
        margin: '.5%',
    },
});

import * as React from 'react';
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from 'react-native';
// @ts-ignore
import TouchableScale, { TouchableScaleProps } from 'react-native-touchable-scale';
import { PDText } from '~/components/PDText';

interface ButtonProps extends TouchableScaleProps{
    title: string;
    containerStyles?: StyleProp<ViewStyle>;
    textStyles?: StyleProp<TextStyle>;
}

export const BoringButton :React.FC<ButtonProps> = (props) =>{
    const { title, containerStyles, textStyles, ...rest } = props;
    return (
        <TouchableScale
        style={ [styles.container, containerStyles] }
        { ...rest }
        activeScale={ 0.96 }>
        <PDText type="default" style={ [styles.text, textStyles] }>
            {title}
        </PDText>
    </TouchableScale>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 55,
        borderRadius: 27.5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 1,
        justifyContent: 'center',
    },
    text: {
        color: 'white',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
    },
});

import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';
import { PDText } from '~/components/PDText';
import { PDView } from '../PDView';

interface ChoosyButtonProps {
    title: string;
    onPress: () => void;
    styles?: ViewStyle | ViewStyle[];
    textStyles?: any;
    disabled?: boolean;
}

export const ChoosyButton: React.FunctionComponent<ChoosyButtonProps> = (props: ChoosyButtonProps) => {
    const handleButtonPress = () => {
        props.onPress();
    };

    return (
        <TouchableScale
            activeScale={ 0.96 }
            onPress={ handleButtonPress }
            disabled={ props.disabled }>
            <PDView bgColor="white" borderColor="border" style={ [styles.container, props.styles]  }>
                <PDText type="subHeading" color="blue" style={ [styles.text, props.textStyles] }>
                    {props.title}
                </PDText>
            </PDView>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 6,
        borderWidth: 2,
        paddingTop: 4,
        paddingHorizontal: 7,
    },
    text: {
        margin: 4,
    },
});

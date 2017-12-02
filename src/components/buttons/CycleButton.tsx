import * as React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';
import { PDText } from '~/components/PDText';
import { Haptic } from '~/services/HapticService';
import { PDSpacing, useTheme } from '../PDTheme';

interface CycleButtonProps {
    title: string;
    onPress: () => void;
    styles?: ViewStyle | ViewStyle[];
    textStyles?: any;
    disabled?: boolean;
}

export const CycleButton: React.FunctionComponent<CycleButtonProps> = (props: CycleButtonProps) => {
    const theme = useTheme();

    const handleButtonPress = () => {
        Haptic.selection();
        props.onPress();
    };

    return (
        <TouchableScale
            style={ [styles.container,{ borderColor: theme.colors.greyLight }, props.styles] }
            activeScale={ 1.05 }
            onPress={ handleButtonPress }
            disabled={ props.disabled }>
            <PDText type="subHeading" color="blue" textAlign="center" style={ [styles.text, props.textStyles] }>
                {props.title}
            </PDText>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        borderWidth: 2,
        paddingHorizontal: PDSpacing.xs,
        paddingVertical: 4,
    },
    text: {
        margin: 4,
    },
});

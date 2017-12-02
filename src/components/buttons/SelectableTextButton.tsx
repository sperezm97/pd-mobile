import * as React from 'react';
import { StyleSheet, TouchableWithoutFeedback } from 'react-native';

import { PDText } from '../PDText';
import { PDView } from '../PDView';

interface SelectableTextButtonProps {
    buttonText: string;
    onPress: (selectedText: string) => void;
    isSelected: boolean;
}

/** */
export const SelectableTextButton: React.FC<SelectableTextButtonProps> = (props) => {

    const handleOnPress = () => {
        props.onPress(props.buttonText);
    };

    const textColor = props.isSelected ? 'blue' : 'black';

    const borderColor = props.isSelected ? 'blue' : 'grey';
    return (
        <TouchableWithoutFeedback onPress={ handleOnPress }>
            <PDView style={ styles.baseContainer } borderColor={ borderColor }>
                <PDText style={ styles.text } color={ textColor }>{props.buttonText}</PDText>
            </PDView>
        </TouchableWithoutFeedback>
    );
};

const styles = StyleSheet.create({
    baseContainer: {
        paddingHorizontal: 5,
        paddingVertical: 3,
        borderRadius: 8,
        borderWidth: 1,
    },
    text: {
        fontWeight: '700',
        fontSize: 18,
    },
});

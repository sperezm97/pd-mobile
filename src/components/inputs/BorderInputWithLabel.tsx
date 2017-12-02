import React from 'react';
import { StyleSheet, TextInput, TextInputProps, TextStyle, ViewStyle } from 'react-native';

import { PDText } from '../PDText';
import { PDColor, useTheme } from '../PDTheme';
import { PDView } from '../PDView';

interface BorderInputWithLabel extends TextInputProps {
    label: string;
    labelStyleProps?: TextStyle | TextStyle[];
    textInputStyleProps?: TextStyle | TextStyle[];
    containerStyles?: ViewStyle;
    color?: PDColor
}

const BorderInputWithLabel = React.forwardRef<TextInput, BorderInputWithLabel>((props, ref) => {
    const { label, labelStyleProps, style, textInputStyleProps, color = 'black', ...restTextInputProps } = props;
    const theme = useTheme();

    const defaultStyle = [ styles.textInput, { borderColor: theme.colors.border, color: theme.colors[color] },  textInputStyleProps, style ];

    return (
        <PDView style={ props.containerStyles }>
            <PDText type="bodyGreyBold" color="grey" style={ labelStyleProps }>
                {label}
            </PDText>
            <TextInput
                ref={ ref }
                style={ defaultStyle }
                placeholderTextColor={ theme.colors.grey }
                blurOnSubmit
                allowFontScaling
                maxFontSizeMultiplier={ 1.4 }
                { ...restTextInputProps }
            />
        </PDView>
    );
});

BorderInputWithLabel.defaultProps = {
    color: 'black',
};

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 2,
        borderRadius: 6,
        paddingVertical: 8,
        fontSize: 16,
        fontStyle: 'normal',
        fontWeight: '600',
        paddingLeft: 8,
        minWidth: 100,
    },
});

export default BorderInputWithLabel;

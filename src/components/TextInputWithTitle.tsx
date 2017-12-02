import * as React from 'react';
import {
    StyleProp, StyleSheet, TextInput, TextInputProps, TextStyle, ViewStyle,
} from 'react-native';

import { PDText } from './PDText';
import { PDView } from './PDView';

export interface Focusable {
    focus: () => void;
}

export interface TextInputWithTitleProps extends Omit<TextInputProps, 'hitSlop'> {
    titleText: string;
    subtitleText?: string;
    onTextChanged: (text: string) => void;
    placeholderText?: string;
    containerStyles?: StyleProp<ViewStyle>;
    titleTextStyles?: StyleProp<TextStyle>;
    subtitleTextStyles?: StyleProp<TextStyle>;
    inputStyles?: StyleProp<ViewStyle & TextStyle>;
    accessoryViewId?: string;
    hitSlop?: number;
}

/** */
const TextInputWithTitleComponent = (props: TextInputWithTitleProps, ref: React.Ref<Focusable>) => {
    const {
        containerStyles,
        titleText,
        subtitleText,
        onTextChanged,
        titleTextStyles,
        subtitleTextStyles,
        inputStyles,
        accessoryViewId,
        placeholderText,
        hitSlop,
        ...propsInput
    } = props;
    const inputRef = React.useRef<TextInput>(null);

    React.useImperativeHandle(ref, (): any => ({
        focus: (): void => {
            inputRef?.current?.focus();
        },
    }));

    return (
        <PDView style={ containerStyles }>
            <PDView style={ styles.titleContainer }>
                <PDText style={ [styles.titleText, titleTextStyles] }>{titleText}</PDText>
                <PDText style={ [styles.subtitleText, subtitleTextStyles] }>{subtitleText}</PDText>
            </PDView>
            <TextInput
                { ...propsInput }
                placeholder={ placeholderText }
                onChangeText={ onTextChanged }
                style={ [styles.input, inputStyles] }
                ref={ inputRef }
                inputAccessoryViewID={ accessoryViewId }
                hitSlop={ { top: hitSlop, left: hitSlop, bottom: hitSlop, right: hitSlop } }
                allowFontScaling
                maxFontSizeMultiplier={ 1.4 }
            />
        </PDView>
    );
};

export const TextInputWithTitle = React.forwardRef<Focusable, TextInputWithTitleProps>(TextInputWithTitleComponent);

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
    },
    titleText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        paddingBottom: 5,
        marginRight: 5,
    },
    subtitleText: {
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        paddingBottom: 5,
    },
    input: {
        borderBottomWidth: 2,
        borderColor: '#4a4a4a',
        marginBottom: 15,
        fontFamily: 'Poppins-Regular',
        fontSize: 22,
        paddingHorizontal: 5,
        color: '#00c89f',
        fontWeight: '500',
    },
});

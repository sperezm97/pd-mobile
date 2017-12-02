import * as React from 'react';
import { StyleSheet, Text, TextProps, TextStyle } from 'react-native';
import { PDColor, PDTextType, useTheme } from '~/components/PDTheme';

interface PDTextProps extends TextProps {
    type?: PDTextType;
    textAlign?: 'left' | 'center' | 'right' | 'auto' | 'justify'
    color?: PDColor;
    textTransform?: TextStyle['textTransform']
}

/// PDTheme-compliant wrapper for the Text component. Stick to the theme & avoid using the style prop too often.
const BaseText: React.FC<PDTextProps> = (props) => {
    // The "style" below is possible because PDTextProps extends TextProps.
    // Similarly, "...restProps" is a catch-all so that any other Text props will be passed along...
    const {
        children,
        style,
        textAlign = 'auto',
        color,
        ...restProps
    } = props;
    const theme = useTheme();

    /// Default styles are derived from the "style" of text (from our design system, expressed via the prop)
    const defaultStyles = props.type && styles[props.type];
    /// The default color is applied based on the active PDTheme object
    const textColor = theme.colors[color ?? 'black'];
    const colorStylesFromTheme = { color: textColor };
    /// Any custom TextStyle properties are also applied at the end, via the "style" prop:
    const textStyles = StyleSheet.flatten([defaultStyles, colorStylesFromTheme, { textAlign }, style]);

    return (
        <Text style={ textStyles } allowFontScaling={ true } maxFontSizeMultiplier={ 1.4 } { ...restProps }>
            {children}
        </Text>
    );
};

BaseText.defaultProps = {
    type: 'default',
    color: 'black',
};

export const PDText = BaseText;

const styles = StyleSheet.create({
    default: {
        fontFamily: 'Poppins-Regular',
        fontWeight: '600',
    },
    tooltip: {
        fontFamily: 'Poppins-Medium',
        fontStyle: 'normal',
        lineHeight: 21,
        fontSize: 14,
    },
    button: {
        fontFamily: 'Poppins-Bold',
        fontStyle: 'normal',
        lineHeight: 21,
        fontSize: 14,
    },
    bodyRegular: {
        fontFamily: 'Poppins-Regular',
        fontStyle: 'normal',
        lineHeight: 24,
        fontSize: 16,
    },
    bodyBold: {
        fontFamily: 'Poppins-Bold',
        fontStyle: 'normal',
        lineHeight: 24,
        fontSize: 16,
    },
    bodySemiBold: {
        fontFamily: 'Poppins-SemiBold',
        fontStyle: 'normal',
        lineHeight: 24,
        fontSize: 16,
    },
    bodyMedium: {
        fontFamily: 'Poppins-Medium',
        fontStyle: 'normal',
        lineHeight: 24,
        fontSize: 16,
    },
    bodyGreyBold: {
        fontFamily: 'Poppins-Bold',
        fontStyle: 'normal',
        lineHeight: 21,
        fontSize: 15,
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    subHeading: {
        fontFamily: 'Poppins-Bold',
        fontStyle: 'normal',
        lineHeight: 27,
        fontSize: 18,
    },
    heading: {
        fontFamily: 'Poppins-Bold',
        lineHeight: 36,
        fontSize: 24,
    },
    buttonSmall: {
        fontFamily: 'Poppins-Bold',
        fontSize: 14,
    },
    content: {
        fontFamily: 'Poppins-Medium',
        fontStyle: 'normal',
        lineHeight: 24,
        fontSize: 16,
    },
});

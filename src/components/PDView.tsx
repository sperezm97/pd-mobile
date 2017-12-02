import * as React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';

import { PDColor, useTheme } from './PDTheme';

interface PDViewProps extends ViewProps {
    bgColor?: PDColor;
    borderColor?: PDColor;
    opacity?: number;
}

/// Wrapper around View component that allows some custom theming
export const PDView: React.FC<PDViewProps> = (props) => {
    const {
        children,
        style,
        bgColor,
        borderColor,
        ...restProps
    } = props;

    const theme = useTheme();

    const background = theme.colors[bgColor ?? 'transparent'];
    const border = theme.colors[borderColor ?? 'transparent'];

    const colorStylesFromTheme = { backgroundColor: background, borderColor: border };

    const viewStyles = StyleSheet.flatten([colorStylesFromTheme, style]);

    return (
        <View style={ viewStyles } { ...restProps }>
            {children}
        </View>
    );
};

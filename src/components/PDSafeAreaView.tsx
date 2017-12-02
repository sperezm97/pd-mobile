import * as React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import SafeAreaView, { ForceInsetProp } from 'react-native-safe-area-view';

import { PDColor, useTheme } from './PDTheme';

interface PDSafeAreaViewProps extends ViewProps {
    bgColor?: PDColor;
    forceInset?: ForceInsetProp;
}

/// Wrapper around SafeAreaView component that allows some custom theming
export const PDSafeAreaView: React.FC<PDSafeAreaViewProps> = (props) => {
    const { children, style, ...restProps } = props;
    const theme = useTheme();

    const backgroundColor = theme.colors[props.bgColor ?? 'transparent'];
    const colorStylesFromTheme = { backgroundColor };

    const SafeAreaViewStyles = StyleSheet.flatten([{ flex: 1 }, colorStylesFromTheme, style]);

    return (
        <SafeAreaView style={ SafeAreaViewStyles } { ...restProps }>
            {children}
        </SafeAreaView>
    );
};

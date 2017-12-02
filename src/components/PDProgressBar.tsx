import * as React from 'react';
import { StyleSheet, View, StyleProp, ViewStyle } from 'react-native';

interface PDProgressBarProps {
    /// From 0 to 1
    progress: number;
    foregroundColor: string;
    style: StyleProp<ViewStyle>;
}

export const PDProgressBar: React.FunctionComponent<PDProgressBarProps> = (props) => {
    const foregroundFlex = props.progress;
    const backgroundFlex = 1 - foregroundFlex;

    const containerStyle = StyleSheet.flatten([styles.container, props.style]);

    const backgroundStyle = {
        backgroundColor: 'transparent',
        flex: backgroundFlex,
    };
    return (
        <View style={ containerStyle }>
            <View style={ { flex: foregroundFlex, backgroundColor: props.foregroundColor /*borderRadius: 8*/ } } />
            <View style={ backgroundStyle } />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // borderRadius: 8,
        overflow: 'hidden',
    },
});

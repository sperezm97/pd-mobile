import * as React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

export interface SeparatorLineProps {
    lineStyles?: StyleProp<ViewStyle>;
}

/** */
export const SeparatorLine: React.FunctionComponent<SeparatorLineProps> = (props: SeparatorLineProps) => {
    return <View style={ [styles.line, props.lineStyles] } />;
};

const styles = StyleSheet.create({
    line: {
        paddingVertical: 2,
        backgroundColor: '#9b9b9b',
        borderRadius: 8,
        flex: 1,
    },
});

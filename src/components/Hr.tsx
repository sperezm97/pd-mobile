import React from 'react';
import { StyleSheet } from 'react-native';

import { PDSpacing, useTheme } from './PDTheme';
import { PDView } from './PDView';

export const HR = () =>{
    const theme = useTheme();
    const style = [ styles.hr, { borderColor: theme.colors.border }];

    return <PDView style={ style } />;
};


const styles = StyleSheet.create({
    hr: {
        borderWidth: 1,
        marginVertical: PDSpacing.lg,
    },
});

import React from 'react';
import { StyleSheet, TextInputProps } from 'react-native';
import { SVG } from '~/assets/images';

import { PDSpacing, useTheme } from '../PDTheme';
import { PDView } from '../PDView';
import { PDTextInput } from './PDTextInput';

export const SearchInput: React.FC<TextInputProps> = (props) => {
    const theme = useTheme();
    return (
        <PDView bgColor="greyLight" style={ styles.container }>
            <PDView>
                <SVG.IconSearch />
            </PDView>
            <PDTextInput
                { ...props }
                style={ [ styles.textInput, { color: theme.colors.black } ] }
                placeholder="Search"
                placeholderTextColor={ theme.colors.greyDark }
                keyboardType="default"
                hitSlop={ { top: 5, bottom: 5, left: 20, right: 5 } }
            />
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        padding: PDSpacing.xs,
    },
    textInput: {
        marginHorizontal: PDSpacing.xs,
        flex: 1,
        fontFamily: 'Poppins',
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600',
        color: '#000',
    },
});

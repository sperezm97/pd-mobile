import React from 'react';
import { StyleSheet } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { SVG } from '~/assets/images';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { PDStackNavigationProps } from '~/navigator/shared';

import { useNavigation } from '@react-navigation/core';

const ModalHeader: React.FC = (props) => {
    const { children } = props;
    const navigation = useNavigation<PDStackNavigationProps>();
    const theme = useTheme();

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <PDView style={ styles.container } bgColor="white">
            <PDView style={ styles.sideContainer }>
                <TouchableScale onPress={ goBack }>
                    <SVG.IconCloseButton fill={ theme.colors.black } />
                </TouchableScale>
            </PDView>
            <PDView style={ styles.centerContainer }>
                <PDText type="subHeading" style={ styles.text }>{children}</PDText>
            </PDView>
            <PDView style={ styles.sideContainer }/>
        </PDView>
    );
};

export default ModalHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: PDSpacing.lg,
        maxHeight: 80,
    },
    sideContainer: {
        flexShrink: 1,
        minWidth: 32,
    },
    centerContainer: {
        flexGrow: 2,
    },
    text: {
        textAlign: 'center',
    },
});

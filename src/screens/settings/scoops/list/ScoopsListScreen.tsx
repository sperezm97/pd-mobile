import React from 'react';
import { FlatList } from 'react-native';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { Scoop } from '~/models/Scoop';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';

import { useNavigation } from '@react-navigation/native';

import { ScoopListItem } from './ScoopListItem';
import { useStandardStatusBar } from '~/hooks/useStatusBar';

export const ScoopsListScreen = () => {
    const { ds } = useDeviceSettings();
    const theme = useTheme();
    const navigation = useNavigation<PDStackNavigationProps>();
    useStandardStatusBar();

    const handleAddButtonPressed = () => {
        navigation.navigate('ScoopDetails', { prevScoop: null });
    };

    const handleScoopItemPressed = ( scoop: Scoop)=> {
        navigation.navigate('ScoopDetails', { prevScoop: scoop });
    };

    return (
        <PDSafeAreaView bgColor="white" forceInset={ { bottom: 'never' } }>
            <ScreenHeader
                hasAddButton
                hasBottomLine
                handlePressedAdd={ handleAddButtonPressed }
                textType="heading"
                color="pink">
                Scoops
            </ScreenHeader>
            <FlatList
                data={ ds.scoops }
                keyExtractor={ (item) => item.guid }
                style={ [{ backgroundColor: theme.colors.blurredPink }] }
                contentContainerStyle={ { paddingTop: PDSpacing.md } }
                renderItem={ ({ item }) => (
                    <ScoopListItem key={ item.guid } scoop={ item } handlePressedScoop={ handleScoopItemPressed }/>
                ) }
            />
        </PDSafeAreaView>
    );
};

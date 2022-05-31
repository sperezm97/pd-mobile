import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSectionList } from '~/components/list/PDSectionList';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { useStandardStatusBar } from '~/hooks/useStatusBar';

import { useSettings } from './useSettings';

export const SettingsScreen = () => {
    const settingsSections = useSettings();
    useStandardStatusBar();
    const insets = useSafeAreaInsets();

    return (
        <PDSafeAreaView bgColor="white" forceInset={ { bottom: 'never' } }>
            <ScreenHeader color="blue" textType="heading">
                Settings
            </ScreenHeader>
            <PDSectionList sections={ settingsSections } showFooter insets={ { bottom: insets.bottom } } />
        </PDSafeAreaView>
    );
};

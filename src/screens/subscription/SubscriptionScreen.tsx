import React from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { DS } from '~/services/DSUtil';

import { usePurchaseState } from '../../services/subscription/SubHooks';
import { SubscriptionOptions } from './components/prompt/SubscriptionOptions';
import { SubscriptionSuccess } from './components/success/SubscriptionSucces';

export const SubscriptionScreen: React.FC = () => {
    const theme = useTheme();

    const purchaseState = usePurchaseState();

    const d = purchaseState.details;
    const isActive = d && DS.isSubscriptionValid({ sub_exp: d.exp.getTime(), sub_will_renew: d.will_renew }, Date.now());
    const content = (isActive && d)     // the (&& d) portion is only necessary to make the type-checker happy.
        ? <SubscriptionSuccess { ...d } />
        :  <SubscriptionOptions />;

    return (
        <PDSafeAreaView bgColor="white" forceInset={ { bottom: 'never' } }>
            <ScreenHeader color="blue" textType="heading">
                Pooldash+
            </ScreenHeader>
            <ScrollView style={ [styles.content, { backgroundColor: theme.colors.greyLighter } ] }>
                { content }
            </ScrollView>
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: PDSpacing.md,
        paddingTop: PDSpacing.lg,
    },
});

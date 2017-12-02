import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { PDButton } from '~/components/buttons/PDButton';
import { HR } from '~/components/Hr';
import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { ProductId } from '~/models/InAppPurchase';
import { IAP } from '~/services/subscription/IAP';

import { SubscriptionFeatures } from '../shared/SubscriptionFeatures';
import { SU } from '~/services/subscription/Util';

interface SubscriptionSuccessScreenProps {
    sku: ProductId;
    will_renew: boolean;
    exp: Date;
}

export const SubscriptionSuccess: React.FC<SubscriptionSuccessScreenProps> = ({ sku, exp, will_renew }) => {

    const handleManageSubPressed = async () => {
        const url = await IAP.getManagementURL();

        if (url) {
            Linking.openURL(url);
        } else {
            Linking.openSettings();
        }
    };

    const displayName = SU.getDisplayNameByCurrentSubscription(sku);
    const displayPrice = SU.getDisplayPriceByCurrentSubscription(sku);
    const displayRenewsDays = SU.getRenewalTimeString(exp, will_renew);
    return (
        <>
            <PDView>
                <PDText type="subHeading">Thanks for Subscribing!</PDText>
            </PDView>
            <HR />

            <PDView style={ styles.subscriptionContainer }>
                <PDText type="bodySemiBold" color="grey">
                    YOUR PLAN
                </PDText>
                <PDView style={ styles.optionContainer }>
                    <PDView style={ styles.containerItem }>
                        <PDText type="bodyRegular" color="black" style={ styles.alignTextLeft }>
                            {displayName} Subscription
                        </PDText>
                        <PDText>
                            {displayPrice} - {displayRenewsDays}
                        </PDText>
                    </PDView>
                </PDView>
            </PDView>

            <SubscriptionFeatures showTitle={ true } />
            <PDView style={ styles.buttonContainer }>
                <PDButton onPress={ handleManageSubPressed } bgColor="blue">
                    Manage Subscription
                </PDButton>
            </PDView>
        </>
    );
};

const styles = StyleSheet.create({
    subscriptionContainer: {
        marginBottom: PDSpacing.sm,
    },
    buttonContainer: {
        marginTop: PDSpacing.lg,
    },
    optionContainer: {
        marginTop: PDSpacing.sm,
    },
    content: {
        paddingHorizontal: PDSpacing.md,
        paddingTop: PDSpacing.lg,
    },
    containerItem: {
        borderWidth: 2,
        borderColor: '#00B25C',
        backgroundColor: '#00B25C05',
        borderRadius: 18,
        marginBottom: PDSpacing.xs,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: PDSpacing.sm,
        paddingHorizontal: PDSpacing.md,
    },
    alignTextLeft: {
        textAlign: 'left',
    },
});

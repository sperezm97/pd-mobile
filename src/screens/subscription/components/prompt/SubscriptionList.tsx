import { useNavigation } from '@react-navigation/core';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { PDButton } from '~/components/buttons/PDButton';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { ProductId } from '~/models/InAppPurchase';
import { PDStackNavigationProps } from '~/navigator/shared';
import { Haptic } from '~/services/HapticService';
import { IAP } from '~/services/subscription/IAP';
import { useAvailablePackages } from '~/services/subscription/SubHooks';
import { SU } from '~/services/subscription/Util';

import { SubscriptionListItem } from './SubscriptionListItem';

export const SubscriptionList = () => {
    const packages = useAvailablePackages();
    const [selectedSku, setSelectedSku] = useState<ProductId | null>(null);
    const theme = useTheme();
    const [isLoading, setIsLoading] = useState(false);
    const { navigate } = useNavigation<PDStackNavigationProps>();

    // Only set initial selection after that package has been loaded:
    useEffect(() => {
        if ((!selectedSku) && packages.length > 0) {
            const doesAnnualPackageExist = packages
                .filter(p => p.product.identifier === 'unlock_20')
                .length > 0;
            if (doesAnnualPackageExist) {
                setSelectedSku('unlock_20');
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [packages.length]);

    const updateSubscription = (identifier: ProductId) => {
        setSelectedSku(identifier);
    };

    const handlePurchase = async () => {
        Haptic.medium();
        setIsLoading(true);
        const product = packages.find((item) => item.product.identifier === selectedSku)!;
        await IAP.purchasePackage(product);
        setIsLoading(false);
    };

    const handleRestore = async () => {
        Haptic.light();
        setIsLoading(true);
        await IAP.restoreLastPurchase();
        setIsLoading(false);
    };

    const handlePressedTerms = () => {
        navigate('TermsOfService');
    };

    const handlePressedPrivacy = () => {
        navigate('PrivacyPolicy');
    };

    return (
        <PDView style={ { opacity: isLoading ? 0.6 : 1 } } pointerEvents={ isLoading ? 'none' : 'auto' }>
            <PDText type="subHeading" color="black">
                Subscription Options
            </PDText>
            <PDView style={ styles.content }>
                {packages.map((p) => (
                    <SubscriptionListItem
                        key={ p.product.identifier }
                        product={ p.product }
                        selected={ selectedSku === p.product.identifier }
                        updateSelection={ updateSubscription }
                    />
                ))}
            </PDView>
            <PDView>
                <PDButton
                    onPress={ handlePurchase }
                    bgColor={ !selectedSku ? 'greyLight' : 'blue' }
                    textStyle={ { color: 'white' } }

                    touchableProps={ {
                        disabled: !selectedSku,
                    } }>
                    Subscribe {SU.getDisplayNameByCurrentSubscription(selectedSku)}
                </PDButton>
                <PDButton
                    onPress={ handleRestore }
                    touchableProps={ {
                        disabled: !selectedSku,
                    } }
                    bgColor="transparent"
                    textType="tooltip"
                    textStyle={ { color: theme.colors.grey, fontWeight: 'bold' } }>
                    Restore Purchases
                </PDButton>
            </PDView>
            <PDView style={ styles.termsContainer }>
                <PDText type="default" color="black" style={ styles.termsText }>
                    By subscribing, you agree to our
                    {' '}
                </PDText>
                <TouchableHighlight
                    onPress={ handlePressedTerms }>
                    <PDText type="default" style={ styles.termsLink }>
                        Terms of Service
                    </PDText>
                </TouchableHighlight>
                <PDText type="default" style={ styles.termsText }>
                    {' '}
                    and
                    {'  '}
                </PDText>
                <TouchableHighlight
                    onPress={ handlePressedPrivacy }>
                    <PDText type="default" style={ styles.termsLink }>
                        Privacy Policy
                    </PDText>
                </TouchableHighlight>
            </PDView>
        </PDView>
    );
};

const styles = StyleSheet.create({
    content: {
        marginVertical: PDSpacing.sm,
    },
    termsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    termsText: {
        textAlign: 'center',
        fontSize: 14,
    },
    termsLink: {
        textAlign: 'center',
        backgroundColor: 'transparent',
        color: '#3910E8',
        fontSize: 14,
        textDecorationLine: 'underline',
    },
});

import React from 'react';
import { StyleSheet } from 'react-native';
import { SVG } from '~/assets/images';
import { Conditional } from '~/components/Conditional';
import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';

interface Feature {
    id: number;
    icon: string;
    label: string;
}

const features: Feature[] = [
    {
        id: 0,
        icon: 'IconCharts',
        label: 'Charts and Trends',
    },
    {
        id: 1,
        icon: 'IconInfinitive',
        label: 'Unlimited Pools',
    },
    {
        id: 2,
        icon: 'IconHeart',
        label: 'Support a Small Team',
    },
];

interface SubscriptionFeaturesProps {
    showTitle: boolean;
}

export const SubscriptionFeatures: React.FC<SubscriptionFeaturesProps> = ({ showTitle }) => {
    return (
        <PDView>
            <Conditional condition={ showTitle }>
                <PDText type="bodySemiBold" color="greyDark" allowFontScaling={ false }>
                    BENEFITS
                </PDText>
            </Conditional>
            {features.map((feature: Feature) => {
                const Icon = SVG[feature.icon];
                return (
                    <PDView key={ feature.id } style={ styles.featureItemContainer }>
                        <Icon height={ 24 } width={ 24 } />
                        <PDView style={ styles.featureItemLabelContainer }>
                            <PDText type="bodyMedium" color="black" allowFontScaling={ false }>
                                {feature.label}
                            </PDText>
                        </PDView>
                    </PDView>
                );
            })}
        </PDView>
    );
};

const styles = StyleSheet.create({
    featureItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: PDSpacing.xs,
    },
    featureItemLabelContainer: {
        marginLeft: PDSpacing.sm,
    },
});

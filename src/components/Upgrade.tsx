import React from 'react';
import { Image, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { images } from '~/assets/images';
import { BoringButton } from './buttons/BoringButton';
import { SubscriptionFeatures } from '~/screens/subscription/components/shared/SubscriptionFeatures';
import { PDView } from './PDView';
import { useTheme } from './PDTheme';

interface UpgradeProps {
    onPress: () => void;
    style: StyleProp<ViewStyle>;
}

export const Upgrade: React.FunctionComponent<UpgradeProps> = (props) => {
    const theme = useTheme();

    return (
        <PDView bgColor="white" borderColor="blue" style={ [styles.plusContainer, props.style] }>
            <PDView style={ { flexDirection: 'row', display: 'flex' } }>
                <PDView style={ { flex: 1 } } />
                <Image
                    style={ styles.pdProImageStyles }
                    source={ theme.isDarkMode ? images.logoWhitePlus : images.logoGreenPlus }
                    width={ 3000 }
                    resizeMode={ 'contain' }
                />
                <PDView style={ { flex: 1 } } />
            </PDView>
            <SubscriptionFeatures showTitle={ false } />
            <BoringButton
                title={ 'Upgrade' }
                onPress={ props.onPress }
                containerStyles={ [styles.dataButton, { backgroundColor: theme.colors.greyLighter }] }
                textStyles={ { color: theme.colors.blue } }
            />
        </PDView>
    );
};

const styles = StyleSheet.create({
    plusContainer: {
        shadowOffset: { width: 0, height: 2 },
        shadowColor: 'grey',
        shadowOpacity: 0.3,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flex: 1,
        borderRadius: 24,
        borderWidth: 2,
        alignItems: 'center',
    },
    pdProImageStyles: {
        marginHorizontal: 10,
        flex: 4,
    },
    textContainer: {
        alignItems: 'flex-start',
        alignSelf: 'flex-start',
        marginLeft: 12,
        paddingTop: 6,
        flex: 1,
    },
    onlineBackupText: {
        // TODO: move color into the theme
        opacity: 0.6,
        marginBottom: 4,
    },
    dataButton: {
        alignSelf: 'stretch',
        marginHorizontal: 12,
        marginVertical: 24,
        borderRadius: 12,
        shadowColor: 'transparent',
    },
});

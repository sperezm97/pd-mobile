import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { AV } from '~/components/animation/AnimationHelpers';
import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Util } from '~/services/Util';


interface PoolListFooterNonEmptyProps {
    pressedUpgrade: () => void;
    numPools: number;
}

/// TODO: rename component, it's not for upgrading anymore.
export const PoolListFooterUpgrade: React.FunctionComponent<PoolListFooterNonEmptyProps> = (props) => {
    const [isChangeButtonPressed, setIsChangeButtonPressed] = React.useState(false);
    const a = useAnimation(props.numPools);

    const toggleChangeButtonPressed = () => {
        setIsChangeButtonPressed(!isChangeButtonPressed);
    };

    return (
        <AV opacity={ a.opacity }>
            <PDView bgColor="transparent" style={ styles.container } >
                <PDView style={ styles.topRow }>

                    <PDText type="default" color="greyDark" style={ styles.changeRecipeIntro }>
                        Free and {' '}
                    </PDText>
                    <TouchableOpacity
                        onPressIn={ toggleChangeButtonPressed }
                        onPressOut={ toggleChangeButtonPressed }
                        onPress={ props.pressedUpgrade }>
                        <PDText type="default" color="blue" style={ Util.excludeFalsy([styles.recipeLinkNormal, isChangeButtonPressed && styles.recipeLinkPressed]) }>
                            open source
                        </PDText>
                    </TouchableOpacity>
                </PDView>
            </PDView>
        </AV>
    );
};


const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: PDSpacing.md,
        marginBottom: 40,
    },
    topRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignSelf: 'center',
    },
    changeRecipeIntro: {
        fontSize: 18,
    },
    recipeLinkPressed: {
        textDecorationLine: 'none',
    },
    recipeLinkNormal: {
        backgroundColor: 'transparent',
        fontSize: 18,
        textDecorationLine: 'underline',
    },
    image: {
        marginTop: 10,
        maxWidth: 250,
        alignSelf: 'center',
    },
});

const useAnimation = (numPools: number) => {
    const opacity = useRef(new Animated.Value(0)).current;

    const additionalDelayForStaggeredPools = numPools * 150;

    useEffect(() => {
        Animated.sequence([
            Animated.delay(350 + additionalDelayForStaggeredPools),
            Animated.timing(opacity, {
                toValue: 1,
                duration: 600,
                useNativeDriver: true,
                isInteraction: false,
            }),
          ]).start();
    }, [additionalDelayForStaggeredPools, opacity]);

    return {
        opacity,
    };
};

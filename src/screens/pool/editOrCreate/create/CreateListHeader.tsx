import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { AV } from '~/components/animation/AnimationHelpers';
import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { Util } from '~/services/Util';

export const CreateListHeader: React.FC = () => {
    const a = useCreateHeaderAnimation();

    return (
        <AV opacity={ a.opacity }>
            <PDText color="greyDark" type="bodyMedium" style={ styles.headerText }>
                Just fill out the top section.
            </PDText>
            <PDText color="greyDark" type="bodyMedium" style={ styles.headerText2 }>
                When you're done, press "Save Pool".
            </PDText>

        </AV>
    );
};

const styles = StyleSheet.create({
    headerText: {
        textAlign: 'center',
        marginTop: PDSpacing.md,
    },
    headerText2: {
        textAlign: 'center',
    },
});

const useCreateHeaderAnimation = () => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const asyncStuff = async () => {
            // Animated.delay will sometimes prevent the underlying listview from rendering the bottom rows,
            // which is bullshit.
            await Util.delay(1.5);
            Animated.timing(opacity, {
                toValue: 1,
                useNativeDriver: true,
                duration: 700,
                isInteraction: false,
            }).start();
        };
        asyncStuff();
    }, [opacity]);

    return { opacity };
};

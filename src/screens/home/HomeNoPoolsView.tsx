import React, { useLayoutEffect,useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet } from 'react-native';
import { images, SVG } from '~/assets/images';
import { AV } from '~/components/animation/AnimationHelpers';
import { ButtonWithChildren } from '~/components/buttons/ButtonWithChildren';
import { Conditional } from '~/components/Conditional';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { useImportablePools } from '../special/PoolDoctorImportHooks';

interface HomeNoPoolsViewProps {
    handleAddPoolPressed: () => void;
    handleImportPressed: () => void;
}

export const HomeNoPoolsView: React.FC<HomeNoPoolsViewProps> = (props) => {
    const theme = useTheme();
    const a = useHomeScreenAnimation();
    const totalImportablePools = useImportablePools();

    const screenWidth = Dimensions.get('window').width;
    const imageHeightRatio = 0.4695;
    const imageWidth = screenWidth + 20;
    const imageHeight = imageWidth * imageHeightRatio;

    return (
        <PDView style={ styles.container } bgColor={ 'background' }>
            <AV xy={ a.logoXY } opacity={ a.opacity }>
                <Image source={ theme.isDarkMode ? images.homeWelcomeTextWhite : images.homeWelcomeTextDark } style={ styles.topText }/>
            </AV>
            <AV xy={ a.descriptionXY } opacity={ a.opacity }>
                <SVG.HomeDescriptionText style={ styles.bottomText }/>
            </AV>
            <AV x={ a.startButtonX }>
                <ButtonWithChildren onPress={ props.handleAddPoolPressed } styles={ styles.buttonContainer } hitSlop={ 5 }>
                    <Conditional condition={ totalImportablePools === 0 }>
                        <SVG.IconPlayWhite height={ 21 } width={ 15 } style={ styles.buttonIcon } />
                    </Conditional>
                    <PDText type="subHeading" style={ { color: 'white' } }>Add Pool</PDText>
                </ButtonWithChildren>
            </AV>
            <Conditional condition={ totalImportablePools > 0 } >
                <AV x={ a.importButtonX }>
                    <ButtonWithChildren onPress={ props.handleImportPressed } styles={ styles.buttonContainer } hitSlop={ 5 }>
                    <SVG.IconPlayWhite height={ 21 } width={ 15 } style={ styles.buttonIcon } />
                        <PDText type="subHeading" style={ { color: 'white' } }>Import from Pool Doctor</PDText>
                    </ButtonWithChildren>
                </AV>
            </Conditional>
            <AV y={ a.waterY } opacity={ a.opacity } style={ [styles.waveContainer, { height: imageHeight }] } pointerEvents="none">
                <SVG.HomeWaves width={ imageWidth } height={ imageHeight }  />
            </AV>
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    topText: {
        width: 271,
        height: 45,
        marginTop: PDSpacing.xl,
        marginBottom: 0,
        alignSelf: 'center',
        resizeMode: 'contain',
    },
    bottomText: {
        marginTop: PDSpacing.xs,
        alignSelf: 'center',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: PDSpacing.sm,
        marginTop: 70,
        marginHorizontal: PDSpacing.lg,
        backgroundColor: '#1E6BFF',
        justifyContent: 'center',
        paddingTop: 9,
        paddingBottom: 9,
        borderRadius: 27.5,
    },
    importButtonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: PDSpacing.sm,
        marginTop: PDSpacing.sm,
        marginHorizontal: PDSpacing.lg,
        backgroundColor: '#1E6BFF',
        justifyContent: 'center',
        paddingTop: 9,
        paddingBottom: 9,
        borderRadius: 27.5,
    },
    buttonIcon: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: PDSpacing.xs,
    },
    waveContainer: {
        marginLeft: -10,
        padding: 0,
        marginTop: 'auto',
        marginBottom: -10,
        resizeMode: 'cover',
    },
});

const useHomeScreenAnimation = () => {
    const logoXY = useRef(new Animated.ValueXY({ x: -100, y: 0 })).current;
    const descriptionXY = useRef(new Animated.ValueXY({ x: 100, y: 0 })).current;
    const startButtonX = useRef(new Animated.Value(-400)).current;
    const importButtonX = useRef(new Animated.Value(400)).current;
    const waterY = useRef(new Animated.Value(100)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useLayoutEffect(() => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(descriptionXY, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                    duration: 700,
                    isInteraction: false,
                }),
                Animated.timing(logoXY, {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                    duration: 700,
                    isInteraction: false,
                }),
                Animated.timing(waterY, {
                    toValue: 0,
                    useNativeDriver: true,
                    duration: 700,
                    isInteraction: false,
                }),
                Animated.sequence([
                    Animated.delay(100),
                    Animated.timing(opacity, {
                        toValue: 1,
                        useNativeDriver: true,
                        duration: 700,
                        isInteraction: false,
                    }),
                ]),
            ]),
            Animated.delay(250),
            Animated.parallel([
                Animated.spring(startButtonX, {
                    toValue: 0,
                    useNativeDriver: true,
                    isInteraction: false,
                }),
                Animated.spring(importButtonX, {
                    toValue: 0,
                    useNativeDriver: true,
                    isInteraction: false,
                }),
            ]),
          ]).start();
    }, [descriptionXY, logoXY, waterY, opacity, startButtonX, importButtonX]);

    return {
        logoXY,
        descriptionXY,
        startButtonX,
        importButtonX,
        waterY,
        opacity,
    };
};

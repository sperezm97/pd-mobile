import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewProps } from 'react-native';

// Never set (x | y) and xy at the same time:
interface AVProps extends ViewProps {
    x?: Animated.Value;
    y?: Animated.Value;
    xy?: Animated.ValueXY;
    opacity?: Animated.Value;
    scale?: Animated.Value;
}

/// Syntactic Sugar for animated views
export const AV: React.FC<AVProps> = (props) => {
    const { x, y, xy, opacity, style, scale, ...restProps } = props;

    const finalX = x ?? xy?.x;
    const finalY = y ?? xy?.y;

    const transform = [];
    if (finalX) {
        transform.push({ translateX: finalX });
    }
    if (finalY) {
        transform.push({ translateY: finalY });
    }
    if (scale) {
        transform.push({ scaleX: scale });
        transform.push({ scaleY: scale });
    }

    const otherStyles = StyleSheet.flatten(style);
    const finalStyle = {
        ...otherStyles,
        transform: transform,
        opacity,
    };

    return <Animated.View style={ finalStyle } { ...restProps } />;
};

/// Helper for listviews that use the same animation
export const useStandardListAnimation = (indexInList: number, speed: 'slow' | 'fast') => {
    const containerY = useRef(new Animated.Value(200)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    const delayPerRow = (speed === 'fast') ? 75 : 150;
    const initialDelay = indexInList * delayPerRow;

    useEffect(() => {
        Animated.sequence([
            // Create a sort-of bubbling up effect where not every item is in unison
            Animated.delay(initialDelay),
            Animated.parallel([
                Animated.spring(containerY, {
                    toValue: 0,
                    useNativeDriver: true,
                    stiffness: 40,
                    isInteraction: false,
                }),
                Animated.sequence([
                    Animated.delay(150),
                    Animated.timing(opacity, {
                        toValue: 1,
                        useNativeDriver: true,
                        duration: 100,
                        isInteraction: false,
                    }),
                ]),
            ]),
        ]).start();

    }, [initialDelay, containerY, opacity]);

    return {
        containerY,
        opacity,
    };
};

export const useSectionListHeaderAnimation = () => {
    const sectionHeaderOpacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated
            .timing(sectionHeaderOpacity, { toValue: 1, duration: 400, delay: 900, useNativeDriver: true })
            .start();
    }, [sectionHeaderOpacity]);

    return { sectionHeaderOpacity };
};

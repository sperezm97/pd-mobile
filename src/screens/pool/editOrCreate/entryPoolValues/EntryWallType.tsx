import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SVG } from '~/assets/images';
import { ButtonWithChildren } from '~/components/buttons/ButtonWithChildren';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { wallTypeOptions, WallTypeValue } from '~/models/Pool/WallType';
import { PDStackNavigationProps } from '~/navigator/shared';
import { Haptic } from '~/services/HapticService';
import { Util } from '~/services/Util';

import { useNavigation } from '@react-navigation/native';

import { useEntryPool } from '../hooks/useEntryPool';

export const EntryWallType = () => {
    const { pool, setPool } = useEntryPool();
    const [wallType, setWallType] = useState(pool?.wallType ?? '');
    const theme = useTheme();

    const navigation = useNavigation<PDStackNavigationProps>();

    const handleBackNavigation = useCallback(
        () =>
            setTimeout(() => {
                navigation.goBack();
            }, 100),
        [navigation],
    );

    useEffect(() => {
        return () => {
            clearTimeout(handleBackNavigation());
        };
    }, [handleBackNavigation]);

    const handleButtonSelected = (menuItem: WallTypeValue) => {
        setWallType(menuItem);
        setPool({ wallType: menuItem });
        Haptic.medium();

        handleBackNavigation();
    };

    return (
        <PDView style={ styles.container }>
            {wallTypeOptions.map((wall) => (
                <ButtonWithChildren
                    key={ wall.value }
                    styles={ Util.excludeFalsy([
                        { backgroundColor: theme.colors.greyLight },
                        styles.buttonContainer,
                        wallType === wall.value && { backgroundColor: theme.colors.purple },
                    ]) }
                    onPress={ () => handleButtonSelected(wall.value) }>
                    <PDText type="bodySemiBold" color={ wallType === wall.value ? 'white' : 'greyDarker' }>
                        {wall.display}
                    </PDText>
                    {!!(wallType === wall.value) && (
                        <SVG.IconCheckmark width={ 24 } height={ 24 } fill={ theme.colors.white } style={ styles.checkmark } />
                    )}
                </ButtonWithChildren>
            ))}
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 24,
        paddingVertical: PDSpacing.md,
        paddingHorizontal: PDSpacing.lg,
        marginBottom: PDSpacing.xs,
    },

    checkmark: {
        marginRight: PDSpacing.md,
    },
});

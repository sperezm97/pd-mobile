import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { SVG } from '~/assets/images';
import { ButtonWithChildren } from '~/components/buttons/ButtonWithChildren';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { waterTypeOptions, WaterTypeValue } from '~/models/Pool/WaterType';
import { PDStackNavigationProps } from '~/navigator/shared';
import { Haptic } from '~/services/HapticService';
import { Util } from '~/services/Util';

import { useNavigation } from '@react-navigation/native';

import { useEntryPool } from '../hooks/useEntryPool';
import { RecipeService } from '~/services/RecipeService';

export const EntryWaterType = () => {
    const { pool, setPool } = useEntryPool();
    const [waterType, setWaterType] = useState(pool?.waterType ?? 'chlorine');
    const navigation = useNavigation<PDStackNavigationProps>();
    const theme = useTheme();

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

    const handleButtonSelected = (menuItem: WaterTypeValue) => {
        setWaterType(menuItem);
        const recipeKey = RecipeService.getFormulaKeyForWaterType(menuItem);
        setPool({
            waterType: menuItem,
            recipeKey,
        });
        Haptic.medium();
        handleBackNavigation();
    };

    return (
        <PDView style={ styles.container }>
            {waterTypeOptions.map((water) => (
                <ButtonWithChildren
                    key={ water.value }
                    styles={ Util.excludeFalsy([
                        { backgroundColor: theme.colors.greyLight },
                        styles.buttonContainer,
                        waterType === water.value && { backgroundColor: theme.colors.green },
                    ]) }
                    onPress={ () => handleButtonSelected(water.value) }>
                    <PDText type="bodySemiBold" color={ waterType === water.value ? 'white' : 'greyDarker' }>
                        {water.display}
                    </PDText>
                    {!!(waterType === water.value) && (
                        <SVG.IconCheckmark width={ 24 } height={ 24 } fill="white" style={ styles.checkmark } />
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

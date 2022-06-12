import React from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { TargetRange } from '~/formulas/models/TargetRange';
import { useLoadFormulaHook } from '~/hooks/RealmPoolHook';

import CustomTargetsItem from './CustomTargetsItem';
import { usePoolFromAmbiguousSource } from './PoolHelper';
import { TargetsHelper } from './TargetHelper';

export const CustomTargetsScreen : React.FC = () => {
    const selectedPool = usePoolFromAmbiguousSource();

    const formula = useLoadFormulaHook(selectedPool?.formulaId);
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const targets = TargetsHelper.listTargetsForFormula(formula);

    if (selectedPool.objectId === 'invalid_pool_id') { console.error('loaded invalid pool on targets screen!'); }

    return (
        <PDSafeAreaView style={ { backgroundColor: theme.colors.white } } forceInset={ { bottom: 'never' } } >
            <ScreenHeader textType="heading" color="blue">
                Target Levels
            </ScreenHeader>
            <KeyboardAwareFlatList
                keyboardDismissMode={ 'interactive' }
                keyboardShouldPersistTaps={ 'handled' }
                data={ targets }
                renderItem={ ({ item }: { item: TargetRange }) => <CustomTargetsItem tr={ item } pool={ selectedPool } /> }
                keyExtractor={ (item: TargetRange) => item.var }
                style={ [styles.container , { backgroundColor: theme.colors.background }] }
                contentContainerStyle={ styles.content }
                contentInset={ insets }
                automaticallyAdjustContentInsets
            />
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 18,
        paddingTop: 18,
        marginBottom: 18,
    },
    recipeName: {
        marginBottom: PDSpacing.sm,
    },
});


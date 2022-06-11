import * as React from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { PDText } from '~/components/PDText';
import { useLoadFormulaHook } from '~/hooks/RealmPoolHook';
import { PDNavParams } from '~/navigator/shared';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useEntryPool } from '../pool/editOrCreate/hooks/useEntryPool';
import { FormulaListItem } from './FormulaListItem';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { useContrastStatusBar } from '~/hooks/useStatusBar';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { Formula } from '~/formulas/models/Formula';
import { FormulaService } from '~/services/FormulaService';

export interface FormulaListNavParams {
    poolName?: string;
    prevScreen: 'ReadingList' | 'EditOrCreatePoolScreen' | 'PoolScreen';
}

export const FormulaListScreen: React.FC = () => {
    const { navigate } = useNavigation<StackNavigationProp<PDNavParams, 'FormulaList'>>();
    const theme = useTheme();
    useContrastStatusBar();

    const { pool } = useEntryPool();
    const activeFormulaId = pool.formulaId;
    const currentFormula = useLoadFormulaHook(activeFormulaId);
    const { params } = useRoute<RouteProp<PDNavParams, 'FormulaList'>>();

    const allFormulas = React.useMemo(
        FormulaService.getAllFormulas, []
    );

    // const fillColor = theme.colors.orange;
    const backgroundColor = theme.colors.blurredOrange;

    const handleFormulaSelected = (formula: Formula): void => {
        navigate('FormulaDetails', {
            formulaId: formula.id,
            prevScreen: params.prevScreen,
        });
    };

    const sections = [
        {
            title: '',
            subTitle: 'This controls what readings you\'ll take.',
            data: [currentFormula],
        },
        {
            title: 'All Formulas',
            subTitle: 'The Pooldash team has made some formulas for popular pool-types.',
            data: allFormulas,
        },
    ];

    return (
        <PDSafeAreaView bgColor="white" forceInset={ { bottom: 'never' } }>
            <ScreenHeader color="orange" hasBackButton hasBottomLine>Change Formula</ScreenHeader>
            <SectionList
                style={ { ...styles.scrollView, backgroundColor } }
                sections={ sections }
                renderItem={ ({ item }) => (
                    <FormulaListItem
                        formula={ item }
                        onFormulaSelected={ handleFormulaSelected }
                        key={ item.id }
                        isActiveFormula={ item.id === activeFormulaId }
                    />
                ) }
                renderSectionHeader={ ({ section: { title, subTitle } }) => (
                    <>
                        <PDText type="default" color="black" style={ styles.sectionTitle }>{title}</PDText>
                        <PDText type="content" color="greyDark" style={ styles.explainerText }>{subTitle}</PDText>
                    </>
                ) }
                contentInset={ { bottom: 34 } }
                stickySectionHeadersEnabled={ false }
            />
        </PDSafeAreaView>
    );
};


const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    sectionTitle: {
        marginTop: 12,
        marginLeft: 16,
        fontSize: 28,
        fontWeight: '700',
    },
    explainerText: {
        marginBottom: PDSpacing.sm,
        marginHorizontal: PDSpacing.md,
    },
});

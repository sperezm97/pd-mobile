import * as React from 'react';
import { Alert, Linking, SectionList, StyleSheet } from 'react-native';
import { PDText } from '~/components/PDText';
import { useLoadRecipeHook } from '~/hooks/RealmPoolHook';
import { FormulaMeta } from '~/models/recipe/FormulaMeta';
import { PDNavParams } from '~/navigator/shared';
import { Config } from '~/services/Config/AppConfig';
import { FormulaAPI } from '~/services/gql/FormulaAPI';
import { RecipeService } from '~/services/RecipeService';
import { RS } from '~/services/RecipeUtil';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useEntryPool } from '../pool/editOrCreate/hooks/useEntryPool';
import { FormulaListItem } from './FormulaListItem';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { useContrastStatusBar } from '~/hooks/useStatusBar';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';

export interface FormulaListNavParams {
    poolName?: string;
    prevScreen: 'ReadingList' | 'EditOrCreatePoolScreen' | 'PoolScreen';
}

export const FormulaListScreen: React.FC = () => {
    const { data } = FormulaAPI.useFormulaList();
    const { navigate } = useNavigation<StackNavigationProp<PDNavParams, 'FormulaList'>>();
    const theme = useTheme();
    useContrastStatusBar();

    const { pool } = useEntryPool();
    // gross
    const activeFormulaId = RS.reverseKey(pool.recipeKey ?? '0|0').id;

    const currentRecipe = useLoadRecipeHook(pool?.recipeKey || RecipeService.defaultFormulaKey);
    const { params } = useRoute<RouteProp<PDNavParams, 'FormulaList'>>();

    // Filter the current recipe from the list
    const allFormulas = (data?.listFormulas ?? [])
        .filter(f => f.id !== activeFormulaId);
    const officialFormulas = allFormulas.filter(f => RS.isOfficial(f));
    const communityFormulas = allFormulas.filter(f => !RS.isOfficial(f));

    // const fillColor = theme.colors.orange;
    const backgroundColor = theme.colors.blurredOrange;

    const handleUpdatePressed = () => {
        Linking.openURL(Config.appStoreListing);
    };

    const promptUpdate = () => {
        Alert.alert(
            'Update Required',
            'This recipe requires a newer app version. Update now?',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'Update',
                    onPress: handleUpdatePressed,
                    style: 'default',
                },
            ],
            { cancelable: true },
        );
    };

    const handleRecipeSelected = (recipe: FormulaMeta): void => {
        if (RS.needUpdateToUseRecipe(recipe, Config.version)) {
            promptUpdate();
        } else {
            const key = RS.getKey(recipe);
            navigate('FormulaDetails', { formulaKey: key, prevScreen: params.prevScreen });
        }
    };

    const currentMeta: FormulaMeta = {
        name: currentRecipe?.name || 'loading...',
        ts: currentRecipe?.ts || 0,
        id: currentRecipe?.id || '',
        desc: currentRecipe?.description || '',
        appVersion: currentRecipe?.appVersion || '1.0.0',
        // yuck
        isOfficial: !!currentRecipe && RS.isOfficial(currentRecipe),
    };

    const sections = [
        {
            title: '',
            subTitle: 'This controls what readings you\'ll take.',
            data: [currentMeta],
        },
        {
            title: 'Official Formulas',
            subTitle: 'The Pooldash team has made some formulas for popular pool-types.',
            data: officialFormulas,
        },
        {
            title: 'Community Formulas',
            subTitle: 'People from all over the world have made their own formulas.',
            data: communityFormulas,
        },
    ];

    return (
        <PDSafeAreaView bgColor="white" forceInset={ { bottom: 'never' } }>
            <ScreenHeader color="orange" hasBackButton hasBottomLine>Change Formula</ScreenHeader>
            <SectionList
                style={ { ...styles.scrollView, backgroundColor } }
                sections={ sections }
                renderItem={ ({ item }) => (
                    <FormulaListItem formula={ item } onFormulaSelected={ handleRecipeSelected } key={ item.id } isActiveFormula={ item.id === activeFormulaId } />
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

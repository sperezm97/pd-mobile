import * as React from 'react';
import {
    ScrollView, StyleSheet,
} from 'react-native';
import { BoringButton } from '~/components/buttons/BoringButton';
import { PDText } from '~/components/PDText';
import { useLoadFormulaHook } from '~/hooks/RealmPoolHook';
import { PDCardNavigatorParams } from '~/navigator/PDCardNavigator';
import { PDStackNavigationProps } from '~/navigator/shared';
import { dispatch } from '~/redux/AppState';
import { updateSelectedFormula } from '~/redux/selectedFormula/Actions';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { useContrastStatusBar } from '~/hooks/useStatusBar';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { FormulaID } from '~/formulas/models/FormulaID';

export interface FormulaDetailsNavParams {
    formulaId: FormulaID;
    prevScreen: 'ReadingList' | 'EditOrCreatePoolScreen' | 'PoolScreen';
}

export const FormulaScreen: React.FC = () => {
    const { navigate } = useNavigation<PDStackNavigationProps>();
    const { params } = useRoute<RouteProp<PDCardNavigatorParams, 'FormulaDetails'>>();

    const formula = useLoadFormulaHook(params.formulaId);

    const theme = useTheme();
    useContrastStatusBar();

    if (!formula) {
        return <PDView bgColor="background" />;
    }

    const handleSelectFormulaPressed = () => {
        dispatch(updateSelectedFormula(params.formulaId));
        console.log('Formula id: ' + params.formulaId);
        navigate(params.prevScreen);
    };

    const readingList = formula.readings.map((r) => (
        <PDText type="content" style={ styles.textBody } key={ `r:${formula.readings.indexOf(r)}` }>
            • {r.name}
        </PDText>
    ));
    const treatmentList = formula.treatments.map((t) => (
        <PDText type="content" style={ styles.textBody } key={ `t:${formula.treatments.indexOf(t)}` }>
            • {t.name}
        </PDText>
    ));

    const bottomBorderStyle = { borderBottomColor: theme.colors.border, borderBottomWidth: 2 };
    const scrollViewStyle = { backgroundColor: theme.colors.blurredOrange };

    return (
        <PDSafeAreaView  bgColor="white">
            <PDView bgColor="white" style={ styles.container }>
                <ScreenHeader color="orange" hasBackButton hasBottomLine={ false }>Formula Details</ScreenHeader>
                <PDView style={ [styles.titleContainer, bottomBorderStyle] }>
                    <PDView style={ {  flexDirection: 'row', marginBottom: PDSpacing.xs } }>
                        <PDText type="heading" color="black">
                            {formula.name}{'  '}
                        </PDText>
                    </PDView>
                </PDView>
                <ScrollView style={ [bottomBorderStyle, scrollViewStyle] } contentInset={ { top: 12, bottom: 12 } }>
                    <PDText type="content" style={ styles.textBody }>
                        {formula.description}
                    </PDText>
                    <PDText type="subHeading" color="greyDark" style={ styles.textTitle }>
                        Readings
                    </PDText>
                    {readingList}
                    <PDText type="subHeading" color="greyDark" style={ styles.textTitle }>
                        Treatments
                    </PDText>
                    {treatmentList}
                    {/* <PDText type="subHeading" color="greyDark" style={ styles.textTitle }>
                        View calculations
                    </PDText> */}
                    {/* <View style={ styles.topRow }>
                        <TouchableHighlight
                            onPressIn={ () => setIsWebButtonPressed(true) }
                            onPressOut={ () => setIsWebButtonPressed(false) }
                            onPress={ handleViewDetailsPressed }>
                            <PDText type="default" style={ webButtonStyles }>
                                Open in your browser
                            </PDText>
                        </TouchableHighlight>
                    </View> */}
                </ScrollView>
                <BoringButton
                    containerStyles={ [styles.button, { backgroundColor: theme.colors.orange }] }
                    onPress={ handleSelectFormulaPressed }
                    title="Use formula"
                />
            </PDView>
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    titleContainer: {
        paddingLeft: PDSpacing.md,
    },
    button: {
        alignSelf: 'stretch',
        margin: 12,
        marginBottom: 24,
    },
    textTitle: {
        margin: PDSpacing.sm,
    },
    textBody: {
        marginLeft: PDSpacing.md,
        marginBottom: 3,
    },
    topRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginLeft: 24,
    },
    recipeLinkPressed: {
        backgroundColor: 'transparent',
        color: '#3910E8',
        fontSize: 18,
    },
    recipeLinkNormal: {
        backgroundColor: 'transparent',
        color: '#3910E8',
        fontSize: 18,
        textDecorationLine: 'underline',
    },
});

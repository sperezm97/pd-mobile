import * as React from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';

import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Formula } from '~/formulas/models/Formula';

interface FormulaListItemProps {
    formula: Formula;
    onFormulaSelected: (formula: Formula) => void;
    isActiveFormula: boolean;
}

export const FormulaListItem: React.FC<FormulaListItemProps> = (props) => {
    const handleButtonPressed = (): void => {
        props.onFormulaSelected(props.formula);
    };

    const { formula } = props;

    return (
        <TouchableScale onPress={ handleButtonPressed } activeScale={ 0.98 }>
            <PDView bgColor="white" borderColor={ props.isActiveFormula ? 'blue' : 'border' } style={ [styles.content] } >
                <PDView style={ { flex: 1 } }>
                    <PDView style={ { flexDirection: 'row', marginBottom: PDSpacing.xs } }>
                        <PDText type="bodyBold" color="black">
                            {formula.name}{'  '}
                        </PDText>
                    </PDView>
                    <PDText type="tooltip" color="greyDark">
                        {formula.description}{' '}
                    </PDText>
                </PDView>
            </PDView>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        marginHorizontal: 24,
        marginVertical: 6,
        borderRadius: 8,
        borderWidth: 2,
        paddingVertical: PDSpacing.sm,
        paddingHorizontal: PDSpacing.md,
    },
});

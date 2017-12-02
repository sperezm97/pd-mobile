import * as React from 'react';
import { StyleSheet } from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';
import { SVG } from '~/assets/images';

import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { FormulaMeta } from '~/models/recipe/FormulaMeta';

interface FormulaListItemProps {
    formula: FormulaMeta;
    onFormulaSelected: (formula: FormulaMeta) => void;
    isActiveFormula: boolean;
}

export const FormulaListItem: React.FC<FormulaListItemProps> = (props) => {
    const handleButtonPressed = (): void => {
        props.onFormulaSelected(props.formula);
    };

    const recipe = props.formula;

    return (
        <TouchableScale onPress={ handleButtonPressed } activeScale={ 0.98 }>
            <PDView bgColor="white" borderColor={ props.isActiveFormula ? 'blue' : 'border' } style={ [styles.content] } >
                <PDView style={ { flex: 1 } }>
                    <PDView style={ { flexDirection: 'row', marginBottom: PDSpacing.xs } }>
                        <PDText type="bodyBold" color="black">
                            {recipe.name}{'  '}
                        </PDText>
                        {
                            recipe.isOfficial && <SVG.IconBadge width={ 14 } height={ 14 } style={ { marginTop: 'auto', marginBottom: 'auto' } } />
                        }
                    </PDView>
                    {
                        !recipe.isOfficial &&
                            <PDText type="buttonSmall" color="red" style={ { marginBottom: PDSpacing.xs } }>
                                #{recipe.id}
                            </PDText>
                    }
                    <PDText type="tooltip" color="greyDark">
                        {recipe.desc}{' '}
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

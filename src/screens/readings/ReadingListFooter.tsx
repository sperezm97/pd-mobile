import * as React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { PDText } from '~/components/PDText';
import { PDView } from '~/components/PDView';
import { Recipe } from '~/models/recipe/Recipe';

interface ReadingListFooterProps {
    recipe: Recipe | null;
    pressedChangeRecipe: () => void;
}

export const ReadingListFooter: React.FunctionComponent<ReadingListFooterProps> = (props) => {
    const [isChangeButtonPressed, setIsChangeButtonPressed] = React.useState(false);

    if (!props.recipe) {
        return <PDView />;
    }

    const changeButtonStyles = isChangeButtonPressed ? styles.recipeLinkPressed : styles.recipeLinkNormal;

    return (
        <PDView style={ styles.container }>
            <PDText type="default" color="greyDark" style={ styles.recipeNameIntroText }>
                Current formula:{' '}
                <PDText type="default" color="greyDark" style={ styles.recipeNameText }>
                    {props.recipe.name}
                </PDText>
            </PDText>
            <PDView style={ styles.topRow }>
                <PDText type="default" color="greyDark"  style={ styles.changeRecipeIntro }>
                    Want different readings?{' '}
                </PDText>
                <TouchableHighlight
                    onPressIn={ () => setIsChangeButtonPressed(true) }
                    onPressOut={ () => setIsChangeButtonPressed(false) }
                    onPress={ props.pressedChangeRecipe }>
                    <PDText type="default" style={ changeButtonStyles }>
                        Change formula.
                    </PDText>
                </TouchableHighlight>
            </PDView>
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        marginHorizontal: 16,
        marginBottom: 40,
        backgroundColor: 'transparent',
    },
    topRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    changeRecipeIntro: {
        fontSize: 18,
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
    recipeNameIntroText: {
        fontSize: 18,
    },
    recipeNameText: {
        fontWeight: '700',
        fontSize: 18,
    },
    recipeDescriptionText: {
        fontSize: 18,
        marginTop: 12,
    },
});

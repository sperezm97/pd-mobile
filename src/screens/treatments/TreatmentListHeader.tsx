import * as React from 'react';
import { StyleSheet } from 'react-native';
import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';

interface TreatmentListHeaderProps {
    totalActionableTreatments: number;
}

export const TreatmentListHeader: React.FC<TreatmentListHeaderProps> = ({ totalActionableTreatments }) => {
    const text = (totalActionableTreatments === 0)
        ? 'Congrats, your pool chemistry is balanced!'
        : 'Tap on the units to change them.';

    return (
        <PDView style={ styles.container }>
            <PDText type="bodyMedium" color="greyDark" >
                { text }
            </PDText>
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: PDSpacing.md,
        paddingHorizontal: PDSpacing.md,
        paddingBottom: PDSpacing.sm,
        backgroundColor: 'transparent',
    },
});

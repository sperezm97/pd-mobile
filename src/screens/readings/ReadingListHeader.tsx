import * as React from 'react';
import { StyleSheet } from 'react-native';
import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';

export const ReadingListHeader: React.FC = () => {
    return (
        <PDView style={ styles.container }>
            <PDText type="bodyMedium" color="greyDark" >
                Use any test-kit to take these readings. They're all optional, just uncheck the ones you don't take.
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

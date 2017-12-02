import React from 'react';
import { StyleSheet } from 'react-native';
import { PDProgressBar } from '~/components/PDProgressBar';
import { PDText } from '~/components/PDText';
import { PDColor, PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';

interface ReadingListStickyHeaderProps {
    completedLength: number;
    missingLength: number;
    color: PDColor;
}

/// The reading list header is partially scrollable -- this is the part that persists up top
export const ServiceStickyHeaderList: React.FC<ReadingListStickyHeaderProps> = (props) => {
    const { completedLength, missingLength, color } = props;
    const theme = useTheme();
    const progress = missingLength === 0 ? 1 : completedLength / missingLength;
    const progressColor = theme.colors[color];

    return (
        <PDView style={ [styles.container , { borderBottomColor: theme.colors.border }] } bgColor="white">
            <PDText type="bodyBold" color="greyDark" style={ styles.stepsText }>
                {completedLength} of {missingLength} completed
            </PDText>
            <PDProgressBar
                progress={ progress }
                foregroundColor={ progressColor }
                style={ { height: 4, backgroundColor: theme.colors.greyLight } }
            />
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingTop: PDSpacing.xs,
        paddingHorizontal: PDSpacing.md,
        paddingBottom: PDSpacing.md,
        borderBottomWidth: 2,
        marginBottom: PDSpacing.md,
    },
    stepsText: {
        textTransform: 'uppercase',
        marginBottom: PDSpacing.xs,
    },
});

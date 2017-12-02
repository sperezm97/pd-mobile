import { format } from 'date-fns';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { SVG } from '~/assets/images';
import { PDButtonSolid } from '~/components/buttons/PDButtonSolid';
import { Conditional } from '~/components/Conditional';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { LogEntry } from '~/models/logs/LogEntry';
import { ReadingEntry } from '~/models/logs/ReadingEntry';
import { TreatmentEntry } from '~/models/logs/TreatmentEntry';
import { Util } from '~/services/Util';

interface PoolHistoryListItemProps {
    logEntry: LogEntry;
    isExpanded: boolean;
    handleCellSelected: (id: string) => void;
    handleDeletePressed: (id: string) => void;
    handleEmailPressed: (logEntry: LogEntry) => void;
}

const ReadingRow: React.FC<{ re: ReadingEntry }> = (props) => {
    const { re } = props;
    const theme = useTheme();
    return (
        <PDView style={ styles.rowItemContainer }>
            <SVG.IconCircleCheckmark width={ 16 } height={ 16 } fill={ theme.colors.green } />
            <PDText type="bodyRegular" style={ styles.lineItem }>
                {re.readingName}: {re.value} {re.units}
            </PDText>
        </PDView>
    );
};

const TreatmentRow: React.FC<{ te: TreatmentEntry }> = (props) => {
    const { te } = props;
    let name = te.treatmentName;
    if (te.concentration && te.concentration !== 100) {
        name = `${te.concentration.toFixed(0)}% ${name}`;
    }
    let content = '';
    switch (te.type) {
        case 'dryChemical':
        case 'liquidChemical':
        case 'calculation':
            if (te.displayAmount.length > 0) {
                content = `${name}: ${Util.removeSuffixIfPresent('.0', te.displayAmount)} ${te.displayUnits}`;
            } else {
                content = `${name}`;
            }
            break;
        case 'task':
            content = `${name}`;
            break;
    }

    return (
        <PDView style={ styles.rowItemContainer } >
            <SVG.IconCircleAddSolid width={ 16 } height={ 16 } />
            <PDText type="bodyRegular" style={ styles.lineItem }>
                {content}
            </PDText>
        </PDView>
    );
};

export const PoolHistoryListItem: React.FunctionComponent<PoolHistoryListItemProps> = (props) => {
    const ts = props.logEntry.userTS;
    const dayOfWeek = format(ts, 'cccc');
    const boringDate = format(ts, 'MMM d, y') + format(ts, '  //  h:mma').toLowerCase();
    const formulaName = props.logEntry.formulaName;
    const theme = useTheme();

    let expandedContent: JSX.Element | null = null;
    if (props.isExpanded) {
        const readings = props.logEntry.readingEntries.map((re, i) => (
            <ReadingRow key={ 'r' + re.var + props.logEntry.objectId + `${i}` } re={ re } />
        ));

        const treatments = props.logEntry.treatmentEntries.map((te, i) => (
            <TreatmentRow key={ 't' + te.var + props.logEntry.objectId + `${i}` } te={ te } />
        ));

        expandedContent = <>
            <PDView borderColor="border"  style={ { borderWidth: 1,  marginTop: PDSpacing.xs } } />
            <PDView style={ styles.sectionContainer } >
                <Conditional condition={ !!formulaName }>
                    <PDText type="buttonSmall" color="grey" >
                        Formula
                    </PDText>
                    <PDView style={ styles.rowItemContainer }>
                        <SVG.IconBeaker width={ 16 } height={ 16 } />
                        <PDText type="bodyRegular" color="black" style={ styles.lineItem }>
                            {formulaName}
                        </PDText>
                    </PDView>
                </Conditional>
            </PDView>
            <PDView  style={ styles.sectionContainer } >
                <PDText type="buttonSmall" color="grey">
                    Readings
                </PDText>
                {readings}
            </PDView>
            <PDView style={ styles.sectionContainer } key={ '9o8asd88' + props.logEntry.objectId }>
                <PDText type="buttonSmall" color="grey" >
                    Treatments
                </PDText>
                {treatments}
            </PDView>
            <PDView style={ styles.sectionContainer } key={ '9o8a2388' + props.logEntry.objectId }>
                <PDText type="buttonSmall" color="grey" >
                    Notes
                </PDText>
                <PDText type="bodyRegular" style={ styles.lineItem }>
                    { props.logEntry.notes ?? '' }
                </PDText>
            </PDView>
            <View style={ styles.buttonRow }>
                <PDButtonSolid
                    bgColor="greyLight"
                    textColor="black"
                    onPress={ () => props.handleEmailPressed(props.logEntry) }
                    icon={ <SVG.IconMail fill="white" /> }
                    title="Email" />
                <PDButtonSolid
                    textColor="black"
                    bgColor="red"
                    onPress={ () => props.handleDeletePressed(props.logEntry.objectId) }
                    icon={ <SVG.IconDeleteOutline fill={ theme.colors.black } /> }
                    title="Delete" />
            </View>
        </>;
    }

    const handleButtonPressed = () => {
        props.handleCellSelected(props.logEntry.objectId);
    };

    const Icon = props.isExpanded ? SVG.IconChevronCircleUp : SVG.IconChevronCircleDown;
    return (
        <TouchableScale onPress={ handleButtonPressed } activeScale={ 0.99 }>
            <PDView bgColor="white" borderColor="border" style={ styles.container }>
                <PDView style={ styles.rowContainer }>
                    <PDView>
                        <PDText type="bodyMedium" color="greyDarker">
                            {dayOfWeek}
                        </PDText>
                        <PDText type="bodyRegular" color="greyDark">
                            {boringDate}
                        </PDText>
                    </PDView>
                    <PDView>
                        <Icon />
                    </PDView>
                </PDView>
                {expandedContent}
            </PDView>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        borderWidth: 2,
        paddingHorizontal: PDSpacing.lg,
        paddingVertical: PDSpacing.md,
        marginBottom: PDSpacing.xs,
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionContainer: {
        marginVertical: PDSpacing.xs,
    },
    lineItem: {
        marginLeft: PDSpacing.xs,
        fontWeight: '500',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: PDSpacing.md,
    },
    rowItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

import { format } from 'date-fns';
import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import DatePicker from 'react-native-date-picker';

import { AV, useStandardListAnimation } from '~/components/animation/AnimationHelpers';
import { ChoosyButton } from '~/components/buttons/ChoosyButton';
import { PDTextInput } from '~/components/inputs/PDTextInput';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Haptic } from '~/services/HapticService';
import { Util } from '~/services/Util';


interface TreatmentListFooterProps {
    notes: string;
    updatedNotes: (newText: string) => void;
    ts: number;
    updatedTS: (newTS: number) => void;
    willShowDatePicker: () => void;
    // yuck: just for animation
    index: number;
}

export const TreatmentListFooter: React.FunctionComponent<TreatmentListFooterProps> = (props) => {
    const theme = useTheme();
    const a = useStandardListAnimation(props.index, 'slow');
    const [isShowingDatePicker, setIsShowingDatePicker] = useState(false);

    const entryDate = new Date(props.ts);
    const dateString = format(entryDate, 'h:mma').toLowerCase() + ' on ' + format(entryDate, 'M/d/y');

    const handlePressedDate = () => {
        Haptic.medium();
        const newValueForIsShowingPicker = !isShowingDatePicker;
        setIsShowingDatePicker(newValueForIsShowingPicker);

        if (newValueForIsShowingPicker) {
            Util.doAsync(() => {    // Pause so that this scrolls to the end on the _next_ render cycle when the picker is present.
                props.willShowDatePicker();
            });
        }
    };

    const handleDateChange = (date: Date) => {
        const ts = date.getTime();
        props.updatedTS(ts);
    };

    return (
        <AV y={ a.containerY } opacity={ a.opacity }>
            <PDView style={ styles.container }>
                <PDText type="subHeading" color="black" style={ styles.sectionTitle }>
                    Notes
                </PDText>
                <PDView bgColor="white" borderColor="border" style={ styles.textContainer }>
                    <PDTextInput
                        style={ [styles.text , { borderColor: theme.colors.border, color: theme.colors.black }] }
                        value={ props.notes }
                        onChangeText={ props.updatedNotes }
                        multiline={ true }
                        scrollEnabled={ false }
                        maxFontSizeMultiplier={ 1.4 }
                        allowFontScaling
                    />
                </PDView>
                <PDText type="subHeading" color="black" style={ styles.sectionTitle }>
                    Date of Entry
                </PDText>
                <ChoosyButton
                    title={ dateString }
                    onPress={ handlePressedDate }
                    textStyles={ { color: theme.colors.purple } }
                    styles={ [{ borderColor: theme.colors.border, borderRadius: 24, paddingTop: PDSpacing.md, paddingBottom: PDSpacing.md, paddingLeft: PDSpacing.md }] }
                />
                {isShowingDatePicker && <DatePicker date={ new Date(props.ts) } onDateChange={ handleDateChange } textColor={ theme.colors.black } />}
            </PDView>
        </AV>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    textContainer: {
        borderRadius: 24,
        borderWidth: 2,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        marginTop: PDSpacing.sm,
        marginBottom: PDSpacing.md,
    },
    text: {
        minHeight: 50,
        fontSize: 22,
        fontWeight: '600',
        width: '100%',
    },
});

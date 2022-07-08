import pluralize from 'pluralize';
import * as React from 'react';
import {
    Image, NativeSyntheticEvent, StyleSheet, TextInputEndEditingEventData, TextStyle,
} from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';
import { images } from '~/assets/images';
import { AV, useStandardListAnimation } from '~/components/animation/AnimationHelpers';
import { ChoosyButton } from '~/components/buttons/ChoosyButton';
import { CycleButton } from '~/components/buttons/CycleButton';
import { Conditional } from '~/components/Conditional';
import { PDTextInput } from '~/components/inputs/PDTextInput';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Util } from '~/services/Util';

import { PDText } from '../../components/PDText';
import { TreatmentState } from './TreatmentListHelpers';

interface TreatmentListItemProps {
    treatmentState: TreatmentState;
    onTextboxFinished: (varName: string, text: string) => void;
    handleIconPressed: (varName: string) => void;
    handleUnitsButtonPressed: (varName: string) => void;
    handleTreatmentNameButtonPressed: (varName: string) => void;
    inputAccessoryId?: string;
    index: number;
    isShowingHelp: boolean;
}

export const TreatmentListItem: React.FunctionComponent<TreatmentListItemProps> = (props) => {
    const [textIsEditing, setTextIsEditing] = React.useState(false);
    const theme = useTheme();
    const a = useStandardListAnimation(props.index, 'slow');

    const isEditing = textIsEditing;

    const ts = props.treatmentState;
    const t = ts.treatment;

    const treatmentTaken = ts.isOn;
    const leftImageSource = treatmentTaken ? images.greenCheck : images.incomplete;

    const textInputStyles: TextStyle[] = [styles.textInput, { color: theme.colors.purple, borderColor: theme.colors.border }];
    const unitsTextStyles: TextStyle[] = [styles.unitsText ];

    const treatmentNameTextStyles: TextStyle[] = [styles.treatmentNameText];

    if (ts.isOn || isEditing) {
        textInputStyles.push({ color: theme.colors.black });
    }
    if (ts.isOn) {
        unitsTextStyles.push({ color: theme.colors.black });
        treatmentNameTextStyles.push({ color: theme.colors.black });
    }

    // I thought this next line would come out cleaner, whoops:
    const treatmentName = Util.getDisplayNameForTreatment({ name: t.name, concentration: ts.concentration });
    const valueText = Util.removeSuffixIfPresent('.0', ts.value || '');

    const onTextBeginEditing = () => {
        setTextIsEditing(true);
    };

    const onTextEndEditing = (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        setTextIsEditing(false);
        const finalText = event.nativeEvent.text;
        props.onTextboxFinished(t.id, finalText);
    };

    const onPressedUnitsButton = () => {
        props.handleUnitsButtonPressed(t.id);
    };

    const onPressedTreatmentNameButton = () => {
        props.handleTreatmentNameButtonPressed(t.id);
    };

    return (
        <AV y={ a.containerY } opacity={ a.opacity }>
            <PDView style={ styles.container }>
                <TouchableScale
                    onPress={ () => props.handleIconPressed(t.id) }
                    activeScale={ 0.98 }
                    disabled={ t.type === 'calculation' }>
                    <PDView style={ styles.content } borderColor="border" bgColor="white">
                        <PDView style={ styles.topRow }>
                            <Conditional condition={ t.type === 'calculation' }>
                                <PDText type="default" color="black" style={ styles.ofLabel }>
                                    {t.name}
                                </PDText>
                                <PDTextInput
                                    style={ textInputStyles }
                                    onFocus={ onTextBeginEditing }
                                    onEndEditing={ onTextEndEditing }
                                    keyboardType={ 'decimal-pad' }
                                    inputAccessoryViewID={ props.inputAccessoryId }
                                    defaultValue={ valueText }
                                />
                            </Conditional>
                            <Conditional condition={ t.type !== 'calculation' }>
                                <Image style={ styles.circleImage } source={ leftImageSource } />
                                <Conditional condition={ ['dryChemical', 'liquidChemical'].some((x) => t.type === x) }>
                                    <PDText type="default" color="black" style={ styles.addLabel }>
                                        Add
                                    </PDText>
                                    <PDTextInput
                                        style={ textInputStyles }
                                        onFocus={ onTextBeginEditing }
                                        onEndEditing={ onTextEndEditing }
                                        keyboardType={ 'decimal-pad' }
                                        inputAccessoryViewID={ props.inputAccessoryId }
                                        defaultValue={ valueText }
                                    />
                                    <CycleButton
                                        title={ pluralize(ts.units, parseFloat(valueText)) }
                                        onPress={ onPressedUnitsButton }
                                        textStyles={ unitsTextStyles }
                                        styles={ [styles.unitsButton, {  borderColor: theme.colors.border  }] }
                                    />
                                    <PDText type="default" style={ styles.ofLabel }>
                                        of
                                    </PDText>
                                    <ChoosyButton
                                        title={ treatmentName }
                                        onPress={ onPressedTreatmentNameButton }
                                        textStyles={ treatmentNameTextStyles }
                                        styles={ [styles.unitsButton, {  borderColor: theme.colors.border  }] }
                                    />
                                </Conditional>
                                <Conditional condition={ t.type === 'task' }>
                                    <PDText type="default" style={ treatmentNameTextStyles }>
                                        {t.name}
                                    </PDText>
                                </Conditional>
                            </Conditional>
                        </PDView>
                        {props.isShowingHelp && <PDText type="content" color="greyDark" style={ { margin: PDSpacing.md } }>This is to raise the Free Chlorine or something. Be very careful.</PDText>}
                    </PDView>
                </TouchableScale>
            </PDView>
        </AV>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 10,
    },
    content: {
        flex: 1,
        borderRadius: 24,
        borderWidth: 2,
        elevation: 2,
        marginBottom: 12,
        marginHorizontal: 16,
    },
    topRow: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingTop: 4,
        paddingBottom: 3,
    },
    circleImage: {
        marginRight: 10,
        marginBottom: 16,
        width: 28,
        height: 28,
    },
    addLabel: {
        fontSize: 18,
        fontWeight: '600',
        textAlignVertical: 'center',
        marginRight: 10,
        marginBottom: 16,
    },
    ofLabel: {
        fontSize: 18,
        fontWeight: '600',
        textAlignVertical: 'center',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 16,
    },
    treatmentNameButton: {
        marginBottom: 12,
        alignSelf: 'flex-start',
        marginTop: 5,
    },
    treatmentNameText: {
        color: '#B700F8',
        padding: 0,
        textAlignVertical: 'center',
        fontSize: 22,
    },
    unitsButton: {
        marginLeft: 9,
        marginBottom: 16,
    },
    unitsText: {
        color: '#B700F8',
        fontSize: 22,
        fontWeight: '600',
    },
    textInput: {
        minWidth: 60,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderRadius: 6,
        color: '#B700F8',
        fontFamily: 'Poppins-Regular',
        fontWeight: '600',
        fontSize: 22,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingTop: 2,
        marginBottom: 16,
    },
});

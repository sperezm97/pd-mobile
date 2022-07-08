import pluralize from 'pluralize';
import * as React from 'react';
import { Alert, Keyboard, StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { BoringButton } from '~/components/buttons/BoringButton';
import { ChoosyButton } from '~/components/buttons/ChoosyButton';
import { CloseButton } from '~/components/buttons/CloseButton';
import { CycleButton } from '~/components/buttons/CycleButton';
import { PDTextInput } from '~/components/inputs/PDTextInput';
import { PDText } from '~/components/PDText';
import { useContrastStatusBar } from '~/hooks/useStatusBar';
import { DeviceSettings } from '~/models/DeviceSettings';
import { Treatment, TreatmentType } from '~/formulas/models/Treatment';
import { Scoop } from '~/models/Scoop';
import { DryChemicalUnits, Units, WetChemicalUnits } from '~/models/TreatmentUnits';
import { dispatch, useTypedSelector } from '~/redux/AppState';
import { addScoop, editScoop } from '~/redux/deviceSettings/Actions';
import { clearPickerState } from '~/redux/picker/Actions';
import { PDPickerRouteProps } from '~/screens/picker/PickerScreen';
import { DeviceSettingsService } from '~/services/DeviceSettings/DeviceSettingsService';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { Haptic } from '~/services/HapticService';
import { ScoopService } from '~/services/ScoopService';
import { Converter } from '~/services/TreatmentUnitsService';
import { Util } from '~/services/Util';

import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { getTreatmentWithVar, mapScoopDeviceSettings } from './ScoopDetailsUtils';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDView } from '~/components/PDView';
import { KeyboardButton } from '~/components/buttons/KeyboardButton';
import { useTheme } from '~/components/PDTheme';
import { PDRootNavigatorParams } from '~/navigator/PDRootNavigator';

const getUnits = (type: TreatmentType, s?: string): Units => {
    if (type === 'dryChemical') {
        return Converter.dryFromString(s);
    } else {
        // <Ricky Bobby voice> If you ain't dry, you're wet.
        return Converter.wetFromString(s);
    }
};

export interface ScoopDetailsRouteProps {
    prevScoop: Scoop | null;
}

export const ScoopDetailsScreen = () => {
    useContrastStatusBar();
    const route = useRoute<RouteProp<PDRootNavigatorParams, 'ScoopDetails'>>();
    const { goBack, navigate } = useNavigation<StackNavigationProp<PDRootNavigatorParams>>();
    const { prevScoop } = route.params;
    const theme = useTheme();
    const { ds, updateDS } = useDeviceSettings();
    const pickerState = useTypedSelector(state => state.pickerState);

    const [treatments, setTreatments] = React.useState<Treatment[]>([]);
    const [textValue, setTextValue] = React.useState(prevScoop?.displayValue || '1');
    const [treatment, setTreatment] = React.useState<Treatment | null>(null);
    const [isSelectingInitialTreatment, setIsSelectingInitialTreatment] = React.useState(false);
    const type = treatment?.type || 'dryChemical';

    const [units, setUnits] = React.useState<Units>(getUnits(type, prevScoop?.displayUnits));
    const headerTitle = prevScoop ? 'Edit Scoop' : 'Add Scoop';

    const keyboardAccessoryViewId = 'dedgumThisIsSomeReallyUniqueTextScoopDetailsKeyboard';

    // Complex thing to load all the treatments async:
    React.useEffect(() => {
        const loadAllTreatments = async () => {
            let allTreatments = await ScoopService.getAllTreatments();

            // Each treatment can only have a single scoop... for now:
            allTreatments = allTreatments.filter((t) => {
                return (
                    ds.scoops.findIndex((s) => s.var === t.id) < 0 ||
                    (prevScoop && prevScoop.var === t.id)
                );
            });
            setTreatments(allTreatments);

            if (prevScoop) {
                const listContainingOnlyActiveTreatment = allTreatments.filter((t) => t.id === prevScoop.var);
                if (listContainingOnlyActiveTreatment.length > 0) {
                    setTreatment(listContainingOnlyActiveTreatment[0]);
                }
            } else {
                // Pass the param directly to circumvent the weird state / refresh logic of hooks
                showChemPicker(allTreatments);
                setIsSelectingInitialTreatment(true);
            }
        };
        loadAllTreatments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle selection of a treatment
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        if (pickerState && pickerState.key === 'scoop_chem' && pickerState.value !== null) {
            setIsSelectingInitialTreatment(false);
            const treatmentVar = pickerState.value;
            const newTreatment = getTreatmentWithVar(treatments, treatmentVar);
            if (!newTreatment) {
                dispatch(clearPickerState());
                return;
            }
            setTreatment(getTreatmentWithVar(treatments, treatmentVar));
            // We don't _need_ to pass prevScoop stuff here, but heck, why not?
            setUnits(getUnits(newTreatment.type, prevScoop?.displayUnits));
            dispatch(clearPickerState());
        }
    });

    useFocusEffect(() => {
        if (pickerState && pickerState.key === 'nothing' && isSelectingInitialTreatment) {
            // Hacky, awful special-case to handle the user pressing the "+" button on the settings screen
            // and immediately pressing the x button on chem-selection. In that case, we just dismiss this
            // screen as well. TODO: handle this somewhere else.
            goBack();
        }
    });

    const handleClosePressed = () => {
        Haptic.medium();
        goBack();
    };

    const showChemPicker = (treatmentList: Treatment[]) => {
        Keyboard.dismiss();
        const pickerProps: PDPickerRouteProps = {
            title: headerTitle,
            subtitle: 'Select Chemical',
            items: treatmentList.map((t) => ({
                name: Util.getDisplayNameForTreatment(t),
                value: t.id,
            })),
            pickerKey: 'scoop_chem',
            color: 'pink',
            prevSelection: treatment?.id || prevScoop?.var,
        };
        navigate('PickerScreen', pickerProps);
    };

    const handleTextboxUpdated = (newValue: string) => {
        setTextValue(newValue);
    };

    const handleSavePressed = async () => {
        Keyboard.dismiss();
        // Early exit, just in-case something wonky happened:
        if (!treatment) {
            return;
        }

        let ounces = 0;
        if (type === 'dryChemical') {
            ounces = Converter.dry(+textValue, units as DryChemicalUnits, 'ounces', null);
        } else if (type === 'liquidChemical') {
            ounces = Converter.wet(+textValue, units as WetChemicalUnits, 'ounces', null);
        }

        const newScoop: Scoop = {
            var: treatment.id,
            type: treatment.type,
            displayUnits: units,
            displayValue: textValue,
            chemName: treatment.name,
            ounces,
            guid: Util.generateUUID(),
        };

        let deviceSettings: DeviceSettings | null = null;
        if (prevScoop) {
            deviceSettings = mapScoopDeviceSettings(ds, newScoop, 'edit');
            dispatch(editScoop(newScoop));
        } else {
            deviceSettings = mapScoopDeviceSettings(ds, newScoop, 'create');
            dispatch(addScoop(newScoop));
        }
        await DeviceSettingsService.saveSettings(deviceSettings);
        goBack();
    };

    const handleUnitsPressed = () => {
        let newUnits = units;
        if (type === 'dryChemical') {
            newUnits = Converter.nextDry(units as DryChemicalUnits, null);
        } else {
            newUnits = Converter.nextWet(units as WetChemicalUnits, null);
        }
        setUnits(newUnits);
    };

    const handleDeletePressed = () => {
        Alert.alert(
            'Delete scoop?',
            '',
            [
                {
                    text: 'Cancel',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: 'DELETE',
                    onPress: handleDeleteConfirmed,
                    style: 'destructive',
                },
            ],
            { cancelable: true },
        );
    };

    const handleDeleteConfirmed = async () => {
        const newScoops = Util.deepCopy(ds.scoops).filter((s) => s.var !== treatment?.id);
        await updateDS({ scoops: newScoops });
        goBack();
    };

    const getDeleteButtonOrNull = () => {
        if (!prevScoop) {
            return null;
        }

        return <BoringButton containerStyles={ [styles.deleteButton, { backgroundColor:  theme.colors.red }] } onPress={ handleDeletePressed } title="Delete" />;
    };

    let chemButtonTitle = 'choose';
    if (treatment) {
        chemButtonTitle = Util.getDisplayNameForTreatment(treatment);
    } else if (prevScoop) {
        chemButtonTitle = prevScoop.chemName;
    }

    return (
        <PDSafeAreaView bgColor="white" >
            <PDView style={ [styles.header, { borderBottomColor: theme.colors.border }] }>
                <PDView style={ styles.headerLeft }>
                    <PDText type="heading" color="black" style={ styles.title }>
                        {headerTitle}
                    </PDText>
                </PDView>
                <CloseButton onPress={ handleClosePressed } containerStyle={ styles.closeButton } backIconColor="pink" />
            </PDView>
            <KeyboardAwareScrollView style={ { flex: 1, backgroundColor: theme.colors.blurredPink } }>
                <PDText type="heading" color="black" style={ styles.sectionTitle }>
                    Chemical
                </PDText>
                <ChoosyButton
                    title={ chemButtonTitle }
                    onPress={ () => showChemPicker(treatments) }
                    styles={ styles.chemButton }
                    textStyles={ [styles.chemButtonText, { color: theme.colors.pink }] }
                />
                <PDText type="heading" color="black" style={ styles.sectionTitle }>
                    Size
                </PDText>
                <PDView borderColor="border" bgColor="white" style={ styles.bubbleContainer }>
                    <PDTextInput
                        style={ [styles.textInput, { borderColor: theme.colors.border, color: theme.colors.pink }] }
                        onChangeText={ handleTextboxUpdated }
                        keyboardType={ 'decimal-pad' }
                        inputAccessoryViewID={ keyboardAccessoryViewId }
                        clearTextOnFocus={ true }
                        value={ textValue }
                    />
                    <CycleButton
                        title={ pluralize(units, +(textValue || '0')) }
                        onPress={ handleUnitsPressed }
                        styles={ styles.unitsButton }
                        textStyles={ [styles.unitsText, { color: theme.colors.pink }] }
                    />
                </PDView>
            </KeyboardAwareScrollView>
            <PDView bgColor="white" >
                <BoringButton containerStyles={ [styles.saveButton, { backgroundColor: theme.colors.pink }] } onPress={ handleSavePressed } title="Save" />
                {getDeleteButtonOrNull()}
            </PDView>
            <KeyboardButton nativeID={ keyboardAccessoryViewId } bgColor="pink" textColor="white">
                Done Typing
            </KeyboardButton>
        </PDSafeAreaView>
    );
};



const styles = StyleSheet.create({
    header: {
        marginTop: 24,
        paddingBottom: 12,
        flexDirection: 'row',
        borderBottomWidth: 2,
    },
    headerLeft: {
        flexDirection: 'column',
        flex: 1,
    },
    closeButton: {
        marginLeft: 'auto',
        marginRight: 16,
    },
    title: {
        marginLeft: 12,
        fontSize: 28,
    },
    saveButton: {
        alignSelf: 'stretch',
        margin: 12,
        marginBottom: 24,
    },
    deleteButton: {
        alignSelf: 'stretch',
        margin: 12,
        marginBottom: 24,
        marginTop: -6,
    },
    textInput: {
        minWidth: 60,
        paddingHorizontal: 12,
        borderWidth: 2,
        borderRadius: 6,
        fontFamily: 'Poppins-Regular',
        fontWeight: '600',
        fontSize: 22,
        textAlign: 'center',
        textAlignVertical: 'center',
        paddingTop: 2,
    },
    sectionTitle: {
        marginTop: 12,
        marginLeft: 16,
        fontSize: 28,
    },
    chemButton: {
        marginBottom: 12,
        alignSelf: 'flex-start',
        marginTop: 5,
        marginLeft: 24,
    },
    chemButtonText: {
        fontSize: 20,
    },
    bubbleContainer: {
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 2,
        paddingVertical: 12,
        paddingHorizontal: 16,
        marginBottom: 24,
        marginHorizontal: 24,
        flexDirection: 'row',
    },
    unitsButton: {
        marginLeft: 9,
        marginRight: 'auto',
    },
    unitsText: {
        fontSize: 22,
        fontWeight: '600',
    },
});

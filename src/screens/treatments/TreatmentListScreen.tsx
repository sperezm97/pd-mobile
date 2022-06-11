import * as React from 'react';
import { Keyboard, LayoutAnimation, SectionListData, StyleSheet, View } from 'react-native';
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardButton } from '~/components/buttons/KeyboardButton';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { useLoadFormulaHook, useRealmPoolTargetRangesForPool } from '~/hooks/RealmPoolHook';
import { LogEntry } from '~/models/logs/LogEntry';
import { DryChemicalUnits, Units, WetChemicalUnits } from '~/models/TreatmentUnits';
import { PDNavParams } from '~/navigator/shared';
import { dispatch, useTypedSelector } from '~/redux/AppState';
import { clearPickerState } from '~/redux/picker/Actions';
import { clearReadings } from '~/redux/readingEntries/Actions';
import { Database } from '~/repository/Database';
import { CalculationResult, CalculationService } from '~/services/CalculationService';
import { Config } from '~/services/Config/AppConfig';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { Haptic } from '~/services/HapticService';
import { RealmUtil } from '~/services/RealmUtil';
import { FormulaService } from '~/services/FormulaService';
import { Converter } from '~/services/TreatmentUnitsService';
import { Util } from '~/services/Util';

import { useNavigation, useNavigationState } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { TargetsHelper } from '../customTargets/TargetHelper';
import { PDPickerRouteProps } from '../picker/PickerScreen';
import { TreatmentListFooter } from './TreatmentListFooter';
import { TreatmentListHelpers, TreatmentState } from './TreatmentListHelpers';
import { TreatmentListItem } from './TreatmentListItem';
import { PlayButton } from '~/components/buttons/PlayButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TreatmentListHeader } from './TreatmentListHeader';
import { PDProgressBar } from '~/components/PDProgressBar';
import { useStandardStatusBar } from '~/hooks/useStatusBar';

export const TreatmentListScreen: React.FC = () => {
    useStandardStatusBar();
    const readings = useTypedSelector((state) => state.readingEntries);
    const pool = useTypedSelector(state => state.selectedPool);
    const pickerState = useTypedSelector((state) => state.pickerState);
    const { ds, updateDS } = useDeviceSettings();
    const formulaId = pool?.formulaId || FormulaService.defaultFormulaId;
    const [treatmentStates, setTreatmentStates] = React.useState<TreatmentState[]>([]);
    const [hasSelectedAnyTreatments, setHasSelectedAnyTreatments] = React.useState(false);
    const [notes, setNotes] = React.useState('');
    const { navigate } = useNavigation<StackNavigationProp<PDNavParams>>();
    // I hate this... it's dirty. We should move this into the picker screen maybe?
    const [concentrationTreatmentVar, updateConcentrationTreatment] = React.useState<string | null>(null);
    const formula = useLoadFormulaHook(formulaId);
    const targetRangeOverridesForPool = useRealmPoolTargetRangesForPool(pool?.objectId ?? null);
    const routesInNavStack = useNavigationState(state => state.routes.map(r => r.name));
    const theme = useTheme();
    const insets = useSafeAreaInsets();
    const [isSavingDebounce, setIsSavingDebounce] = React.useState(false);
    const allScoops = ds.scoops;
    const [haveCalculationsProcessed, setHaveCalculationsProcessed] = React.useState(false);
    const [userTS, setUserTS] = React.useState<number>(Date.now());
    const scrollViewRef = React.useRef<KeyboardAwareSectionList>(null);
    const [isShowingHelp, setIsShowingHelp] = React.useState(false);

    const keyboardAccessoryViewId = 'dedgumThisIsSomeReallyUniqueTextTreatmentListKeyboard';

    // This happens on every render... whatever.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    React.useEffect(() => {
        if (
            pickerState &&
            pickerState.key === 'chem_concentration' &&
            pickerState.value !== null &&
            concentrationTreatmentVar
        ) {
            const newConcentration = Math.min(Math.max(parseInt(pickerState.value, 10), 1), 100);

            const treatmentModification = (ts: TreatmentState) => {
                const newOunces = (ts.ounces * ts.concentration) / newConcentration;
                let newValue = newOunces;
                const scoop = TreatmentListHelpers.getScoopForTreatment(ts.treatment.var, allScoops);
                if (ts.treatment.type === 'dryChemical') {
                    newValue = Converter.dryOunces(newOunces, ts.units as DryChemicalUnits, scoop);
                } else if (ts.treatment.type === 'liquidChemical') {
                    newValue = Converter.wetOunces(newOunces, ts.units as WetChemicalUnits, scoop);
                }

                ts.ounces = newOunces;
                ts.value = newValue.toFixed(ts.decimalPlaces);
                ts.concentration = newConcentration;
                return true;
            };

            const didChange = TreatmentListHelpers.updateTreatmentState(
                concentrationTreatmentVar,
                treatmentModification,
                treatmentStates,
                setTreatmentStates,
            );

            dispatch(clearPickerState());
            updateConcentrationTreatment(null);

            if (didChange) {
                const newTreatments = Util.deepCopy(ds.treatments);
                newTreatments.concentrations[concentrationTreatmentVar] = newConcentration;
                // Don't await it, be bold:
                updateDS({ treatments: newTreatments });
            }
        }
    });

    React.useEffect(() => {
        if (!pool || !formula) {
            return;
        }

        const handleCalculatorResults = (res: CalculationResult[]) => {
            const tes = CalculationService.getTreatmentEntriesFromCalculationResult(res, formula);

            const lastUnits = ds.treatments.units;
            const tss: TreatmentState[] = tes
                .map((te) => {
                    const t = TreatmentListHelpers.getTreatmentFromFormula(te.var, formula);
                    if (t === null) {
                        return null;
                    }
                    const defaultDecimalPlaces = 1;

                    let ounces = te.ounces || 0;
                    const baseConcentration = t.concentration || 100;
                    const concentrationOverride = TreatmentListHelpers.getConcentrationForTreatment(t.var, ds);

                    if (concentrationOverride) {
                        ounces = (ounces * baseConcentration) / concentrationOverride;
                    }

                    let units: Units = 'ounces';
                    let value = ounces;
                    const scoop = TreatmentListHelpers.getScoopForTreatment(t.var, allScoops);

                    if (scoop) {
                        // If we have a saved scoop, start with that:
                        if (t.type === 'dryChemical') {
                            value = Converter.dry(value, 'ounces', 'scoops', scoop);
                        } else if (t.type === 'liquidChemical') {
                            value = Converter.wet(value, 'ounces', 'scoops', scoop);
                        }
                    } else if (lastUnits[t.var]) {
                        // Otherwise, try to start w/ the same units as last time
                        units = lastUnits[t.var] as Units;
                        if (units === 'scoops' && !scoop) {
                            /// If the scoop has been deleted
                            units = 'ounces';
                        }
                        if (t.type === 'dryChemical') {
                            value = Converter.dry(value, 'ounces', units as DryChemicalUnits, scoop);
                        } else if (t.type === 'liquidChemical') {
                            value = Converter.wet(value, 'ounces', units as WetChemicalUnits, scoop);
                        }
                    }

                    return {
                        treatment: t,
                        isOn: t.type === 'calculation',
                        value: value.toFixed(defaultDecimalPlaces),
                        units: units as Units,
                        ounces,
                        decimalPlaces: defaultDecimalPlaces,
                        concentration: concentrationOverride || baseConcentration,
                    };
                })
                .filter(Util.notEmpty);

            setTreatmentStates(tss);
            setHaveCalculationsProcessed(true);
        };

        const targets = TargetsHelper.resolveRangesForPool(formula, pool.wallType, targetRangeOverridesForPool);
        const formulaRunRequest = CalculationService.getFormulaRunRequest(formula, pool, readings, targets);
        const formulaResults = CalculationService.run(formulaRunRequest);
        handleCalculatorResults(formulaResults);
    }, [allScoops, ds, formula, pool, readings, targetRangeOverridesForPool]);

    if (!formula || !pool) {
        return <View />;
    }

    const save = async () => {
        // manual debouncing
        if (isSavingDebounce) { return; }
        setIsSavingDebounce(true);

        // sanity check (to appease typescript):
        if (!pool?.objectId) { return; }

        const shouldSaveAllTreatments = !hasSelectedAnyTreatments;

        /// setState hooks don't modify the value in the current context -- so to actually turn the treatment entries "on",
        /// we have to do it somewhat manually (yuck, I should clean this up).
        let finalTreatmentStates = Util.deepCopy(treatmentStates);
        if (shouldSaveAllTreatments) {
            Haptic.heavy();
            finalTreatmentStates = finalTreatmentStates.map(x => ({ ...x, isOn: true }));
            setTreatmentStates(tss => tss.map(x => ({ ...x, isOn: true })));
            Haptic.heavy();
            await Util.delay(0.15);
        } else {
            Haptic.medium();
        }

        const id = Util.generateUUID();
        const ts = Util.generateTimestamp();
        const tes = CalculationService.mapTreatmentStatesToTreatmentEntries(finalTreatmentStates);

        const readingEntries = RealmUtil.createReadingEntriesFromReadingValues(readings, formula);
        const logEntry = LogEntry.make(     // TODO: make these named / keyed properties.
            id,
            pool.objectId,
            ts,
            userTS,
            null,
            readingEntries,
            tes,
            formulaId,
            formula.name,
            notes,
            null
        );

        await Database.saveNewLogEntry(logEntry);
        // Save the last-used units:
        const newTreatments = Util.deepCopy(ds.treatments);
        newTreatments.units = TreatmentListHelpers.getUpdatedLastUsedUnits(
            newTreatments.units,
            finalTreatmentStates,
        );
        updateDS({ treatments: newTreatments });
        dispatch(clearReadings());
        const navigateBackScreen = routesInNavStack.includes('PoolScreen') ? 'PoolScreen' : 'Home';
        navigate(navigateBackScreen);
    };

    const handleIconPressed = (varName: string) => {
        Haptic.heavy();

        // Animate the progress bar change here:
        const springAnimationProperties = {
            type: Config.isIos ? LayoutAnimation.Types.keyboard : LayoutAnimation.Types.easeOut,
            property: LayoutAnimation.Properties.scaleXY,
        };
        const animationConfig = {
            duration: 250, // how long the animation will take
            create: undefined,
            update: springAnimationProperties,
            delete: undefined,
        };
        LayoutAnimation.configureNext(animationConfig);

        setHasSelectedAnyTreatments(true);
        toggleTreatmentSelected(varName);
    };

    const toggleTreatmentSelected = (varName: string) => {
        const modification = (ts: TreatmentState) => {
            ts.isOn = !ts.isOn;
            if (ts.isOn && !ts.value) {
                ts.value = '0';
            }
            return true;
        };
        TreatmentListHelpers.updateTreatmentState(varName, modification, treatmentStates, setTreatmentStates);
    };

    const handleUnitsButtonPressed = (varName: string) => {
        Haptic.light();

        const modification = (ts: TreatmentState) => {
            let newValue = ts.ounces;
            let newUnits = ts.units;
            const scoop = TreatmentListHelpers.getScoopForTreatment(ts.treatment.var, allScoops);

            if (ts.treatment.type === 'dryChemical') {
                newUnits = Converter.nextDry(ts.units as DryChemicalUnits, scoop);
                newValue = Converter.dryOunces(ts.ounces, newUnits, scoop);
            } else if (ts.treatment.type === 'liquidChemical') {
                newUnits = Converter.nextWet(ts.units as WetChemicalUnits, scoop);
                newValue = Converter.wetOunces(ts.ounces, newUnits, scoop);
            }

            ts.units = newUnits;
            ts.value = newValue.toFixed(ts.decimalPlaces);
            return true;
        };
        TreatmentListHelpers.updateTreatmentState(varName, modification, treatmentStates, setTreatmentStates);
    };

    const handleTextFinishedEditing = (varName: string, newText: string) => {
        const modification = (ts: TreatmentState) => {
            let newOunces = 0;
            if (newText.length > 0) {
                let newValue = parseFloat(newText);
                if (isNaN(newValue)) {
                    newValue = 0;
                }
                const scoop = TreatmentListHelpers.getScoopForTreatment(ts.treatment.var, allScoops);

                if (ts.treatment.type === 'dryChemical') {
                    newOunces = Converter.dry(newValue, ts.units as DryChemicalUnits, 'ounces', scoop);
                } else if (ts.treatment.type === 'liquidChemical') {
                    newOunces = Converter.wet(newValue, ts.units as WetChemicalUnits, 'ounces', scoop);
                } else if (ts.treatment.type === 'calculation') {
                    newOunces = newValue;
                }
            }

            ts.ounces = newOunces;
            const decimalHalves = newText.split('.');
            let newDecimalPlaces = 1;
            if (decimalHalves.length > 1) {
                newDecimalPlaces = Math.max(decimalHalves[1].length, 1);
            }
            ts.decimalPlaces = newDecimalPlaces;
            ts.value = parseFloat(newText).toFixed(newDecimalPlaces);
            return true;
        };
        TreatmentListHelpers.updateTreatmentState(varName, modification, treatmentStates, setTreatmentStates);
    };

    const handleTreatmentNameButtonPressed = (varName: string) => {
        Haptic.light();

        const t = TreatmentListHelpers.getTreatmentFromFormula(varName, formula);
        const concentration =
            TreatmentListHelpers.getConcentrationForTreatment(varName, ds) || t?.concentration || 100;
        updateConcentrationTreatment(varName);

        Keyboard.dismiss();
        const pickerProps: PDPickerRouteProps = {
            title: 'Concentration %',
            subtitle: t?.name || '',
            pickerKey: 'chem_concentration',
            prevSelection: concentration.toFixed(0),
        };
        navigate('PickerScreen', pickerProps);
    };

    const sections: SectionListData<TreatmentState>[] = [
        {
            data: [],
            isHeader: true,
        },
        {
            data: treatmentStates,
            isHeader: false,
        },
    ];

    let completed: TreatmentState[] = [];
    let countedTreatmentStates: TreatmentState[] = [];
    if (formula) {
        countedTreatmentStates = treatmentStates.filter((ts) => ts.treatment.type !== 'calculation');
        completed = countedTreatmentStates.filter((ts) => ts.isOn);
    }

    const progress = (countedTreatmentStates.length === 0)
        ? 0
        : completed.length / countedTreatmentStates.length;

    return (
        <PDSafeAreaView bgColor="white" forceInset={ { bottom: 'never' } }>
            <ScreenHeader textType="heading" color="purple" hasHelpButton={ false } handlePressedHelp={ () => setIsShowingHelp(!isShowingHelp) }>Treatments</ScreenHeader>
            <KeyboardAwareSectionList
                style={ StyleSheet.flatten([styles.sectionList, { backgroundColor: theme.colors.background }]) }
                keyboardDismissMode="interactive"
                keyboardShouldPersistTaps="handled"
                ref={ scrollViewRef }
                renderItem={ ({ item, index }) => (
                    <TreatmentListItem
                        treatmentState={ item }
                        onTextboxFinished={ handleTextFinishedEditing }
                        handleUnitsButtonPressed={ handleUnitsButtonPressed }
                        handleIconPressed={ handleIconPressed }
                        handleTreatmentNameButtonPressed={ handleTreatmentNameButtonPressed }
                        inputAccessoryId={ keyboardAccessoryViewId }
                        index={ index }
                        isShowingHelp={ isShowingHelp }
                    />
                ) }
                sections={ sections }
                keyExtractor={ (item) => item.treatment.var }
                contentInsetAdjustmentBehavior="always"
                canCancelContentTouches
                stickySectionHeadersEnabled={ false }
                renderSectionHeader={ ({ section }) => {
                    if (section.isHeader && haveCalculationsProcessed) {
                        return <TreatmentListHeader totalActionableTreatments={ countedTreatmentStates.length }/>;
                    } else {
                        return <PDView />;
                    }
                } }
                renderSectionFooter={ ({ section }) => {
                    // The second part is just to wait on the animation until after the treatments have all been loaded up.
                    if (section.isHeader || !haveCalculationsProcessed) {
                        return <PDView />;
                    } else {
                        return <TreatmentListFooter
                        notes={ notes }
                        updatedNotes={ setNotes }
                        index={ treatmentStates.length }
                        ts={ userTS }
                        updatedTS={ setUserTS }
                        willShowDatePicker={ () => scrollViewRef?.current?.scrollToEnd(true) } />;
                    }
                } }
            />
            <PDProgressBar
                progress={ progress }
                foregroundColor={ theme.colors.purple }
                style={ { height: 4, backgroundColor: theme.colors.greyLight } }
            />
            <PDView
                borderColor="border"
                style={ [styles.bottomButtonContainer, { paddingBottom: insets.bottom }] }
                bgColor="background">
                <PlayButton
                    title={ (hasSelectedAnyTreatments || countedTreatmentStates.length === 0) ? 'Save' : 'Save All' }
                    onPress={ save }
                    buttonStyles={ { backgroundColor: theme.colors.purple } } />
            </PDView>
            <KeyboardButton nativeID={ keyboardAccessoryViewId } bgColor="purple" textColor="white" onPress={ () => Keyboard.dismiss() } >
                Done Typing
            </KeyboardButton>
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    sectionList: {
        flex: 1,
    },
    webview: {
        flex: 0,
    },
    bottomButtonContainer: {
        // borderTopWidth: 2,
        paddingHorizontal: PDSpacing.lg,
    },
});

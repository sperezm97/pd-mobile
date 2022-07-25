import { useNavigation, useNavigationState } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Formula } from '~/formulas/models/Formula';
import { FormulaID } from '~/formulas/models/FormulaID';
import { useLoadFormulaHook, useRealmPoolTargetRangesForPool } from '~/hooks/RealmPoolHook';
import { DeviceSettings } from '~/models/DeviceSettings';
import { IPool } from '~/models/Pool';
import { TargetRangeOverrideV2 } from '~/models/Pool/TargetRangeOverride/TargetRangeOverrideV2';
import { ReadingValue } from '~/models/ReadingValue';
import { Scoop } from '~/models/Scoop';
import { PDNavParams } from '~/navigator/shared';
import { useTypedSelector } from '~/redux/AppState';
import { PickerState } from '~/redux/picker/PickerState';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { FormulaService } from '~/services/FormulaService';
import { TreatmentState } from './TreatmentListHelpers';
import { useTheme, PDTheme } from '~/components/PDTheme';


interface TreatmentListScreenState {
    readings: ReadingValue[];
    pool: IPool | null;
    pickerState: PickerState | null;
    ds: DeviceSettings;
    updateDS: (newSettings: Partial<DeviceSettings>) => Promise<void>;
    formulaId: FormulaID;
    treatmentStates: TreatmentState[];
    setTreatmentStates: React.Dispatch<React.SetStateAction<TreatmentState[]>>;
    hasSelectedAnyTreatments: boolean;
    setHasSelectedAnyTreatments: React.Dispatch<React.SetStateAction<boolean>>;
    notes: string;
    setNotes: React.Dispatch<React.SetStateAction<string>>;
    navigate: StackNavigationProp<PDNavParams>
    concentrationTreatmentVar: string | null;
    updateConcentrationTreatment: React.Dispatch<React.SetStateAction<string | null>>;
    formula: Formula; // not sure which Formula to import, picked '~/formulas/models/Formula'
    targetRangeOverridesForPool: TargetRangeOverrideV2[];
    routesInNavStack: string[]
    theme: PDTheme;
    insets: EdgeInsets;
    isSavingDebounce: boolean;
    setIsSavingDebounce: React.Dispatch<React.SetStateAction<boolean>>;
    allScoops: Scoop[];
    haveCalculationsProcessed: boolean;
    setHaveCalculationsProcessed: React.Dispatch<React.SetStateAction<boolean>>;
    userTS: number;
    setUserTS: React.Dispatch<React.SetStateAction<number>>;
    scrollViewRef: React.RefObject<KeyboardAwareSectionList>;
    isShowingHelp: boolean;
    setIsShowingHelp: React.Dispatch<React.SetStateAction<boolean>>;
}


export const useTreatmentListState = (): TreatmentListScreenState => {
    const readings = useTypedSelector((state) => state.readingEntries);
    const pool = useTypedSelector(state => state.selectedPool);
    const pickerState = useTypedSelector((state) => state.pickerState);
    const { ds, updateDS } = useDeviceSettings();
    const formulaId = pool?.formulaId || FormulaService.defaultFormulaId;
    const [treatmentStates, setTreatmentStates] = React.useState<TreatmentState[]>([]);
    const [hasSelectedAnyTreatments, setHasSelectedAnyTreatments] = React.useState(false);
    const [notes, setNotes] = React.useState('');
    const navigate = useNavigation<StackNavigationProp<PDNavParams>>();
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

    return {
        readings,
        pool,
        pickerState,
        ds,
        updateDS,
        formulaId,
        treatmentStates,
        setTreatmentStates,
        hasSelectedAnyTreatments,
        setHasSelectedAnyTreatments,
        notes,
        setNotes,
        navigate,
        concentrationTreatmentVar,
        updateConcentrationTreatment,
        formula,
        targetRangeOverridesForPool,
        routesInNavStack,
        theme,
        insets,
        isSavingDebounce,
        setIsSavingDebounce,
        allScoops,
        haveCalculationsProcessed,
        setHaveCalculationsProcessed,
        userTS,
        setUserTS,
        scrollViewRef,
        isShowingHelp,
        setIsShowingHelp,
    };
};

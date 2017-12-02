import * as React from 'react';
import { Keyboard, LayoutAnimation, SectionListData, StyleSheet } from 'react-native';
import { KeyboardAwareSectionList } from 'react-native-keyboard-aware-scroll-view';
import { KeyboardButton } from '~/components/buttons/KeyboardButton';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { useLastLogEntryHook, useLoadRecipeHook } from '~/hooks/RealmPoolHook';
import { PDStackNavigationProps } from '~/navigator/shared';
import { dispatch, useTypedSelector } from '~/redux/AppState';
import { clearReadings, recordInput } from '~/redux/readingEntries/Actions';
import { Config } from '~/services/Config/AppConfig';
import { Haptic } from '~/services/HapticService';
import { RecipeService } from '~/services/RecipeService';
import { Util } from '~/services/Util';

import { useNavigation } from '@react-navigation/native';

import { ReadingListItem, ReadingState } from './ReadingListItem';
import { ReadingListHeader } from './ReadingListHeader';
import { PlayButton } from '~/components/buttons/PlayButton';
import { useSafeArea } from 'react-native-safe-area-context';
import { useStandardStatusBar } from '~/hooks/useStatusBar';

export const ReadingListScreen: React.FC = () => {
    const [isSliding, setIsSliding] = React.useState(false);
    const [readingStates, setReadingStates] = React.useState<ReadingState[]>([]);
    const pool = useTypedSelector(state => state.selectedPool);
    const recipe = useLoadRecipeHook(pool?.recipeKey || RecipeService.defaultFormulaKey);
    const { setOptions, navigate } = useNavigation<PDStackNavigationProps>();
    const theme = useTheme();
    const lastLogEntry = useLastLogEntryHook(pool?.objectId ?? '');
    const insets = useSafeArea();
    useStandardStatusBar();

    const keyboardAccessoryViewId = 'wowThisIsSomeReallyUniqueTextReadingListKeyboard';

    React.useEffect(() => {
        setOptions({ gestureResponseDistance: { horizontal: 5 } });
        if (recipe) {
            const readingsOnByDefault = new Set<string>();
            if (lastLogEntry) {
                lastLogEntry.readingEntries
                    .forEach(r => readingsOnByDefault.add(r.var));
            } else {
                recipe.readings
                    .filter(r => r.isDefaultOn)
                    .forEach(r => readingsOnByDefault.add(r.var));
            }
            const initialReadingStates = recipe.readings.map((r) => ({
                reading: r,
                value: r.defaultValue.toFixed(r.decimalPlaces),
                isOn: readingsOnByDefault.has(r.var),
            }));

            // Just incase we had some old reading entries laying around:
            readingStates.forEach((rs) => {
                initialReadingStates.forEach((is) => {
                    if (is.reading.var === rs.reading.var) {
                        is.value = rs.value || is.reading.defaultValue.toFixed(is.reading.decimalPlaces);
                        is.isOn = rs.isOn;
                    }
                });
            });

            setReadingStates(initialReadingStates);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [recipe?.id, recipe?.ts, pool]);

    const handleCalculatePressed = (): void => {
        Haptic.medium();
        dispatch(clearReadings());
        readingStates.forEach((rs) => {
            if (rs.isOn && rs.value !== undefined) {
                dispatch(recordInput(rs.reading, parseFloat(rs.value)));
            }
        });
        navigate('TreatmentList');
    };

    const handleSlidingStopped = (varName: string) => {
        setIsSliding(false);
        let isChanged = false;
        const rs = Util.deepCopy(readingStates);
        rs.forEach((r) => {
            if (r.reading.var === varName && !r.isOn) {
                isChanged = true;
                r.isOn = true;
            }
        });
        if (isChanged) {
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
            setReadingStates(rs);
        }
    };

    const handleSlidingStarted = () => {
        setIsSliding(true);
    };

    const handleSliderUpdatedValue = (varName: string, value: number) => {
        const rs = Util.deepCopy(readingStates);
        let isChanged = false;
        rs.forEach((r) => {
            if (r.reading.var === varName) {
                const newValue = value.toFixed(r.reading.decimalPlaces);
                if (newValue !== r.value) {
                    isChanged = true;
                    r.value = newValue;
                }
            }
        });
        if (isChanged) {
            setReadingStates(rs);
            Haptic.bumpyGlide();
        }
    };

    const handleTextboxUpdated = (varName: string, text: string) => {
        const rs = Util.deepCopy(readingStates);
        rs.forEach((r) => {
            if (r.reading.var === varName) {
                r.value = text;
            }
        });
        setReadingStates(rs);
    };

    const handleTextboxDismissed = (varName: string, text: string) => {
        const rs = Util.deepCopy(readingStates);
        rs.forEach((r) => {
            if (r.reading.var === varName) {
                r.value = text;
                r.isOn = text.length > 0;
            }
        });
        setReadingStates(rs);
    };

    const handleIconPressed = (varName: string) => {
        Haptic.light();
        const rs = Util.deepCopy(readingStates);
        rs.forEach((r) => {
            if (r.reading.var === varName) {
                r.isOn = !r.isOn;
                if (r.isOn && !r.value) {
                    r.value = r.reading.defaultValue.toFixed(r.reading.decimalPlaces);
                }
            }
        });
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
        setReadingStates(rs);
    };

    // The first section is just a dummy header thing to enable some fancy scrolling behavior
    let sections: SectionListData<ReadingState>[] = [
        // dummy header
        { data: [], isHeader: true },
        // actual readings
        { data: readingStates, isHeader: false },
    ];

    return (
        <PDSafeAreaView style={ { flex: 1 } } bgColor="white" forceInset={ { bottom: 'never' } }>
            <ScreenHeader textType="heading" color="blue">Readings</ScreenHeader>
            <PDView style={ styles.container } bgColor="background">
                <KeyboardAwareSectionList
                    style={ StyleSheet.flatten([styles.sectionList, { backgroundColor: theme.colors.blurredBlue }]) }
                    scrollEnabled={ !isSliding }
                    keyboardDismissMode={ 'interactive' }
                    keyboardShouldPersistTaps={ 'handled' }
                    renderItem={ ({ item, index }) => (
                        <ReadingListItem
                            readingState={ item }
                            onTextboxUpdated={ handleTextboxUpdated }
                            onTextboxFinished={ handleTextboxDismissed }
                            onSlidingStart={ handleSlidingStarted }
                            onSlidingComplete={ handleSlidingStopped }
                            onSliderUpdatedValue={ handleSliderUpdatedValue }
                            handleIconPressed={ handleIconPressed }
                            inputAccessoryId={ keyboardAccessoryViewId }
                            index={ index }
                        />
                    ) }
                    sections={ sections }
                    keyExtractor={ (item) => item.reading.var }
                    contentInsetAdjustmentBehavior="always"
                    stickySectionHeadersEnabled={ false }
                    canCancelContentTouches={ true }
                    renderSectionHeader={ ({ section }) => {
                        if (section.isHeader) {
                            return <ReadingListHeader />;
                        } else {
                            return <></>;
                        }
                    } }
                />
                <PDView
                    style={ [
                        styles.bottomButtonContainer,
                        {
                            borderColor: theme.colors.border,
                            paddingBottom: insets.bottom,
                        },
                    ] }
                    bgColor="white">
                    <PlayButton onPress={ handleCalculatePressed } title="Calculate" />
                </PDView>
            </PDView>
            <KeyboardButton
                nativeID={ keyboardAccessoryViewId }
                bgColor={ 'blue' }
                textColor="white"
                onPress={ () => Keyboard.dismiss() }>
                Done Typing
            </KeyboardButton>
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    sectionList: {
        flex: 1,
    },
    bottomButtonContainer: {
        borderTopWidth: 4,
        paddingHorizontal: PDSpacing.lg,
    },
});

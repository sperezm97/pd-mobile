import * as React from 'react';
import { StyleSheet, SectionList, Keyboard } from 'react-native';
import { PDText } from '~/components/PDText';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { PickerItem } from './PickerItem';
import { PickerRow } from './PickerRow';
import { dispatch } from '~/redux/AppState';
import { updatePickerState } from '~/redux/picker/Actions';
import { PickerState, PickerKey } from '~/redux/picker/PickerState';
import { PickerSlider } from './PickerSlider';
import { Haptic } from '~/services/HapticService';
import { BoringButton } from '~/components/buttons/BoringButton';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { CloseButton } from '~/components/buttons/CloseButton';
import { PDNavParams } from '~/navigator/shared';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDView } from '~/components/PDView';
import { PDColor, useTheme } from '~/components/PDTheme';

export interface PDPickerRouteProps {
    title: string;
    subtitle: string;
    /// If we're selecting from a list, items must be defined.
    items?: PickerItem[];
    /// Otherwise, we'll assume we're moving a slider.
    pickerKey: PickerKey;
    prevSelection?: string;
    color?: PDColor
}

interface PickerScreenProps {
    navigation: StackNavigationProp<PDNavParams, 'PickerScreen'>;
    route: RouteProp<PDNavParams, 'PickerScreen'>;
}

export const PickerScreen: React.FunctionComponent<PickerScreenProps> = (props: PickerScreenProps) => {
    const { title, subtitle, items, pickerKey, prevSelection, color = 'blue' } = props.route.params;
    const { goBack } = useNavigation();
    const theme = useTheme();

    // This state only applies to the slider (yuck)
    const [textValue, setTextValue] = React.useState(props.route.params.prevSelection || '1');
    // Reminder: this only gets set to `textValue` by this line on the first render
    const [sliderValue, updateSliderValue] = React.useState(parseInt(textValue, 10));
    const [isSliding, setIsSliding] = React.useState(false);

    const handleButtonPress = (value: string) => {
        const pickerState: PickerState = {
            key: pickerKey,
            value,
        };
        dispatch(updatePickerState(pickerState));
        goBack();
    };

    const handleClosePressed = () => {
        Haptic.light();
        // clear the picker state:
        dispatch(updatePickerState({ key: 'nothing', value: null }));
        goBack();
    };

    const handleSliderChanged = (newValue: number) => {
        if (newValue !== sliderValue) {
            Haptic.bumpyGlide();
            updateSliderValue(newValue);
            setTextValue(newValue.toFixed(0));
        }
    };

    const handleTextboxUpdated = (newValue: string) => {
        setTextValue(newValue);
    };

    const handleTextboxDismissed = (newValue: string) => {
        // Range enforcer:
        let finalValue = newValue ? parseInt(newValue, 10) : 1;
        finalValue = Math.max(Math.min(finalValue, 100), 1);

        setTextValue(finalValue.toFixed(0));
    };

    /// Otherwise, show a slider from 0 - 100%:
    const handleSavePressed = () => {
        Haptic.medium();
        Keyboard.dismiss();
        const pickerState: PickerState = {
            key: pickerKey,
            value: textValue,
        };
        dispatch(updatePickerState(pickerState));
        goBack();
    };

    const getContent = (): JSX.Element => {
        /// If items are provided, show a listview
        if (items !== undefined) {
            return (
                <SectionList
                    style={ { flex: 1, paddingTop: 20 } }
                    renderItem={ ({ item }) => (
                        <PickerRow item={ item } onSelect={ handleButtonPress } isSelected={ prevSelection === item.value } />
                    ) }
                    sections={ [{ data: items }] }
                    keyExtractor={ (item) => item.value }
                    overScrollMode={ 'always' }
                />
            );
        }

        return (
            <PDView style={ styles.sliderContainer }>
                <KeyboardAwareScrollView style={ [styles.keyboardContainer , { backgroundColor: theme.colors.background  }] } scrollEnabled={ !isSliding }>
                    <PickerSlider
                        sliderState={ { value: textValue } }
                        onSlidingStart={ () => {
                            setIsSliding(true);
                        } }
                        onSlidingComplete={ () => {
                            setIsSliding(false);
                        } }
                        onSliderUpdatedValue={ handleSliderChanged }
                        onTextboxUpdated={ handleTextboxUpdated }
                        onTextboxFinished={ handleTextboxDismissed }
                    />
                </KeyboardAwareScrollView>
                <PDView bgColor="white">
                    <BoringButton containerStyles={ [styles.saveButton, { backgroundColor: theme.colors.grey }] } onPress={ handleSavePressed } title="Save" />
                </PDView>
            </PDView>
        );
    };

    return (
        <PDSafeAreaView bgColor="white">
            <PDView style={ styles.container }>
                <PDView style={ styles.header }>
                    <PDView style={ styles.headerLeft }>
                        <PDText type="heading" color="black" style={ [styles.title, styles.titleTop] }>
                            {title}
                        </PDText>
                        <PDText type="heading" color={ color } style={ [styles.title, styles.titleBottom] }>
                            {subtitle}
                        </PDText>
                    </PDView>
                    <CloseButton onPress={ handleClosePressed } containerStyle={ styles.closeButton } backIconColor={ color } />
                </PDView>
                {getContent()}
            </PDView>
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
    },
    header: {
        flexDirection: 'row',
    },
    headerLeft: {
        flex: 1,
    },
    title: {
        marginLeft: 12,
    },
    titleBottom: {
        marginBottom: 12,
    },
    titleTop: {
        marginBottom: -3,
    },
    closeButton: {
        marginLeft: 'auto',
        marginRight: 16,
    },
    saveButton: {
        alignSelf: 'stretch',
        margin: 12,
        marginBottom: 24,
    },
    sliderContainer: {
        flex: 1, justifyContent: 'flex-start',
    },
    keyboardContainer: {
        flex: 1,
    },
});

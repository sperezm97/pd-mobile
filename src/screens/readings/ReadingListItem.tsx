import * as React from 'react';
import {
    Image, NativeSyntheticEvent, StyleSheet, TextInputEndEditingEventData, TextStyle,
} from 'react-native';
// import Slider from '@react-native-community/slider';
// @ts-ignore
import Slider from 'react-native-slider';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';
import { images } from '~/assets/images';
import { AV, useStandardListAnimation } from '~/components/animation/AnimationHelpers';
import { PDTextInput } from '~/components/inputs/PDTextInput';
import { PDText } from '~/components/PDText';
import { useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Reading } from '~/models/recipe/Reading';

export interface ReadingState {
    reading: Reading;
    value?: string;
    isOn: boolean;
}

interface ReadingListItemProps {
    readingState: ReadingState;
    onSlidingStart: () => void;
    onSlidingComplete: (varName: string) => void;
    onSliderUpdatedValue: (varName: string, value: number) => void;
    onTextboxUpdated: (varName: string, text: string) => void;
    onTextboxFinished: (varName: string, text: string) => void;
    handleIconPressed: (varName: string) => void;
    inputAccessoryId?: string;
    index: number;
}

export const ReadingListItem: React.FunctionComponent<ReadingListItemProps> = (props) => {
    const [isSliding, setIsSliding] = React.useState(false);
    const [textIsEditing, setTextIsEditing] = React.useState(false);

    const isEditing = isSliding || textIsEditing;
    const theme = useTheme();

    const rs = props.readingState;
    const r = rs.reading;

    const readingTaken = rs.isOn;
    const leftImageSource = readingTaken ? images.greenCheck : images.incomplete;

    // The continuous slider would glitch around very slightly when dragging because of
    // how we're updating the rs.value prop. The steps mitigate this, and also are more precise.
    const sliderStep = Math.pow(10, -r.decimalPlaces);

    // Keep the slider in range sliderMin <= x <= sliderMax
    let sliderValue = rs.value ? parseFloat(rs.value) : 0;
    sliderValue = Math.max(Math.min(sliderValue, r.sliderMax), r.sliderMin);

    let readingUnitsText = '';
    if (r.units) {
        readingUnitsText = ` (${r.units})`;
    }

    const textInputStyles: TextStyle[] = [styles.textInput, { borderColor: theme.colors.border , color: !rs.isOn && !isEditing ? theme.colors.greyDark : theme.colors.blue }];


    const onTextBeginEditing = () => {
        setTextIsEditing(true);
    };

    const onTextChange = (newText: string) => {
        props.onTextboxUpdated(r.var, newText);
    };

    const onTextEndEditing = (event: NativeSyntheticEvent<TextInputEndEditingEventData>) => {
        setTextIsEditing(false);
        const finalText = event.nativeEvent.text;
        props.onTextboxFinished(r.var, finalText);
    };

    const onSliderStart = () => {
        setIsSliding(true);
        props.onSlidingStart();
    };

    const onSliderEnd = () => {
        setIsSliding(false);
        props.onSlidingComplete(r.var);
    };

    const a = useStandardListAnimation(props.index, 'slow');

    return (
        <AV y={ a.containerY } opacity={ a.opacity }>
            <PDView style={ styles.container }>
                <TouchableScale onPress={ () => props.handleIconPressed(r.var) } activeScale={ 0.98 }>
                    <PDView bgColor="white" borderColor="border" style={ styles.content }>
                        <PDView style={ styles.topRow }>
                            <Image style={ styles.circleImage } source={ leftImageSource } />
                            <PDText type="bodySemiBold" color="black" style={ styles.readingName }>
                                {r.name}
                                <PDText type="bodySemiBold"  color="greyDark" style={ styles.readingUnits }>{readingUnitsText}</PDText>
                            </PDText>
                            <PDTextInput
                                style={ textInputStyles }
                                onFocus={ onTextBeginEditing }
                                onChangeText={ onTextChange }
                                onEndEditing={ onTextEndEditing }
                                keyboardType={ 'decimal-pad' }
                                inputAccessoryViewID={ props.inputAccessoryId }
                                value={ rs.value }
                            />
                        </PDView>
                        <Slider
                            style={ styles.slider }
                            minimumValue={ r.sliderMin }
                            maximumValue={ r.sliderMax }
                            minimumTrackTintColor={ theme.colors.greyLight }
                            maximumTrackTintColor={ theme.colors.greyLight }
                            thumbImage={ theme.isDarkMode ? images.sliderThumbDark : images.sliderThumbLight }
                            thumbStyle={ { backgroundColor: 'transparent' } }
                            onSlidingStart={ onSliderStart }
                            onSlidingComplete={ onSliderEnd }
                            onValueChange={ (value: number) => props.onSliderUpdatedValue(r.var, value) }
                            value={ sliderValue }
                            step={ sliderStep }
                            thumbTouchSize={ { width: 55, height: 55 } }
                            allowFontScaling
                            maxFontSizeMultiplier={ 1.4 }
                        />
                    </PDView>
                </TouchableScale>
            </PDView>
        </AV>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignContent: 'stretch',
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
        borderRadius: 10,
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingTop: 12,
        paddingBottom: 3,
    },
    slider: {
        flex: 1,
        marginHorizontal: 12,
        marginBottom: 6,
    },
    circleImage: {
        marginRight: 10,
        width: 28,
        height: 28,
    },
    readingName: {
        fontSize: 18,
        flex: 1,
        marginTop: 3,
    },
    readingUnits: {
        fontSize: 18,
        flex: 1,
        marginTop: 3,
    },
    textInput: {
        width: 80,
        borderWidth: 2,
        borderRadius: 6,
        fontFamily: 'Poppins-Regular',
        fontWeight: '600',
        fontSize: 22,
        textAlign: 'center',
    },

});

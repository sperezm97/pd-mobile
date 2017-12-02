import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { KeyboardButton } from '~/components/buttons/KeyboardButton';
import BorderInputWithLabel from '~/components/inputs/BorderInputWithLabel';
import { useTheme } from '~/components/PDTheme';
import { EstimateRoute } from '~/navigator/shared';
import { useVolumeEstimator } from '~/screens/pool/editOrCreate/hooks/useVolumeEstimator';

import { useRoute } from '@react-navigation/native';

import { OvalMeasurements, VolumeEstimatorHelpers } from '../VolumeEstimatorHelpers';
import { ShapesProps } from './ShapeUtils';
import styles from './VolumeEstimatorStyles';

export const OvalVolumeShape:  React.FC<ShapesProps> = (props) => {
    const { params } = useRoute<EstimateRoute>();
    const { unit } = props;
    const { setShape, setEstimation } = useVolumeEstimator(params.shapeId);
    const theme = useTheme();
    const [shapeValues, setShapeValues] = useState<OvalMeasurements>({
        length: '',
        width: '',
        deepest: '',
        shallowest: '',
    });

    const [inputFocus, setInputFocus] = useState<keyof OvalMeasurements>('length');
    const lengthRef = React.useRef<TextInput>(null);
    const widthRef = React.useRef<TextInput>(null);
    const deepestRef = React.useRef<TextInput>(null);
    const shallowestRef = React.useRef<TextInput>(null);


    useEffect(() => {
        const isAllFieldsCompleted = VolumeEstimatorHelpers.areAllRequiredMeasurementsCompleteForShape(shapeValues);
        if (isAllFieldsCompleted) {
            setShape(shapeValues);
            const results = VolumeEstimatorHelpers.estimateOvalVolume(shapeValues, unit);
            setEstimation(results.toString());
        } else {
            setEstimation('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shapeValues, unit]);

    const handleShapeValues = useCallback(
        (key: keyof OvalMeasurements, value: string) => {
            setShapeValues((prev) => ({ ...prev, [key]: +value }));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [shapeValues.deepest, shapeValues.length, shapeValues.shallowest, shapeValues.width],
    );

    const handleFocusInput = useCallback(
        (Key: keyof OvalMeasurements) => {
            setInputFocus(Key);
        },
        [],
    );

    const handleChangedLength = (value: string) => {
        handleShapeValues('length', value);
    };
    const handleChangedWidth = (value: string) => {
        handleShapeValues('width', value);
    };
    const handleChangedDeepest = (value: string) => {
        handleShapeValues('deepest', value);
    };
    const handleChangedShallowest = (value: string) => {
        handleShapeValues('shallowest', value);
    };

    const handleNextFocused = () => {
        switch (inputFocus) {
            case 'length':
                widthRef.current?.focus();
                break;
            case 'width':
                deepestRef.current?.focus();
                break;
            case 'deepest':
                shallowestRef.current?.focus();
                break;
            case 'shallowest':
                Keyboard.dismiss();
                break;
        }
    };

    const unitName = VolumeEstimatorHelpers.getAbbreviationUnit(unit);
    const primaryColor = VolumeEstimatorHelpers.getPrimaryColorByShapeId(params.shapeId);
    const onFocusLabel = VolumeEstimatorHelpers.getInputAccessoryLabelByShapeKey(inputFocus);
    const primaryKeyColor = VolumeEstimatorHelpers.getPrimaryThemKeyByShapeId(params.shapeId);

    return (
        <View>
            <View style={ styles.formRow }>
                <BorderInputWithLabel
                    value={ shapeValues.length }
                    label={ `length (${unitName})` }
                    placeholder="Length"
                    onChangeText={ handleChangedLength }
                    keyboardType="numeric"
                    maxLength={ 4 }
                    returnKeyType="search"
                    returnKeyLabel="Next"
                    containerStyles={ styles.textInput }
                    textInputStyleProps={ { color: theme.colors[primaryColor], fontWeight: '600' } }
                    inputAccessoryViewID={ VolumeEstimatorHelpers.inputAccessoryId }
                    onFocus={ () => handleFocusInput('length') }
                    ref={ lengthRef }
                />
                <BorderInputWithLabel
                    value={ shapeValues.width }
                    label={ `width (${unitName})` }
                    placeholder="Length"
                    onChangeText={ handleChangedWidth }
                    keyboardType="numeric"
                    maxLength={ 4 }
                    returnKeyType="search"
                    returnKeyLabel="Next"
                    containerStyles={ styles.textInput }
                    textInputStyleProps={ { color: theme.colors[primaryColor], fontWeight: '600' } }
                    inputAccessoryViewID={ VolumeEstimatorHelpers.inputAccessoryId }
                    onFocus={ () => handleFocusInput('width') }
                    ref={ widthRef }
                />
            </View>
            <View style={ styles.formRow }>
                <BorderInputWithLabel
                    value={ shapeValues.deepest }
                    label={ `deepest (${unitName})` }
                    placeholder="Deepest"
                    onChangeText={ handleChangedDeepest }
                    keyboardType="numeric"
                    maxLength={ 4 }
                    returnKeyType="next"
                    returnKeyLabel="Next"
                    containerStyles={ styles.textInput }
                    textInputStyleProps={ { color: theme.colors[primaryColor], fontWeight: '600' } }
                    inputAccessoryViewID={ VolumeEstimatorHelpers.inputAccessoryId }
                    onFocus={ () => handleFocusInput('deepest') }
                    ref={ deepestRef }
                />
                <BorderInputWithLabel
                    value={ shapeValues.shallowest }
                    label={ `shallowest (${unitName})` }
                    placeholder="Shallowest"
                    onChangeText={ handleChangedShallowest }
                    keyboardType="numeric"
                    maxLength={ 4 }
                    returnKeyType="done"
                    returnKeyLabel="Done"
                    containerStyles={ styles.textInput }
                    textInputStyleProps={ { color: theme.colors[primaryColor], fontWeight: '600' } }
                    inputAccessoryViewID={ VolumeEstimatorHelpers.inputAccessoryId }
                    onFocus={ () => handleFocusInput('shallowest') }
                    ref={ shallowestRef }
                />
            </View>
            <KeyboardButton
                nativeID={ VolumeEstimatorHelpers.inputAccessoryId }
                bgColor={ primaryKeyColor }
                textColor="black"
                onPress={ handleNextFocused }
                hitSlop={ { top: 5, left: 5, bottom: 5, right: 5 } }>
                {onFocusLabel}
            </KeyboardButton>
        </View>
    );
};

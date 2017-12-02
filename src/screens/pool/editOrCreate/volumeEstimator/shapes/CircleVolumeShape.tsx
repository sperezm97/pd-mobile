import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { KeyboardButton } from '~/components/buttons/KeyboardButton';
import BorderInputWithLabel from '~/components/inputs/BorderInputWithLabel';
import { useTheme } from '~/components/PDTheme';
import { EstimateRoute } from '~/navigator/shared';
import { useVolumeEstimator } from '~/screens/pool/editOrCreate/hooks/useVolumeEstimator';

import { useRoute } from '@react-navigation/native';

import { CircleMeasurements, VolumeEstimatorHelpers } from '../VolumeEstimatorHelpers';
import { ShapesProps } from './ShapeUtils';
import styles from './VolumeEstimatorStyles';

const circleVolumeEstimatorAccessoryId = 'circleVolumeEstimatorAccessoryIdViewKeyboardThing3498';

export const CircleVolumeShape: React.FC<ShapesProps> = (props) => {
    const { params } = useRoute<EstimateRoute>();
    const { unit } = props;
    const { setShape, setEstimation } = useVolumeEstimator(params.shapeId);
    const theme = useTheme();
    const [shapeValues, setShapeValues] = useState<CircleMeasurements>({
        diameter: '',
        deepest: '',
        shallowest: '',
    });
    const [inputFocus, setInputFocus] = useState<keyof CircleMeasurements>('diameter');
    const diameterRef = React.useRef<TextInput>(null);
    const deepestRef = React.useRef<TextInput>(null);
    const shallowestRef = React.useRef<TextInput>(null);

    useEffect(() => {
        const isAllFieldsCompleted = VolumeEstimatorHelpers.areAllRequiredMeasurementsCompleteForShape(shapeValues);
        if (isAllFieldsCompleted) {
            setShape(shapeValues);
            const results = VolumeEstimatorHelpers.estimateCircleVolume(shapeValues, unit);
            setEstimation(results.toString());
        } else {
            setEstimation('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shapeValues, unit]);

    const handleShapeValues = useCallback(
        (key: keyof CircleMeasurements, value: string) => {
            setShapeValues((prev) => ({ ...prev, [key]: value }));
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [shapeValues.deepest, shapeValues.diameter, shapeValues.shallowest],
    );

    const handleChangedDiameter = (value: string) => {
        handleShapeValues('diameter', value);
    };
    const handleChangedDeepest = (value: string) => {
        handleShapeValues('deepest', value);
    };
    const handleChangedShallowest = (value: string) => {
        handleShapeValues('shallowest', value);
    };

    const handlePressedNext = () => {
        switch (inputFocus) {
            case 'diameter':
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
    const primaryKeyColor = VolumeEstimatorHelpers.getPrimaryThemKeyByShapeId(params.shapeId);
    const onFocusLabel = VolumeEstimatorHelpers.getInputAccessoryLabelByShapeKey(inputFocus);
    const primaryColor = VolumeEstimatorHelpers.getPrimaryColorByShapeId(params.shapeId);

    return (
        <View>
            <View style={ styles.fromRowOneField }>
                <BorderInputWithLabel
                    value={ shapeValues.diameter }
                    label={ `Diameter (${unitName})` }
                    placeholder="Diameter"
                    onChangeText={ handleChangedDiameter }
                    keyboardType="numeric"
                    maxLength={ 4 }
                    returnKeyLabel="Next"
                    textInputStyleProps={ { color: theme.colors[primaryColor], fontWeight: '600' } }
                    inputAccessoryViewID={ circleVolumeEstimatorAccessoryId }
                    onFocus={ () => setInputFocus('diameter') }
                    ref={ diameterRef }
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
                    inputAccessoryViewID={ circleVolumeEstimatorAccessoryId }
                    onFocus={ () => setInputFocus('deepest') }
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
                    inputAccessoryViewID={ circleVolumeEstimatorAccessoryId }
                    onFocus={ () => setInputFocus('shallowest') }
                    ref={ shallowestRef }
                />
            </View>
            <KeyboardButton
                nativeID={ circleVolumeEstimatorAccessoryId }
                bgColor={ primaryKeyColor }
                textColor="black"
                hitSlop={ { top: 5, left: 5, bottom: 5, right: 5 } }
                onPress={ handlePressedNext }>
                {onFocusLabel}
            </KeyboardButton>
        </View>
    );
};

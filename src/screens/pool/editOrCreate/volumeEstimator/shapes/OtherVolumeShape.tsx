import React, { useCallback, useEffect, useState } from 'react';
import { Keyboard, TextInput, View } from 'react-native';
import { KeyboardButton } from '~/components/buttons/KeyboardButton';
import BorderInputWithLabel from '~/components/inputs/BorderInputWithLabel';
import { useTheme } from '~/components/PDTheme';
import { EstimateRoute } from '~/navigator/shared';
import { useVolumeEstimator } from '~/screens/pool/editOrCreate/hooks/useVolumeEstimator';

import { useRoute } from '@react-navigation/native';

import { OtherMeasurements, VolumeEstimatorHelpers } from '../VolumeEstimatorHelpers';
import { ShapesProps } from './ShapeUtils';
import styles from './VolumeEstimatorStyles';

export const OtherVolumeShape: React.FC<ShapesProps> = (props) => {
    const { params } = useRoute<EstimateRoute>();
    const { unit } = props;
    const { setShape, setEstimation } = useVolumeEstimator(params.shapeId);
    const theme = useTheme();
    const [shapeValues, setShapeValues] = useState<OtherMeasurements>({
        area: '',
        deepest: '',
        shallowest: '',
    });
    const [inputFocus, setInputFocus] = useState<keyof OtherMeasurements>('area');
    const areaRef = React.useRef<TextInput>(null);
    const deepestRef = React.useRef<TextInput>(null);
    const shallowestRef = React.useRef<TextInput>(null);

    useEffect(() => {
        const isAllFieldsCompleted = VolumeEstimatorHelpers.areAllRequiredMeasurementsCompleteForShape(shapeValues);
        if (isAllFieldsCompleted) {
            setShape(shapeValues);
            const results = VolumeEstimatorHelpers.estimateOtherVolume(shapeValues, unit);
            setEstimation(results.toString());
        } else {
            setEstimation('');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shapeValues, unit]);

    const handleShapeValues = useCallback(
        (key: keyof OtherMeasurements, value: string) => {
            setShapeValues((prev) => ({ ...prev, [key]: +value }));
        },

        // eslint-disable-next-line react-hooks/exhaustive-deps
        [shapeValues.deepest, shapeValues.area, shapeValues.shallowest],
    );

    const handleFocusInput = useCallback(
        (Key: keyof OtherMeasurements) => {
            setInputFocus(Key);
        },
        [],
    );

    const handleChangedLength = (value: string) => {
        handleShapeValues('area', value);
    };

    const handleChangedDeepest = (value: string) => {
        handleShapeValues('deepest', value);
    };
    const handleChangedShallowest = (value: string) => {
        handleShapeValues('shallowest', value);
    };

    const handleNextFocused = () => {
        switch (inputFocus) {
            case 'area':
                deepestRef.current?.focus();
                setInputFocus('deepest');
                break;

            case 'deepest':
                shallowestRef.current?.focus();
                setInputFocus('shallowest');
                break;

            case 'shallowest':
                Keyboard.dismiss();
                break;
        }
    };

    const unitName = VolumeEstimatorHelpers.getAbbreviationUnit(unit);
    const primaryKeyColor = VolumeEstimatorHelpers.getPrimaryThemKeyByShapeId(params.shapeId);
    const primaryColor = VolumeEstimatorHelpers.getPrimaryColorByShapeId(params.shapeId);
    const onFocusLabel = VolumeEstimatorHelpers.getInputAccessoryLabelByShapeKey(inputFocus);

    return (
        <View>
            <View style={ styles.fromRowOneField }>
                <BorderInputWithLabel
                    value={ shapeValues.area }
                    label={ `Surface Area (${unitName})` }
                    placeholder="Surface Area"
                    onChangeText={ handleChangedLength }
                    keyboardType="numeric"
                    maxLength={ 4 }
                    returnKeyType="search"
                    returnKeyLabel="Next"
                    textInputStyleProps={ { color: theme.colors[primaryColor], fontWeight: '600' } }
                    inputAccessoryViewID={ VolumeEstimatorHelpers.inputAccessoryId }
                    onFocus={ () => handleFocusInput('area') }
                    ref={ areaRef }
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
                    onSubmitEditing={ handleNextFocused }
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

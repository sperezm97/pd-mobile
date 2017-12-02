import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SVG } from '~/assets/images';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { EstimateRoute } from '~/navigator/shared';

import { useRoute } from '@react-navigation/native';

import { EstimateVolume } from './components/EstimateVolume';
import UnitButton from './components/UnitButton';
import { getElementByShapeId, ShapesProps } from './shapes/ShapeUtils';
import styles from './shapes/VolumeEstimatorStyles';
import { VolumeEstimatorHelpers } from './VolumeEstimatorHelpers';
import { PDView } from '~/components/PDView';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { useTheme } from '~/components/PDTheme';

const EntryShapeScreen: React.FC = () => {
    const { params } = useRoute<EstimateRoute>();
    const { ds } = useDeviceSettings();
    const [unit, setUnit] = useState(ds.units);
    const theme = useTheme();

    /// SVG Rendering
    const shapeName = theme.isDarkMode ? VolumeEstimatorHelpers.getDarkBigShapeForSVG(params.shapeId) : VolumeEstimatorHelpers.getBigShapeForSVG(params.shapeId);
    const ShapeSVG = SVG[shapeName];

    // Colors
    const primaryBlurredColor = VolumeEstimatorHelpers.getPrimaryBlurredColorByShapeId(params.shapeId);
    // Entry Shape
    const EntryShape: React.FC<ShapesProps> = getElementByShapeId(params.shapeId);

    return (
        <PDView bgColor="white" style={ styles.container }>
            <ScreenHeader textType="subHeading" hasBottomLine={ false }>Volume Estimator</ScreenHeader>
            <KeyboardAwareScrollView
                style={ styles.content }
                extraScrollHeight={ 80 }
                enableOnAndroid
                keyboardShouldPersistTaps={ 'handled' }
                >
                <PDView bgColor={ primaryBlurredColor } style={ styles.shapeContainer }>
                    <ShapeSVG width={ '100%' } />
                </PDView>
                <UnitButton unit={ unit } handleUnit={ setUnit } />
                <EntryShape unit={ unit } />
                <EstimateVolume unit={ unit } />
            </KeyboardAwareScrollView>
        </PDView>
    );
};

export default EntryShapeScreen;

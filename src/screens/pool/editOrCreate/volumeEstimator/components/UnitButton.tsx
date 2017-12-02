import React from 'react';
import { CycleButton } from '~/components/buttons/CycleButton';
import { PDText } from '~/components/PDText';
import { useTheme } from '~/components/PDTheme';
import { PoolUnit } from '~/models/Pool/PoolUnit';
import { EstimateRoute } from '~/navigator/shared';
import { VolumeEstimatorHelpers } from '~/screens/pool/editOrCreate/volumeEstimator/VolumeEstimatorHelpers';
import { VolumeUnitsUtil } from '~/services/VolumeUnitsUtil';

import { useRoute } from '@react-navigation/native';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';

interface UnitButtonProps  {
    unit: PoolUnit
    handleUnit: (nextUnit: PoolUnit) => void;
}

const UnitButton: React.FC<UnitButtonProps> = (props) => {
    const { unit, handleUnit } = props;
    const { params } = useRoute<EstimateRoute>();
    const { updateDS } = useDeviceSettings();

    const theme = useTheme();

    const updateDeviceSettingsUnit = (nextUnit: PoolUnit) => {
        updateDS({ units: nextUnit });
    };

    const handlerPressedUnitButton = () => {
        const nextUnit = VolumeUnitsUtil.getNextUnitValue(unit);
        updateDeviceSettingsUnit(nextUnit);
        handleUnit(nextUnit);
    };
    const primaryColor = VolumeEstimatorHelpers.getPrimaryColorByShapeId(params.shapeId);

    // Unit Values
    const unitName = VolumeEstimatorHelpers.getButtonLabelForUnit(unit);

    return (
        <>
            <PDText type="bodyGreyBold" color="grey">
                Unit
            </PDText>
            <CycleButton title={ unitName } onPress={ handlerPressedUnitButton } textStyles={ { color: theme.colors[primaryColor] } } />
        </>
    );
};

export default UnitButton;

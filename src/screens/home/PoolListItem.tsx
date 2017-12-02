import * as React from 'react';
import { StyleSheet } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { AV, useStandardListAnimation } from '~/components/animation/AnimationHelpers';
import { PDText } from '~/components/PDText';
import { PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { IPool } from '~/models/Pool';
import { getDisplayForWaterType } from '~/models/Pool/WaterType';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { VolumeUnitsUtil } from '~/services/VolumeUnitsUtil';
import { ChipButton } from './ChipButton';

interface PoolListItemProps {
    pool: IPool;
    index: number;
    handlePoolPressed: (p: IPool) => void;
    handleEnterReadingsPressed: (p: IPool) => void;
}

export const PoolListItem: React.FC<PoolListItemProps> = (props) => {

    const { pool, handlePoolPressed, handleEnterReadingsPressed } = props;

    const { ds } = useDeviceSettings();
    const volume = VolumeUnitsUtil.getAbbreviatedDisplayVolume(pool.gallons, ds);

    const a = useStandardListAnimation(props.index, 'slow');

    return (
        <AV y={ a.containerY } opacity={ a.opacity }>
            <TouchableScale onPress={ () => handlePoolPressed(pool) } activeScale={ 0.97 } key={ pool.objectId }>
                <PDView bgColor="white" borderColor="border" style={ styles.containerPool }>
                    <PDText type="bodyBold" color="black" numberOfLines={ 3 }>
                        {pool.name}
                    </PDText>
                    <PDText type="bodyMedium" color="greyDark">
                        { getDisplayForWaterType(pool.waterType) }, {volume}
                    </PDText>
                    <ChipButton onPress={ () => handleEnterReadingsPressed(pool) } icon="play" title="Enter Readings" />
                </PDView>
            </TouchableScale>
        </AV>
    );
};

const styles = StyleSheet.create({
    containerPool: {
        paddingTop: PDSpacing.sm,
        paddingBottom: PDSpacing.md,
        paddingHorizontal: PDSpacing.lg,
        borderWidth: 2,
        borderRadius: 24,
        marginBottom: PDSpacing.xs,
    },
});


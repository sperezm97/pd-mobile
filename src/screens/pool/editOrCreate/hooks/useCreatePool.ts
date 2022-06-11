import { useLoadFormulaHook } from '~/hooks/RealmPoolHook';
import { DeviceSettings } from '~/models/DeviceSettings';
import { getDisplayForWallType } from '~/models/Pool/WallType';
import { getDisplayForWaterType } from '~/models/Pool/WaterType';
import { PDStackNavigationProps } from '~/navigator/shared';
import { CreatePoolField, CreatePoolListSection } from '~/screens/pool/editOrCreate/create/CreatePoolHelpers';
import { VolumeUnitsUtil } from '~/services/VolumeUnitsUtil';

import { useNavigation } from '@react-navigation/native';

import { useEntryPool } from './useEntryPool';
import { useVolumeEstimator } from './useVolumeEstimator';
import { EntryPoolHelpers } from '../entryPoolValues/EntryPoolHelpers';


export const useCreatePool = (deviceSettings: DeviceSettings): CreatePoolListSection[] => {
    const { pool } = useEntryPool();
    const { estimation } = useVolumeEstimator();
    const { navigate } = useNavigation<PDStackNavigationProps>();
    const formula = useLoadFormulaHook(pool.formulaId);

    // TODO: load correct target ranges.
    const numberOfTargetLevels = formula?.targets?.length ?? 0;

    const handleNavigateToPopover = (id: CreatePoolField) => {
        const headerInfo = EntryPoolHelpers.entryHeaderInfo[id];
        navigate('EditPoolModal', { headerInfo });
    };

    const handleNavigateToFormulaListScreen = () => {
        navigate('FormulaList', { prevScreen: 'EditOrCreatePoolScreen', poolName: pool.name });
    };

    const handleNavigateToCustomTargets = () => {
        // TODO: fix these targets, there is no "real" selected pool so I'm not sure if this even works:
        navigate('CustomTargets', { prevScreen: 'EditPoolNavigator' });
    };

    const volume: number = pool?.gallons || Number(estimation);

    return [
        {
            title: 'header',
            data: [],
        },
        {
            title: 'basic',
            data: [
                {
                    label: 'Name: ',
                    image: 'IconPoolName',
                    valueColor: pool?.name ? 'blue' : 'grey',
                    id: 'name',
                    value: pool?.name ?? ' Required',
                    onPress: () => handleNavigateToPopover('name'),
                    animationIndex: 0,
                },
                {
                    label: 'Volume: ',
                    image: 'IconPoolVolume',
                    valueColor: volume ? 'pink' : 'grey',
                    id: 'gallons',
                    value: volume ? VolumeUnitsUtil.getDisplayVolume(volume, deviceSettings) : ' Required',
                    onPress: () => handleNavigateToPopover('gallons'),
                    animationIndex: 1,
                },
                {
                    label: 'Water Type: ',
                    image: 'IconPoolWaterType',
                    valueColor: pool?.waterType ? 'green' : 'grey',
                    id: 'waterType',
                    value: pool?.waterType ? getDisplayForWaterType(pool.waterType) : ' Required',
                    onPress: () => handleNavigateToPopover('waterType'),
                    animationIndex: 2,
                },
                {
                    label: 'Wall Type: ',
                    image: 'IconPoolWallType',
                    valueColor: pool?.wallType ? 'purple' : 'grey',
                    id: 'wallType',
                    value: pool?.wallType ? getDisplayForWallType(pool.wallType) : ' Required',
                    onPress: () => handleNavigateToPopover('wallType'),
                    animationIndex: 3,
                },
            ],
        },
        {
            title: 'advanced',
            data: [
            {
                label: 'Formula: ',
                image: 'IconPoolFormula',
                valueColor: formula?.name ? 'orange' : 'grey',
                id: 'formula',
                value: formula?.name ? formula?.name : ' Default',
                onPress: handleNavigateToFormulaListScreen,
                animationIndex: 4,
            },
            {
                id: 'customTargets',
                label: 'Target Levels: ',
                image: 'IconCustomTargets',
                value: `${numberOfTargetLevels} options`,
                valueColor: 'teal',
                onPress: handleNavigateToCustomTargets,
                animationIndex: 5,
            },
            ],
        },
        {
            title: 'optional',
            data: [
                {
                    id: 'email',
                    label: 'Email: ',
                    image: 'IconPoolEmail',
                    valueColor: pool?.name ? 'blue' : 'grey',
                    value: pool?.email ,
                    onPress: () => handleNavigateToPopover('email'),
                    animationIndex: 6,
                },
            ],
        },
    ];
};

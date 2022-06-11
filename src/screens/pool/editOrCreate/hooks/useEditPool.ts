import { useLoadFormulaHook } from '~/hooks/RealmPoolHook';
import { Pool } from '~/models/Pool';
import { getDisplayForWallType } from '~/models/Pool/WallType';
import { getDisplayForWaterType } from '~/models/Pool/WaterType';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useTypedSelector } from '~/redux/AppState';
import { EditPoolField, EditPoolListSection } from '~/screens/pool/editOrCreate/edit/EditPoolHelpers';
import { ExportService } from '~/services/ExportService';
import { VolumeUnitsUtil } from '~/services/VolumeUnitsUtil';

import { useNavigation } from '@react-navigation/native';

import { toPool } from '../shared';
import { EntryPoolHelpers } from '../entryPoolValues/EntryPoolHelpers';

export type MenuItemId =
    | 'name'
    | 'waterType'
    | 'gallons'
    | 'wallType'
    | 'recipe'
    | 'customTargets'
    | 'export'
    | 'delete';

export const useEditPool = (pool: Partial<Pool>, toggleVisible: () => void): EditPoolListSection[] => {
    const deviceSettings = useTypedSelector((state) => state.deviceSettings);
    const formula = useLoadFormulaHook(pool?.formulaId);
    const navigation = useNavigation<PDStackNavigationProps>();

    // TODO: load target levels correctly.
    const numberOfTargetLevels = formula?.targets.length ?? 0;

    const handleNavigateToPopover = (id: EditPoolField) => {
        const headerInfo = EntryPoolHelpers.entryHeaderInfo[id];
        navigation.navigate('EditPoolModal', { headerInfo });
    };

    const handleNavigateToFormulaListScreen = () => {
        navigation.navigate('FormulaList', { prevScreen: 'EditOrCreatePoolScreen', poolName: pool?.name });
    };

    const handleNavigateToCustomTargets = () => {
        navigation.navigate('CustomTargets', { prevScreen: 'EditPoolNavigator' });
    };

    const handleExportButtonPressed = async () => {
        const validatedPool = toPool(pool);
        if (!validatedPool) { return; }
        try {
            await ExportService.generateAndShareCSV(validatedPool);
        } catch (e) {
            console.warn(e);
        }
    };

    const handleDeletePressed = () => {
        toggleVisible();
    };

    return [
        {
            title: 'basic',
            data: [
                {
                    id: 'name',
                    label: 'Name: ',
                    image: 'IconPoolName',
                    value: pool.name,
                    valueColor: 'blue',
                    onPress: () => handleNavigateToPopover('name'),
                    animationIndex: 0,
                },
                {
                    id: 'gallons',
                    label: 'Volume: ',
                    image: 'IconPoolVolume',
                    value: VolumeUnitsUtil.getDisplayVolume(pool.gallons ?? 0, deviceSettings),
                    valueColor: 'pink',
                    onPress: () => handleNavigateToPopover('gallons'),
                    animationIndex: 1,
                },
                {
                    id: 'waterType',
                    label: 'Water Type: ',
                    image: 'IconPoolWaterType',
                    value: getDisplayForWaterType(pool.waterType ?? 'chlorine'),
                    valueColor: 'green',
                    onPress: () => handleNavigateToPopover('waterType'),
                    animationIndex: 2,
                },
                {
                    id: 'wallType',
                    label: 'Wall Type: ',
                    image: 'IconPoolWallType',
                    value: getDisplayForWallType(pool.wallType ?? 'plaster'),
                    valueColor: 'purple',
                    onPress: () => handleNavigateToPopover('wallType'),
                    animationIndex: 3,
                },
            ],
        },
        {
            title: 'advanced',
            data: [
                {
                    id: 'formula',
                    label: 'Formula: ',
                    image: 'IconPoolFormula',
                    value: formula?.name,
                    valueColor: 'orange',
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
                    value: pool?.email,
                    valueColor: 'green',
                    onPress: () => handleNavigateToPopover('email'),
                    animationIndex: 6,
                },
            ],
        },
        {
            title: 'actions',
            data: [
                {
                    id: 'exportData',
                    label: 'Export Data',
                    image: 'IconExportData',
                    valueColor: 'red',
                    onPress: handleExportButtonPressed,
                    animationIndex: 7,
                },
                {
                    id: 'deletePool',
                    label: 'Delete Pool',
                    image: 'IconDelete',
                    valueColor: 'red',
                    onPress: handleDeletePressed,
                    animationIndex: 8,
                },
            ],
        },
    ];
};

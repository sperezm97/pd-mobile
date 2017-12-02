import React from 'react';
import { EditPoolModalNavParams, PoolPopover } from '~/screens/pool/components/PoolPopover';
import { EditOrCreatePoolScreen } from '~/screens/pool/editOrCreate/EditOrCreatePoolScreen';
import { PoolProvider } from '~/screens/pool/editOrCreate/hooks/useEntryPool';
import { ShapeProvider } from '~/screens/pool/editOrCreate/hooks/useVolumeEstimator';
import EntryShapeScreen from '~/screens/pool/editOrCreate/volumeEstimator/EntryShapeScreen';
import SelectShapeScreen from '~/screens/pool/editOrCreate/volumeEstimator/SelectShapeScreen';
import { ShapeId } from '~/screens/pool/editOrCreate/volumeEstimator/VolumeEstimatorHelpers';
import { FormulaListNavParams, FormulaListScreen } from '~/screens/recipes/FormulaListScreen';
import { FormulaDetailsNavParams, FormulaScreen } from '~/screens/recipes/FormulaScreen';

import { createStackNavigator } from '@react-navigation/stack';
import { CustomTargetsScreen } from '~/screens/customTargets/CustomTargetsScreen';

export type PDPoolParams = {
    EditOrCreatePoolScreen: undefined;
    EditPoolModal: EditPoolModalNavParams;
    SelectShape: undefined;
    EntryShape: {
        shapeId: ShapeId;
    };
    FormulaList: FormulaListNavParams;
    FormulaDetails: FormulaDetailsNavParams;
    CustomTargets: { prevScreen: 'ReadingList' | 'EditPoolNavigator' };
};

const PoolStackNavigator = createStackNavigator<PDPoolParams>();


/// Also surrounds navigator with providers for EntryPool hooks & VolumeEstimator hooks.
/// Because of how component trees & navigators work, the providers should wrap the whole navigator
export const EditPoolNavigator: React.FC = () => {

    return (
        <PoolProvider>
            <ShapeProvider>
                <PoolStackNavigator.Navigator headerMode="none" mode="card">
                    <PoolStackNavigator.Screen name="EditOrCreatePoolScreen" component={ EditOrCreatePoolScreen } />
                    <PoolStackNavigator.Screen name="EditPoolModal" component={ PoolPopover } />
                    <PoolStackNavigator.Screen name="SelectShape" component={ SelectShapeScreen } />
                    <PoolStackNavigator.Screen name="EntryShape" component={ EntryShapeScreen } />
                    <PoolStackNavigator.Screen name="FormulaList" component={ FormulaListScreen } />
                    <PoolStackNavigator.Screen name="FormulaDetails" component={ FormulaScreen } />
                    <PoolStackNavigator.Screen name="CustomTargets" component={ CustomTargetsScreen } />
                </PoolStackNavigator.Navigator>
            </ShapeProvider>
        </PoolProvider>
    );
};

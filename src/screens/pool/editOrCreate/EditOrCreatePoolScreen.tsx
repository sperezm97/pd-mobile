import * as React from 'react';

import { useTypedSelector } from '~/redux/AppState';
import { CreatePoolScreen } from './create/CreatePoolScreen';
import { EditPoolScreen } from './edit/EditPoolScreen';
import { useContrastStatusBar } from '~/hooks/useStatusBar';

/// Selects either the edit or create screen based on whether there is a selectedPool in the redux state.
export const EditOrCreatePoolScreen: React.FC = () => {
    useContrastStatusBar();
    const selectedPool = useTypedSelector((state) => state.selectedPool);

    return selectedPool ? <EditPoolScreen /> : <CreatePoolScreen />;
};

/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { PDRootNavigator } from '~/navigator/PDRootNavigator';
import { loadDeviceSettings } from '~/redux/deviceSettings/Actions';

import { ApolloProvider } from '@apollo/react-hooks';

import { DeviceSettings } from './models/DeviceSettings';
import { dispatch } from './redux/AppState';
import { Database } from './repository/Database';
import { RecipeRepo } from './repository/RecipeRepo';
import { CrashServices } from './services/CrashServices';
import { DeviceSettingsService } from './services/DeviceSettings/DeviceSettingsService';
import { getApolloClient } from './services/gql/Client';
import { IAP } from '~/services/subscription/IAP';
import { RecipeService } from './services/RecipeService';
import { useDeviceSettings } from './services/DeviceSettings/Hooks';
import { darkTheme, lightTheme, PDThemeContext } from './components/PDTheme';
import { Appearance } from 'react-native';

export const App: React.FC = () => {
    const [isDatabaseLoaded, setIsDatabaseLoaded] = React.useState(false);
    const [areRecipesPreloaded, setAreRecipesPreloaded] = React.useState(false);
    const [areDeviceSettingsLoaded, setAreDeviceSettingsLoaded] = React.useState(false);
    const { updateDSForPurchaseState, ds } = useDeviceSettings();   // Can i do this before loadDeviceSettings is called?
    const apolloClient = getApolloClient();

    React.useEffect(() => {
        Database.prepare().finally(() => {
            setIsDatabaseLoaded(true);
        });

        RecipeRepo.savePreloadedRecipes().finally(() => {
            setAreRecipesPreloaded(true);
        });

        DeviceSettingsService.getSettings().then((settings: DeviceSettings) => {
            dispatch(loadDeviceSettings(settings));
            setAreDeviceSettingsLoaded(true);
        });

        IAP.configureOnLaunch();
        CrashServices.initialize();
    }, []);

    // Only do this after recipes are preloaded & the database is ready to go
    React.useEffect(() => {
        if (isDatabaseLoaded && areRecipesPreloaded) {
            // Also, update all local recipes... but don't wait on this.
            // NOTE: this is an async operation that we're not await-ing on. This is on purpose.
            // We don't want to block app-start on any network calls
            RecipeService.updateAllLocalRecipes(apolloClient);
        }
    }, [isDatabaseLoaded, areRecipesPreloaded]);

    // Only do this after DeviceSettings are loaded:
    React.useEffect(() => {
        if (areDeviceSettingsLoaded) {
            const cb = async () => {
                const purchaseState = await IAP.fetchSubscriptionStatus();
                updateDSForPurchaseState(purchaseState);
            };
            cb();
        }
    }, [areDeviceSettingsLoaded]);

    const isAppReady = isDatabaseLoaded && areRecipesPreloaded && areDeviceSettingsLoaded;
    if (!isAppReady) {
        return <></>;
    }

    // TODO: move into another helper
    let theme = darkTheme;
    if (ds.night_mode === 'light') {
        theme = lightTheme;
    } else if (ds.night_mode === 'system' && Appearance.getColorScheme() === 'light') {
        theme = lightTheme;
    }

    return (
        <ApolloProvider client={ apolloClient }>
            <PDThemeContext.Provider value={ theme }>
                <PDRootNavigator />
            </PDThemeContext.Provider>
        </ApolloProvider>
    );
};


import * as React from 'react';
import { AppRegistry } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { Provider } from 'react-redux';
import { App } from '~/App';
import { store } from '~/redux/AppState';

enableScreens();

const PoolDash: React.FunctionComponent<{}> = () => {
    return (
        <Provider store={ store }>
            <SafeAreaProvider>
                <App />
            </SafeAreaProvider>
        </Provider>
    );
};

AppRegistry.registerComponent('pooldash', () => PoolDash);

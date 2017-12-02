import * as React from 'react';

import { WebView } from 'react-native-webview';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { useStandardStatusBar } from '~/hooks/useStatusBar';
import { Config } from '~/services/Config/AppConfig';

export const TermsScreen: React.FC = () => {
    useStandardStatusBar();
    return (
        <PDSafeAreaView style={ { display: 'flex', backgroundColor: 'white' } } forceInset={ { bottom: 'never' } }>
            <ScreenHeader>Terms of Service</ScreenHeader>
            <WebView source={ { uri: Config.terms_url } } style={ { flex: 1, backgroundColor: 'red' } } />
        </PDSafeAreaView>
    );
};

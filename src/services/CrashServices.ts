import * as Sentry from '@sentry/react-native';
import { Config } from '~/services/Config/AppConfig';

// https://docs.sentry.io/platforms/react-native
export namespace CrashServices {

    export const initialize = () => {
        if (!__DEV__) {
            Sentry.init({
                release: Config.version,
                dsn: 'https://5b0b3461aae34a1cbd52d9cc2136d1a8@o590587.ingest.sentry.io/5740181',
                debug: __DEV__,
                autoSessionTracking: true,
                // Session will close after 10 seconds in background
                sessionTrackingIntervalMillis: 10000,
              });
        }
    };

    export const throwError = () => {
        throw new Error('This is an error');
    };

    export const captureNativeException = (error: any, ) => {
        Sentry.captureException(error);
    };

    export const addCrash = () => {
        Sentry.nativeCrash();
    };
}

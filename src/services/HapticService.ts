import ReactNativeHapticFeedback, { HapticFeedbackTypes } from 'react-native-haptic-feedback';
import { Config } from './Config/AppConfig';

export class Haptic {
    private static options = {
        enableVibrateFallback: false,
        ignoreAndroidSystemSettings: false,
    };

    static selection = () => {
        Haptic.skipAndroid('selection');
    };
    static light = () => {
        Haptic.skipAndroid('impactLight');
    };
    static medium = () => {
        Haptic.skipAndroid('impactMedium');
    };
    static heavy = () => {
        Haptic.skipAndroid('impactHeavy');
    };
    static bumpyGlide = () => {
        Haptic.skipAndroid('textHandleMove');
    };

    private static skipAndroid = (type: HapticFeedbackTypes) => {
        if (Config.isAndroid) {
            return;
        }
        ReactNativeHapticFeedback.trigger(type, Haptic.options);
    };
}

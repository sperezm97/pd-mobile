import { StatusBar } from 'react-native';
import { useTheme } from '~/components/PDTheme';

import { useFocusEffect } from '@react-navigation/native';

/**
 * Switches the color scheme of the status bar
 * to the contrast color under the current theme
 */
export const useContrastStatusBar = () => {
    const { statusBarContrast } = useTheme();

    useFocusEffect(() => {
        StatusBar.setBarStyle(statusBarContrast);
    });
};

/**
 * Switches the color scheme of the status bar
 * to the default color under the current theme
 */
export const useStandardStatusBar = () => {
    const { statusBarDefault } = useTheme();

    useFocusEffect(() => {
        StatusBar.setBarStyle(statusBarDefault);
    });
};

import React from 'react';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { PDPickerRouteProps, PickerScreen } from '~/screens/picker/PickerScreen';
import { PopoverRouteProps, PopoverScreen } from '~/screens/popover/PopoverScreen';
import {
    ScoopDetailsRouteProps, ScoopDetailsScreen,
} from '~/screens/settings/scoops/ScoopDetailsScreen';

import { NavigationContainer } from '@react-navigation/native';

import { EditPoolNavigator } from './EditPoolNavigator';
import { PDCardNavigator } from './PDCardNavigator';
import ThemeToggleScreen from '~/screens/settings/themeToggle/ThemeToggleScreen';
import { useTheme } from '~/components/PDTheme';

// This defines the navigation params accepted by each possible screen in PDRootNavigator
export type PDRootNavigatorParams = {
    EditPoolNavigator: undefined;
    PickerScreen: PDPickerRouteProps;
    PDCardNavigator: undefined;
    ScoopDetails: ScoopDetailsRouteProps;
    AddScoop: undefined
    PopoverScreen: PopoverRouteProps
    ThemeToggleScreen: undefined
};

const RootStack = createNativeStackNavigator<PDRootNavigatorParams>();

export const PDRootNavigator = (): JSX.Element => {
    // Setting this theme here helps the background-color be less jarring on screen transitions:
    const pdTheme = useTheme();
    const navTheme = {
        dark: pdTheme.isDarkMode,
        colors: {
            background: pdTheme.colors.background,    // This is the only important one
            primary: pdTheme.colors.greyDarker,
            border: pdTheme.colors.border,
            notification: pdTheme.colors.blue,
            card: pdTheme.colors.card,
            text: pdTheme.colors.black,
        },
    };

    return (
        <NavigationContainer theme={ navTheme }>
            <RootStack.Navigator
                screenOptions={ {
                    stackPresentation: 'formSheet',
                    headerShown: false,
                } }>
                <RootStack.Screen name="PDCardNavigator" component={ PDCardNavigator } />
                <RootStack.Screen
                    name="PickerScreen"
                    component={ PickerScreen }
                    options={ { stackPresentation: 'fullScreenModal' } }
                />
                <RootStack.Screen name="EditPoolNavigator" component={ EditPoolNavigator } />
                <RootStack.Screen name="ScoopDetails" component={ ScoopDetailsScreen } />
                <RootStack.Screen name="ThemeToggleScreen" component={ ThemeToggleScreen } />
                <RootStack.Screen name="PopoverScreen" component={ PopoverScreen } />
            </RootStack.Navigator>
        </NavigationContainer>
    );
};

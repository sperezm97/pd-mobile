import * as React from 'react';
import { StatusBarStyle } from 'react-native';

// --------------------------------------------------------------
// ---------------------- Theme Types  --------------------------
// --------------------------------------------------------------
export interface PDColorPalette {
    // Blurred Colors
    blurredRed: string;
    blurredBlue: string;
    blurredOrange: string;
    blurredPurple: string;
    blurredTeal: string;
    blurredPink: string;
    blurredGreen: string;

    // Main Colors
    pink: string;
    red: string;
    orange: string;
    green: string;
    teal: string;
    blue: string;
    purple: string;

    background: string
    card: string
    border: string

    white: string;
    greyLightest: string;
    greyLighter: string
    greyLight: string;
    grey: string;
    greyDark: string
    greyDarker: string;
    black: string;

    transparent: string

    // White on both light & dark themes:
    alwaysWhite: string;
}

export type PDColor = keyof PDColorPalette;

/// For now, this is all colors, named after day-mode:
export interface PDTheme {
    // Sometimes we just need custom logic:
    isDarkMode: boolean;

    colors: PDColorPalette;

    // Status bar
    statusBarDefault: StatusBarStyle;
    statusBarContrast: StatusBarStyle;
}

export type PDTextType =
    | 'default'
    | 'tooltip'
    | 'button'
    | 'bodyRegular'
    | 'bodyBold'
    | 'bodySemiBold'
    | 'bodyMedium'
    | 'bodyGreyBold'
    | 'subHeading'
    | 'heading'
    | 'buttonSmall'
    | 'content';

/// Defines some constants for margins / padding / etc...
export const PDSpacing = {
    xs: 8,
    sm: 12,
    md: 16,
    lg: 24,
    xl: 40,
};

const universalColors = {
    alwaysWhite: '#FFFFFF',
    blurredRed: '#EB000007',
    blurredBlue: '#1E6BFF07',
    blurredOrange: '#F06C0007',
    blurredPurple: '#B21FF107',
    blurredTeal: '#00AEA007',
    blurredPink: '#FF007307',
    blurredGreen: '#00A85707',
    pink: '#FF0073',
    red: '#EB0000',
    orange: '#F06C00',
    green: '#00A857',
    teal: '#00AEA0',
    blue: '#1E6BFF',
    purple: '#B21FF1',
    transparent: 'transparent',
};


export const lightTheme: PDTheme = {
    isDarkMode: false,
    statusBarDefault: 'dark-content',
    statusBarContrast: 'light-content',

    colors: {
        white: '#FFFFFF',
        greyLightest: '#FAFAFA',
        greyLighter: '#F7F7F7',
        greyLight: '#EDEDED',
        grey: '#BBBBBB',
        greyDark: '#737373',
        greyDarker: '#262626',
        black: '#000000',

        background: '#FAFAFA',
        card: '#FFFFFF',
        border: '#EDEDED',

        ...universalColors,
    },
};

export const darkTheme: PDTheme = {
    isDarkMode: true,
    statusBarDefault: 'light-content',
    statusBarContrast: 'dark-content',
    colors: {
        white: '#000000' ,
        greyLightest: '#0D0D0D',
        greyLighter: '#080808',
        greyLight: '#1F1F1F',
        grey: '#454545',
        greyDark: '#949494',
        greyDarker: '#E6E6E6',
        black: '#FFFFFF',

        background: '#121212',
        card: '#000000',
        border: '#1F1F1F',
        ...universalColors,
    },
};

export const PDThemeContext = React.createContext<PDTheme>(darkTheme);

export const useTheme = () => React.useContext(PDThemeContext);

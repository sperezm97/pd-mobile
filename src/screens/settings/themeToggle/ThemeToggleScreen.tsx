import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import TouchableScale from 'react-native-touchable-scale';
import { images, SVG } from '~/assets/images';
import { TextButton } from '~/components/buttons/TextButton';
import ModalHeader from '~/components/headers/ModalHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { Haptic } from '~/services/HapticService';

interface ThemeOption {
    key: 'system' | 'dark' | 'light';
    value: string;
}

const themeOptions: ThemeOption[] = [
    {
        key: 'dark',
        value: 'Dark',
    },
    {
        key: 'light',
        value: 'Light',
    },
    {
        key: 'system',
        value: 'Same as System',
    },
];

const ThemeToggleScreen = () => {
    const theme = useTheme();
    const { ds, updateDS } = useDeviceSettings();
    const { goBack } = useNavigation();


    const handleThemeSelection = (newTheme: 'system' | 'light' | 'dark') => {
        Haptic.medium();
        updateDS({
            night_mode: newTheme,
        });
    };

    const subHeading = theme.isDarkMode ? 'Dive into darkness' : 'Swim in the sunshine';

    return (
        <PDSafeAreaView bgColor="white">
            <ModalHeader />
            <ScrollView contentContainerStyle={ styles.contentContainer }>
                <PDView style={ styles.subContainer }>
                    <PDView style={ styles.imageContainer }>
                    { theme.isDarkMode ? <Image source={ images.moonBig } /> : <Image source={ images.sunBig } />}
                    </PDView>
                    <PDText type="subHeading" color="black" textAlign="center">
                        { subHeading }
                    </PDText>

                    <PDView style={ { marginHorizontal: PDSpacing.lg } }>
                        <PDText type="bodySemiBold" color="greyDark">
                            Choose Theme
                        </PDText>
                        <PDView style={ { marginVertical: PDSpacing.md } }>
                            {themeOptions.map(option => (
                                <TouchableScale key={ option.key } onPress={ () => handleThemeSelection(option.key) } activeScale={ 0.97 }>
                                    <PDView bgColor="greyLighter" style={ styles.renderItemContainer } >
                                        {ds.night_mode === option.key ? <Image source={ images.greenCheck } style={ { width: 24, height: 24 } } /> : <SVG.IconEmptyCircle color={ theme.colors.white }/>}
                                        <PDView style={ { marginLeft: PDSpacing.sm } }>
                                            <PDText type="bodyRegular" color="greyDarker">{option.value}</PDText>
                                        </PDView>
                                    </PDView>
                                </TouchableScale>
                                ))}
                        </PDView>
                    </PDView>

                </PDView>
                <TextButton
                    onPress={ goBack }
                    containerStyles={ [styles.buttonContainer , { backgroundColor: theme.colors.greyLightest }] }
                    textStyles={ [styles.buttonText, { color: theme.colors.black } ] }
                    text="Looks Great" />
            </ScrollView>
        </PDSafeAreaView>
    );
};

export default ThemeToggleScreen;

const styles = StyleSheet.create({
    contentContainer: {
        flex:1,
        justifyContent:'space-between',
    },
    subContainer:{
        flex:1,
        justifyContent:'space-evenly',
    },
    imageContainer:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        height: 40,
        width: '100%',
        borderRadius: 27.5,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    renderItemContainer: {
        flexDirection:'row',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: PDSpacing.xs,
        padding: PDSpacing.sm,
    },
});

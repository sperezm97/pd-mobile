import React, { useCallback, useState } from 'react';
import { Keyboard, StyleSheet } from 'react-native';
import { SVG } from '~/assets/images';
import { Button } from '~/components/buttons/Button';
import { ButtonWithChildren } from '~/components/buttons/ButtonWithChildren';
import { KeyboardButton } from '~/components/buttons/KeyboardButton';
import BorderInputWithLabel from '~/components/inputs/BorderInputWithLabel';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { getDisplayForPoolValue, PoolUnit } from '~/models/Pool/PoolUnit';
import { PDStackNavigationProps } from '~/navigator/shared';
import { useVolumeEstimator } from '~/screens/pool/editOrCreate/hooks/useVolumeEstimator';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { VolumeUnitsUtil } from '~/services/VolumeUnitsUtil';

import { useNavigation } from '@react-navigation/native';

import { useEntryPool } from '../hooks/useEntryPool';

export const EntryVolume = () => {
    const { pool, setPool } = useEntryPool();
    const { ds, updateDS } = useDeviceSettings();
    const [volume, setVolume] = useState(() => {
        return VolumeUnitsUtil.getVolumeByUnit(pool?.gallons ?? 0, 'us', ds.units);
    });
    const [units, setUnits] = useState<PoolUnit>(ds.units);
    const navigation = useNavigation<PDStackNavigationProps>();
    const { estimation, clear } = useVolumeEstimator();
    const theme = useTheme();
    const keyboardAccessoryViewId = 'keyboardaccessoryidpooleditscreen2';

    const handleOnPressSaveButton = async () => {
        let gallons = VolumeUnitsUtil.getUsGallonsByUnit(volume, units);
        setPool({ gallons });
        clear();
        Keyboard.dismiss();
        navigation.goBack();
    };

    const handleTextChanged = useCallback((text: string) => {
        // strip commas
        const cleanText = text.replace(',', '');
        setVolume(+cleanText);
    }, []);

    const handleUnitButtonPressed = () => {
        const nextUnit = VolumeUnitsUtil.getNextUnitValue(units);
        setUnits(nextUnit);
        updateDeviceSettingsUnit(nextUnit);
    };

    const updateDeviceSettingsUnit = (newUnits: PoolUnit) => {
        updateDS({ units: newUnits });
    };

    const handleEstimatorButtonPressed = () => {
        navigation.navigate('SelectShape');
    };

    const unitText = getDisplayForPoolValue(units);

    const roundedVolume = estimation ? +estimation : volume;
    let volumeString = roundedVolume.toLocaleString('en-US', { maximumFractionDigits: 0 });
    if (volumeString === '0') { volumeString = ''; }

    const hasVolumeChanged = VolumeUnitsUtil.getUsGallonsByUnit(volume, units) !== pool?.gallons || estimation;

    return (
        <>
            <PDView style={ styles.inputContainer }>
                <BorderInputWithLabel
                    value={ volumeString }
                    placeholder="Pool Volume"
                    label="Volume"
                    style={ styles.textInput }
                    containerStyles={ { flex: 1 } }
                    autoFocus
                    onChangeText={ handleTextChanged }
                    keyboardType="number-pad"
                    inputAccessoryViewID={ keyboardAccessoryViewId }
                    returnKeyType="done"
                    onSubmitEditing={ handleOnPressSaveButton }
                />
                <PDView style={ { minWidth: 150 } }>
                    <PDText type="bodyGreyBold" color="grey">
                        unit
                    </PDText>
                    <Button
                        styles={ [styles.unitButton,  { borderColor: theme.colors.border }] }
                        textStyles={ styles.unitButtonText }
                        textColor="pink"
                        title={ unitText }
                        onPress={ handleUnitButtonPressed }
                    />
                </PDView>
            </PDView>
            <PDText type="bodyGreyBold" color="grey" style={ styles.notSure }>
                not sure?
            </PDText>
            <ButtonWithChildren onPress={ handleEstimatorButtonPressed }>
                <PDView style={ styles.estimatorButtonContainer } bgColor="greyLight">
                    <SVG.IconEstimator width={ 16 } height={ 16 } fill={ theme.colors.black } />
                    <PDText type="subHeading" color="black" style={ { marginLeft: 5 } }>Volume Estimator</PDText>
                </PDView>
            </ButtonWithChildren>
            <KeyboardButton
                onPress={ handleOnPressSaveButton }
                disabled={ !hasVolumeChanged }
                bgColor={ hasVolumeChanged ? 'pink' : 'greyLighter' }
                textColor={ hasVolumeChanged ? 'white' : 'grey' }
                nativeID={ keyboardAccessoryViewId }
                activeOpacity={ 0.6 }
                hitSlop={ { top: 5, left: 5, bottom: 5, right: 5 } }>
                Save
            </KeyboardButton>
        </>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textInput: {
        flex: 1,
        borderWidth: 2,
        borderRadius: 8,
        paddingVertical: 6,
        marginRight: 12,
        minWidth: 100,
        fontFamily: 'Poppins',
        fontWeight: '600',
        fontSize: 16,
        paddingHorizontal: 12,
        color: '#FF0073',
    },
    unitButton: {
        paddingVertical: PDSpacing.xs,
        paddingHorizontal: 20,
        borderRadius: 24,
        borderWidth: 2,
    },
    unitButtonText: {
        fontWeight: '600',
        fontSize: 16,
    },
    notSure: {
        marginTop: PDSpacing.sm,
        marginBottom: PDSpacing.xs,
    },
    estimatorButtonContainer: {
        paddingVertical: PDSpacing.xs,
        borderRadius: 27.5,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
});

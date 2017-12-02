import * as React from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import ModalHeader from '~/components/headers/ModalHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { useThunkDispatch, useTypedSelector } from '~/redux/AppState';
import { saveNewPool } from '~/redux/selectedPool/Actions';
import { useCreatePool } from '~/screens/pool/editOrCreate/hooks/useCreatePool';
import { useEntryPool } from '~/screens/pool/editOrCreate/hooks/useEntryPool';
import { Haptic } from '~/services/HapticService';

import { useNavigation } from '@react-navigation/core';

import { MenuListItem } from '../../components/MenuListItem';
import { toPoolNoId } from '../shared';
import { ButtonWithChildren } from '~/components/buttons/ButtonWithChildren';
import { SVG } from '~/assets/images';
import { EditOrCreateSectionHeader } from '../EditOrCreateHeader';
import { CreateListHeader } from './CreateListHeader';

export const CreatePoolScreen: React.FC = () => {
    // are there performance implications to just returning the whole state from this?
    const { deviceSettings } = useTypedSelector(state => ({
        deviceSettings: state.deviceSettings,
    }));
    const createPoolSectionInfo = useCreatePool(deviceSettings);
    const dispatch = useThunkDispatch();
    const insets = useSafeArea();
    const theme = useTheme();

    const { pool, isRequiredFilledOut } = useEntryPool();
    const navigation = useNavigation();

    const handleCreatePoolPressed = () => {
        Haptic.heavy();

        const newPoolNotSaved = toPoolNoId(pool);
        if (newPoolNotSaved) {
            dispatch(saveNewPool(newPoolNotSaved));
            navigation.goBack();
        }
    };

    const getButtonComponent = () => {
        return (
            <ButtonWithChildren
                onPress={ handleCreatePoolPressed }
                styles={ [
                    { backgroundColor: isRequiredFilledOut ? theme.colors.blue : theme.colors.greyLight },
                    styles.buttonContainer,
                ] }>
                <SVG.IconPlayWhite height={ 21 } width={ 15 } style={ styles.buttonIcon } />
                <PDText type="subHeading" style={ { color: 'white' } }>Save Pool</PDText>
            </ButtonWithChildren>
            );
    };

    return (
        <PDSafeAreaView bgColor="greyLighter" forceInset={ { bottom: 'never', top: 'never' } }>
            <ModalHeader>Create Pool</ModalHeader>

            <SectionList
                sections={ createPoolSectionInfo }
                renderSectionHeader={ ({ section: { title } }) => {
                    if (title === 'header') {
                        return <CreateListHeader />;
                    } else {
                        return <EditOrCreateSectionHeader title={ title } />;
                    }
                } }
                renderItem={ ({ item, index, section }) => (
                    <MenuListItem
                        { ...item }
                        index={ index }
                        sectionLength={ section.data.length } />
                ) }
                keyExtractor={ (item, index) => item.id + index }
                stickySectionHeadersEnabled={ false }
                contentContainerStyle={ styles.listContent }
                style={ [styles.listContainer, { backgroundColor: theme.colors.background }] }
                initialNumToRender={ 50 }
            />
            { getButtonComponent() }
            <PDView style={ { paddingBottom: insets.bottom + PDSpacing.sm } } />
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: PDSpacing.md,
    },
    saveButton: {
        borderRadius: 27.5,
        paddingVertical: PDSpacing.xs,
        marginHorizontal: PDSpacing.lg,
    },
    text: {
        textAlign: 'center',
        color: 'white',
    },
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginHorizontal: PDSpacing.lg,
        justifyContent: 'center',
        marginTop: PDSpacing.xs,
        paddingTop: 9,
        paddingBottom: 9,
        borderRadius: 27.5,
    },
    buttonIcon: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginRight: PDSpacing.xs,
    },
});

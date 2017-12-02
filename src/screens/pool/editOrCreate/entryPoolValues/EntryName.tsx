import React, { useCallback, useState } from 'react';
import { KeyboardButton } from '~/components/buttons/KeyboardButton';
import BorderInputWithLabel from '~/components/inputs/BorderInputWithLabel';
import { PDStackNavigationProps } from '~/navigator/shared';

import { useNavigation } from '@react-navigation/native';

import { useEntryPool } from '../hooks/useEntryPool';

export const EntryName: React.FC = () => {
    const navigation = useNavigation<PDStackNavigationProps>();
    const { pool, setPool } = useEntryPool();
    const [name, setName] = useState(pool?.name);

    const keyboardAccessoryViewId = 'keyboardaccessoryidpooleditscreen1';

    const goBack = () => {
        navigation.goBack();
    };

    const handleOnPressSaveButton = () => {
        setPool({ name });
        goBack();
    };

    const handleTextChanged = useCallback((newName: string) => {
        setName(newName);
    }, []);

    const hasPoolNameChanged = name === pool?.name;

    return (
        <>
            <BorderInputWithLabel
                label="Name"
                placeholder="Aquaman's Pool"
                onChangeText={ handleTextChanged }
                autoFocus
                inputAccessoryViewID={ keyboardAccessoryViewId }
                value={ name }
                returnKeyType="done"
                onSubmitEditing={ handleOnPressSaveButton }
                enablesReturnKeyAutomatically
            />
            <KeyboardButton
                nativeID={ keyboardAccessoryViewId }
                onPress={ handleOnPressSaveButton }
                bgColor={ !hasPoolNameChanged ? 'blue' : 'greyLighter' }
                activeOpacity={ !hasPoolNameChanged ? 0 : 1 }
                hitSlop={ { top: 5, left: 5, bottom: 5, right: 5 } }
                disabled={ hasPoolNameChanged }>
                Save
            </KeyboardButton>
        </>
    );
};

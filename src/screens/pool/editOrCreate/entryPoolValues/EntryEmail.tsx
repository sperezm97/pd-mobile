import React, { useCallback, useState } from 'react';
import { KeyboardButton } from '~/components/buttons/KeyboardButton';
import BorderInputWithLabel from '~/components/inputs/BorderInputWithLabel';
import { PDStackNavigationProps } from '~/navigator/shared';

import { useNavigation } from '@react-navigation/native';

import { useEntryPool } from '../hooks/useEntryPool';

export const EntryEmail: React.FC = () => {
    const navigation = useNavigation<PDStackNavigationProps>();
    const { pool, setPool } = useEntryPool();
    const [email, setEmail] = useState(pool?.email ?? '');

    const keyboardAccessoryViewId = 'keyboardaccesoryentryemial';

    const goBack = () => {
        navigation.goBack();
    };

    const validateEmail = () => new RegExp(/^\S+@\S+\.\S+$/).test(email.trim());


    const handleOnPressSaveButton = () => {
        const hasValidateEmail = validateEmail();
        if (hasValidateEmail) {
            setPool({ email: email.trim() });
            goBack();
        }
    };

    const handleTextChanged = useCallback((newEmail: string) => {
        setEmail(newEmail);
    }, []);


    return (
        <>
            <BorderInputWithLabel
                label="Email"
                placeholder="johnsmith@gmail.com"
                onChangeText={ handleTextChanged }
                autoCapitalize="none"
                autoFocus
                inputAccessoryViewID={ keyboardAccessoryViewId }
                value={ email }
                returnKeyType="done"
                onSubmitEditing={ handleOnPressSaveButton }
                enablesReturnKeyAutomatically
                keyboardType="email-address"
            />
            <KeyboardButton
                nativeID={ keyboardAccessoryViewId }
                onPress={ handleOnPressSaveButton }
                bgColor={ validateEmail() ? 'blue' : 'greyLighter' }
                hitSlop={ { top: 5, left: 5, bottom: 5, right: 5 } }
                disabled={ !validateEmail() }>
                Save
            </KeyboardButton>
        </>
    );
};

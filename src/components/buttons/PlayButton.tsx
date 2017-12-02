import React from 'react';
import { StyleProp, StyleSheet, ViewStyle } from 'react-native';
import { SVG } from '~/assets/images';
import { Util } from '~/services/Util';
import { PDText } from '../PDText';
import { PDSpacing } from '../PDTheme';
import { ButtonWithChildren } from './ButtonWithChildren';

interface PlayButtonProps {
    title: string;
    onPress: () => void;
    buttonStyles?: StyleProp<ViewStyle>;
}

export const PlayButton: React.FC<PlayButtonProps> = (props) => {
    const buttonStyles = Util.excludeFalsy([styles.buttonContainer, props.buttonStyles]);
    return (
        <ButtonWithChildren onPress={ props.onPress } styles={ buttonStyles }>
            <SVG.IconPlayWhite height={ 21 } width={ 15 } style={ styles.buttonIcon } />
            <PDText type="subHeading" style={ { color: 'white' } }>{ props.title }</PDText>
        </ButtonWithChildren>);
};

const styles = StyleSheet.create({
    buttonContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: PDSpacing.sm,
        marginTop: PDSpacing.lg,
        backgroundColor: '#1E6BFF',
        justifyContent: 'center',
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

import * as React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { SVG } from '~/assets/images';
import { ButtonWithChildren } from '~/components/buttons/ButtonWithChildren';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';

import { PDView } from '~/components/PDView';
import { Config } from '~/services/Config/AppConfig';
import { Haptic } from '~/services/HapticService';
import { Util } from '~/services/Util';

export const ForumPrompt: React.FC = () => {
    const theme = useTheme();

    const handlePressedButton = () => {
        Haptic.light();
        Util.doAsync(() => {
            Linking.openURL(Config.forum_url);
        });
    };

    const buttonStyles = StyleSheet.flatten([
        styles.buttonContainer,
        { backgroundColor: theme.colors.blue },
    ]);

    return (
        <PDView style={ styles.container } bgColor="blurredBlue">
            <PDView style={ { flexDirection: 'row' } } >
                <SVG.IconFeedback width={ 24 } height={ 24 } style={ styles.feedbackIcon } />
                <PDText type="subHeading" color="black">
                    Have Feedback?
                </PDText>
            </PDView>
            <PDText type="content" color="greyDark" style={ styles.textContent }>
                I'd love to hear it. Tell me what the app is missing!
            </PDText>
            <ButtonWithChildren onPress={ handlePressedButton } styles={ buttonStyles }>
                <PDText type="subHeading" style={ styles.buttonText }>Open Forum</PDText>
                <SVG.IconRightArrow style={ styles.buttonIcon } width={ 22 } height={ 21 } />
            </ButtonWithChildren>
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 18,
        paddingHorizontal: PDSpacing.lg,
        paddingVertical: PDSpacing.md,
        marginTop: PDSpacing.lg,
    },
    feedbackIcon: {
        marginRight: PDSpacing.xs,
    },
    textContent: {
        marginVertical: PDSpacing.xs,
    },
    buttonContainer: {
        borderRadius: 27.5,
        paddingVertical: PDSpacing.xs,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
    },
    buttonIcon: {
        marginTop: 'auto',
        marginBottom: 'auto',
        marginLeft: 4,
    },
});

import React from 'react';
import { Linking, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { PDButton } from '~/components/buttons/PDButton';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { HR } from '~/components/Hr';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Config } from '~/services/Config/AppConfig';

export const SubscriptionScreen: React.FC = () => {
    const theme = useTheme();

    const handleTwitchPressed = async () => {
        Linking.openURL('https://www.twitch.tv/gazzini_time');
    };

    const handleGithubPressed = async () => {
        Linking.openURL('https://github.com/pooldash/pd-mobile');
    };

    const handleForumPressed = async () => {
        Linking.openURL(Config.forum_url);
    };

    return (
        <PDSafeAreaView bgColor="white" forceInset={ { bottom: 'never' } }>
            <ScreenHeader color="blue" textType="heading">
                Pooldash
            </ScreenHeader>
            <ScrollView style={ [styles.content, { backgroundColor: theme.colors.greyLighter } ] }>
                <PDView>
                    <PDText type="subHeading">
                        👋 Hi, I'm John!
                    </PDText>
                    <PDText type="bodyRegular" color="greyDark" numberOfLines={ 0 } style={ { marginTop: PDSpacing.xs } }>
                        I used to clean pools, and now I'm an engineer. Pooldash is free & open-source!
                    </PDText>
                </PDView>
                <HR />
                <PDText type="subHeading">
                    Build With Me
                </PDText>
                <PDText type="bodyRegular" color="greyDark" numberOfLines={ 0 } style={ { marginTop: PDSpacing.xs } }>
                    Want to help? Submit a pull-request:
                </PDText>
                <PDView style={ styles.buttonContainer }>
                    <PDButton onPress={ handleGithubPressed } bgColor="greyDarker">
                        Open Github
                    </PDButton>
                </PDView>
                <HR />
                <PDText type="subHeading">
                    Talk To Me
                </PDText>
                <PDText type="bodyRegular" color="greyDark" numberOfLines={ 0 } style={ { marginTop: PDSpacing.xs } }>
                    Or, just tell me what you want on the forum:
                </PDText>
                <PDView style={ styles.buttonContainer }>
                    <PDButton onPress={ handleForumPressed } bgColor="blue">
                        Open Forum
                    </PDButton>
                </PDView>
                <HR />
                <PDText type="subHeading">
                    Watch Me Work
                </PDText>
                <PDText type="bodyRegular" color="greyDark" numberOfLines={ 0 } style={ { marginTop: PDSpacing.xs } }>
                    Or, just watch me work on Twitch... sometimes:
                </PDText>
                <PDView style={ styles.buttonContainer }>
                    <PDButton onPress={ handleTwitchPressed } bgColor="blue">
                        Open Twitch
                    </PDButton>
                </PDView>
            </ScrollView>
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    content: {
        paddingHorizontal: PDSpacing.md,
        paddingTop: PDSpacing.lg,
    },
    buttonContainer: {
        marginTop: PDSpacing.lg,
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

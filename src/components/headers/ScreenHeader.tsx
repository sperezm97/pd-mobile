import * as React from 'react';
import { StyleSheet } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { SVG } from '~/assets/images';
import { PDText } from '~/components/PDText';
import { PDColor, PDSpacing, PDTextType, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Util } from '~/services/Util';

import { useNavigation } from '@react-navigation/native';

interface ScreenHeaderProps {
    hasBackButton?: boolean;
    hasAddButton?: boolean;
    hasEditButton?: boolean;
    hasBottomLine?: Boolean;
    hasHelpButton?: Boolean;
    handlePressedAdd?: () => void;
    handlePressedEdit?: () => void;
    handlePressedBack?: () => void;
    handlePressedHelp?: () => void;
    color?: PDColor;
    textType?: PDTextType;
}
export const ScreenHeader: React.FC<ScreenHeaderProps> = (props) => {
    const { goBack } = useNavigation();
    const {
        children,
        hasAddButton = false,
        hasEditButton = false,
        hasBottomLine = true,
        hasBackButton = true,
        hasHelpButton = false,
        handlePressedAdd,
        handlePressedEdit,
        handlePressedBack = () => {
            return;
        },
        handlePressedHelp,
        color = 'black',
        textType = 'subHeading',
    } = props;
    const theme = useTheme();

    const handleBackButtonPressed = () => {
        handlePressedBack();
        goBack();
    };

    const hitSlop = 5;

    const touchableProps = {
        activeScale: 0.97,
        hitSlop: { top: hitSlop, left: hitSlop, bottom: hitSlop, right: hitSlop },
    };

    const svgColor = theme.colors[color];
    const containerStyles = Util.excludeFalsy([styles.container, hasBottomLine && [styles.containerBottom, { borderBottomColor: theme.colors.border }]]);
    return (
        <PDView style={ containerStyles } bgColor="white">
            <PDView style={ styles.sideContainer }>
                {!!hasBackButton && (
                    <TouchableScale { ...touchableProps } onPress={ handleBackButtonPressed }>
                        <SVG.IconCircleBack height={ 32 } width={ 32 } fill={ svgColor } />
                    </TouchableScale>
                )}
            </PDView>
            <PDView style={ styles.centerContainer }>
                <PDText type={ textType } color="black" style={ styles.text }>
                    {children}
                </PDText>
            </PDView>
            <PDView style={ styles.sideContainer }>
                {!!hasAddButton && (
                    <TouchableScale { ...touchableProps } onPress={ handlePressedAdd }>
                        <SVG.IconCircleAdd height={ 32 } width={ 32 } fill={ svgColor } />
                    </TouchableScale>
                )}
                {!!hasEditButton && (
                    <TouchableScale { ...touchableProps } onPress={ handlePressedEdit }>
                        <SVG.IconCircleEdit height={ 32 } width={ 32 } fill={ svgColor } />
                    </TouchableScale>
                )}
                {!!hasHelpButton && (
                    <TouchableScale { ...touchableProps } onPress={ handlePressedHelp }>
                        <SVG.IconOther height={ 32 } width={ 32 } fill={ svgColor } />
                    </TouchableScale>
                )}
            </PDView>
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: PDSpacing.md,
        maxHeight: 80,
    },
    containerBottom: {
        borderBottomColor: '#EDEDED',
        borderBottomWidth: 2,
    },
    sideContainer: {
        flexShrink: 1,
        minWidth: 32,
    },
    centerContainer: {
        flexGrow: 2,
    },
    text: {
        textAlign: 'center',
    },
});

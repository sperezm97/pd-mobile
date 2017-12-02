import React from 'react';
import { StyleSheet } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { SVG } from '~/assets/images';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Haptic } from '~/services/HapticService';

type ChipIcon = 'play' | 'levels';

interface ChipButtonProps {
    onPress: () => void;
    title: string;
    icon: ChipIcon;
}

export const ChipButton: React.FC<ChipButtonProps> = (props) => {
    const theme = useTheme();

    const handlePressed = () => {
        Haptic.medium();
        props.onPress();
    };

    const backgroundColor = theme.colors.blurredBlue;
    const foregroundColor = theme.colors.blue;

    let icon = <SVG.IconPlay width={ 15 } height={ 15 } fill={ foregroundColor } />;
    if (props.icon === 'levels') {
        icon = <SVG.IconLevels height={ 21 } width={ 16 } />;
    }

    return (
        <TouchableScale onPress={ handlePressed } activeScale={ 0.95 } style={ { marginRight: 'auto' } } hitSlop={ { top: 5, bottom: 5, left: 5, right: 5 } }>
            <PDView style={ [styles.container, { backgroundColor, borderColor: `${foregroundColor}33` }] }>
                <PDView style={ { marginLeft: 4, marginRight: 8 } }>
                    { icon }
                </PDView>
                    <PDText type="buttonSmall" color={ 'blue' } numberOfLines={ 2 }>
                        { props.title }
                    </PDText>
            </PDView>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        paddingLeft: PDSpacing.xs,
        paddingRight: PDSpacing.sm,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 48,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
        marginRight: 'auto',
    },
});

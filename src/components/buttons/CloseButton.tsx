import * as React from 'react';
import { Image, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';

import { images } from '~/assets/images';
import { PDColorPalette, useTheme } from '../PDTheme';

interface CloseButtonProps {
    onPress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    backIconColor?: keyof PDColorPalette
}

export const CloseButton: React.FunctionComponent<CloseButtonProps> = (props) => {
    const theme = useTheme();
    const { onPress, containerStyle, backIconColor = 'blue'  } = props;
    return (
        <View style={ containerStyle }>
            <TouchableScale style={ styles.innerContainer } activeScale={ 0.97 } onPress={ onPress }>
                <Image style={ [styles.image, { tintColor: theme.colors[backIconColor] } ] } source={ images.closeBlue } width={ 32 } height={ 32 } />
            </TouchableScale>
        </View>
    );
};

const styles = StyleSheet.create({
    innerContainer: {
        flexDirection: 'row',
    },
    image: {
        marginHorizontal: 8,
        marginBottom: 8,
    },
});

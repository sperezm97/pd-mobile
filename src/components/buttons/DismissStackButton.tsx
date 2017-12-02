import * as React from 'react';
import { Image, StyleSheet, View } from 'react-native';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';

import { images } from '~/assets/images';

export interface DismissStackButtonProps {
    handleBackPressed: () => void;
}

export const DismissStackButton: React.FunctionComponent<DismissStackButtonProps> = (props) => {
    return (
        <View style={ styles.container }>
            <TouchableScale activeScale={ 0.97 } onPress={ props.handleBackPressed }>
                <Image style={ styles.backButtonImage } source={ images.closeIcon } width={ 21 } height={ 21 } />
            </TouchableScale>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // backgroundColor: 'pink',
    },
    backButtonImage: {},
});

import * as React from 'react';
import { PickerItem } from './PickerItem';
import { PDText } from '~/components/PDText';
// @ts-ignore
import TouchableScale from 'react-native-touchable-scale';
import { StyleSheet  } from 'react-native';
import { Haptic } from '~/services/HapticService';
import { PDView } from '~/components/PDView';
import { RouteProp, useRoute } from '@react-navigation/native';
import { PDNavParams } from '~/navigator/shared';

interface PickerRowProps {
    item: PickerItem;
    onSelect: (value: string) => void;
    isSelected: Boolean;
}

export const PickerRow: React.FunctionComponent<PickerRowProps> = (props: PickerRowProps) => {
    const { params } = useRoute<RouteProp<PDNavParams, 'PickerScreen'>>();
    const { color } = params;

    const handleSelection = () => {
        Haptic.selection();
        props.onSelect(props.item.value);
    };

    return (
        <TouchableScale onPress={ handleSelection } activeScale={ 0.99 }>
            <PDView bgColor={ props.isSelected ? color : 'greyLightest' } style={ styles.container }>
                <PDText type="heading" color={ props.isSelected ? 'white' : 'black' } style={ styles.text }>
                    {props.item.name}
                </PDText>
            </PDView>
        </TouchableScale>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: 24,
        marginHorizontal: 12,
        marginVertical: 6,
    },
    text: {
        fontSize: 22,
        marginVertical: 12,
        marginHorizontal: 24,
        fontWeight: '600',
    },
});

import * as React from 'react';
import {
    Pressable, PressableStateCallbackType, StyleProp, StyleSheet, ViewStyle,
} from 'react-native';
import { SVG } from '~/assets/images';
import { AV, useStandardListAnimation } from '~/components/animation/AnimationHelpers';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { Util } from '~/services/Util';

import { EditPoolListItem } from '../editOrCreate/edit/EditPoolHelpers';

export interface MenuListItemProps extends EditPoolListItem {
    index: number;
    sectionLength: number;
    toggleVisible?: () => void;
}
export const MenuListItem: React.FC<MenuListItemProps> = (props) => {
    const theme = useTheme();
    const a = useStandardListAnimation(props.animationIndex, 'fast');

    const firstItem = props.index === 0 && { borderTopLeftRadius: 14, borderTopRightRadius: 14 };
    const lastItem =  props.index === props.sectionLength - 1 && { borderBottomLeftRadius: 14, borderBottomRightRadius: 14 };

    const getWrapperStyles = ({ pressed }: PressableStateCallbackType): StyleProp<ViewStyle> => [
        { backgroundColor: pressed ? theme.colors.greyLight : theme.colors.white },
        ...Util.excludeFalsy([firstItem, lastItem]),
    ];

    const colorLabel = props.id === 'deletePool' ? 'red' : 'black';
    const Icon = SVG[props.image];

    return (
        <AV y={ a.containerY } opacity={ a.opacity }>
            <Pressable
                onPress={ props.onPress }
                style={ getWrapperStyles }>
                <PDView style={ styles.container }>
                    <PDView style={ styles.icon }>
                        <Icon width={ 32 } height={ 32 } />
                    </PDView>
                    <PDText color={ colorLabel } type="bodySemiBold" style={ { textAlign: 'center' } }>
                        {props.label}
                    </PDText>
                    <PDText color={ props.valueColor } type="bodySemiBold" style={ styles.value }>
                        {props.value}
                    </PDText>
                    <SVG.IconChevronForward width={ 16 } height={ 16 } style={ styles.arrow }/>
                </PDView>
            </Pressable>
        </AV>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 8,
    },
    icon: {
        marginRight: 8,
    },
    value: {
        flexShrink: 1,
        marginLeft: PDSpacing.xs,
    },
    arrow: {
        marginLeft: 'auto',
    },
});

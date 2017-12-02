import React from 'react';
import { StyleSheet } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { useDispatch } from 'react-redux';
import { SVG } from '~/assets/images';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDText } from '~/components/PDText';
import { PDColor, PDSpacing } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { useContrastStatusBar } from '~/hooks/useStatusBar';
import { PDRootNavigatorParams } from '~/navigator/PDRootNavigator';
import { PDStackNavigationProps } from '~/navigator/shared';
import { updatePopoverValue } from '~/redux/popover/Actions';

import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';

type Item = { name: string; value: string };
export interface PopoverRouteProps {
    title: string;
    description?: string;
    color: PDColor;
    items?: Item[];
    prevSelection?: string;
    popoverKey?: string;
}

export const PopoverScreen = () => {
    useContrastStatusBar();
    const dispatch = useDispatch();
    const { goBack } = useNavigation<PDStackNavigationProps>();

    const route = useRoute<RouteProp<PDRootNavigatorParams, 'PopoverScreen'>>();
    const { color, title, description, items, prevSelection } = route.params;

    const handleItemPressed = (item: Item) => {
        dispatch(updatePopoverValue(item.value));
        goBack();
    };


    const renderItem = (item: Item) => {
        return (
            <TouchableScale key={ item.value } onPress={ () => handleItemPressed(item) }>
                <PDView
                    bgColor={ prevSelection === item.value ? color : 'greyLight' }
                    style={ styles.itemContainer }>
                    <PDText type="bodySemiBold" color={ 'black'  }>
                        {item.name}
                    </PDText>
                    {prevSelection === item.value && <SVG.IconCircleCheckmark fill={ color } />}
                </PDView>
            </TouchableScale>
        );
    };

    return (
        <PDSafeAreaView bgColor="background" forceInset={ { bottom: 'never' } }>
            <ScreenHeader textType="subHeading" color={ color } hasBackButton hasBottomLine={ false }>
                {title}
            </ScreenHeader>
            <PDView style={ styles.descriptionContainer }>
                {!!description && (
                    <PDText type="bodyMedium" color="greyDark" textAlign="center" numberOfLines={ 3 }>
                        {description}
                    </PDText>
                )}
            </PDView>
            <PDView style={ styles.content }>{items?.map(renderItem)}</PDView>
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    descriptionContainer: {
        paddingTop: PDSpacing.lg,
        paddingBottom: PDSpacing.md,
        paddingHorizontal: PDSpacing.lg,
    },
    content: {
        paddingVertical: PDSpacing.lg,
        paddingHorizontal: PDSpacing.lg,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: PDSpacing.lg,
        paddingVertical: PDSpacing.md,
        borderRadius: 27.5,
        marginBottom: PDSpacing.xs,
    },
});

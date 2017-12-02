import React from 'react';
import { ListRenderItem, StyleSheet } from 'react-native';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { SVG } from '~/assets/images';
import { ScreenHeader } from '~/components/headers/ScreenHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { PDStackNavigationProps } from '~/navigator/shared';

import { useNavigation } from '@react-navigation/core';

import { Shape, ShapeId, shapes } from './VolumeEstimatorHelpers';

const SelectShapeScreen: React.FC = () => {
    const navigation = useNavigation<PDStackNavigationProps>();
    const theme = useTheme();

    const handlePressedShape = (shapeId: ShapeId) => {
        navigation.push('EntryShape', { shapeId });
    };

    const renderItem: ListRenderItem<Shape> = ({ item }) => {

        const Icon = SVG[item.icon];
        return (
            <TouchableOpacity style={ [styles.itemContainer, { backgroundColor: theme.colors.greyLighter }] } onPress={ () => handlePressedShape(item.id) }>
                <PDView  style={ styles.itemInnerContainer }>
                    <Icon width={ 32 } height={ 32 } />
                    <PDView style={ styles.itemTextContainer }>
                        <PDText type={ 'default' } color="black" style={ styles.itemLabelText }>
                            {item.label}
                        </PDText>
                    </PDView>
                </PDView>
                <SVG.IconForward fill={ theme.colors.grey } width={ 18 } height={ 18 } />
            </TouchableOpacity>
        );
    };

    const HeaderList = () => {
        return (
            <PDText type="bodyBold" color="greyDark" style={ styles.headerText }>
                Choose pool Shape
            </PDText>
        );
    };

    return (
        <PDSafeAreaView forceInset={ { bottom: 'never' } }>
            <ScreenHeader textType="subHeading" hasBottomLine={ false }>Volume Estimator</ScreenHeader>
            <PDView bgColor="white" style={ styles.content }>
                <PDView>
                    <PDText type="bodyRegular" color="greyDark" style={ styles.description } numberOfLines={ 2 }>
                        Let’s approximate the volume of the pool
                    </PDText>
                </PDView>
                <FlatList
                    data={ shapes }
                    renderItem={ renderItem }
                    keyExtractor={ (item) => item.id }
                    ListHeaderComponent={ HeaderList }
                    ListHeaderComponentStyle={ styles.headerContainer }
                />
            </PDView>
        </PDSafeAreaView>
    );
};

export default SelectShapeScreen;

const styles = StyleSheet.create({
    content: {
        flex:1,
        paddingTop: PDSpacing.lg,
        paddingHorizontal: PDSpacing.lg,
    },
    headerText: {
        textTransform: 'uppercase',
        textAlign: 'left',
        lineHeight: 21,
        letterSpacing: 0.5,
        marginTop: PDSpacing.lg,
    },
    headerContainer: {
        marginTop: PDSpacing.sm,
        marginBottom: PDSpacing.sm,
    },
    description: {
        textAlign: 'center',
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 14,
        marginBottom: PDSpacing.sm,
        padding: PDSpacing.sm,
    },
    itemLabelText: {
        fontSize: 16,
        fontFamily: 'Poppins-SemiBold',
        lineHeight: 24,
        textAlign: 'left',
        textAlignVertical: 'center',
    },
    itemInnerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemTextContainer: {
        marginLeft: PDSpacing.xs,
    },
});

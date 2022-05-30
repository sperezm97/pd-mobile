import React from 'react';
import { StyleSheet } from 'react-native';
import TouchableScale from 'react-native-touchable-scale';
import { useDispatch } from 'react-redux';
import { SVG } from '~/assets/images';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { PDStackNavigationProps } from '~/navigator/shared';
import { clearPool } from '~/redux/selectedPool/Actions';
import { useNavigation } from '@react-navigation/native';

interface SearchHeaderProps {
    numPools: number;
    searchText?: string;
}

export const SearchHeader: React.FC<SearchHeaderProps> = (props) => {
    const { navigate } = useNavigation<PDStackNavigationProps>();
    const dispatch = useDispatch();
    const theme = useTheme();

    const handleAddButtonPressed = () => {
        dispatch(clearPool());
        navigate('EditPoolNavigator');
    };

    const handleSettingButtonPressed = () => {
        navigate('Settings');
    };

    const shouldShowSearch = !!((props.numPools > 0) || (props.searchText));
    const searchBar = shouldShowSearch && (
        <PDView style={ styles.containerSearch }>
            {props.children}
        </PDView>
    );

    return (
        <PDView bgColor="white" style={ [styles.containerBottom, {  borderBottomColor: theme.colors.border }] }>
            <PDView  style={ styles.container  }>
                <PDView style={ styles.sideContainer }>
                    <TouchableScale  onPress={ handleSettingButtonPressed } hitSlop={ { top: 7, bottom: 7, left: 7, right: 7 } }>
                        <SVG.IconSettings height={ 32 } width={ 32 } fill={ theme.colors.blue } />
                    </TouchableScale>
                </PDView>
                <PDView style={ styles.centerContainer }>
                    <PDText type={ 'heading' } color="black" textAlign="center">
                        My Pools
                    </PDText>
                </PDView>
                <PDView style={ styles.sideContainer }>
                    <TouchableScale onPress={ handleAddButtonPressed } hitSlop={ { top: 7, bottom: 7, left: 7, right: 7 } }>
                        <SVG.IconCircleAdd height={ 32 } width={ 32 } fill={ theme.colors.blue } />
                    </TouchableScale>
                </PDView>
            </PDView>
            {searchBar}
        </PDView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: PDSpacing.md,
    },
    containerSearch: {
        marginHorizontal: PDSpacing.md,
        marginBottom: PDSpacing.md,
    },
    containerBottom: {
        borderBottomWidth: 2,
    },
    sideContainer: {
        flexShrink: 1,
        minWidth: 32,
    },
    centerContainer: {
        flexGrow: 2,
    },
});

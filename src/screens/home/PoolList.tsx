import React from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { PDText } from '~/components/PDText';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { IPool, Pool } from '~/models/Pool';
import { PoolListFooterUpgrade } from './footer/PoolListFooterUpgrade';
import { PoolListItem } from './PoolListItem';

export interface PoolListProps {
    pools: IPool[];
    handlePoolPressed: (p: IPool) => void;
    handleEnterReadingsPressed: (p: IPool) => void;
    searchText: string;
    handleSeeAllPressed: () => void;
    handleUpgradePressed: () => void;
}

export const PoolList: React.FC<PoolListProps> = (props) => {
    const {
        pools,
        handlePoolPressed,
        handleEnterReadingsPressed,
        searchText,
        handleSeeAllPressed,
        handleUpgradePressed,
    } = props;

    const theme = useTheme();

    return (
        <FlatList
            style={ {  backgroundColor:theme.colors.background  } }
            contentContainerStyle={ styles.content }
            keyExtractor={ (item: Pool, index: number) => item.objectId + index }
            keyboardShouldPersistTaps={ 'handled' }
            keyboardDismissMode={ 'interactive' }
            data={ pools }
            renderItem={ ({ item, index }) => <PoolListItem
                pool={ item }
                index={ index }
                handleEnterReadingsPressed={ handleEnterReadingsPressed }
                handlePoolPressed={ handlePoolPressed }/>
            }
            ListFooterComponent={ () => {
                if (pools.length === 0 && searchText) {
                    return (
                        <TouchableOpacity onPress={ handleSeeAllPressed } hitSlop={ { left: 5, top: 5, right: 5, bottom: 5 } }>
                            <PDText type="bodySemiBold" color="blue" textAlign="center" style={ { textDecorationLine: 'underline' } }>See all pools</PDText>
                        </TouchableOpacity>
                    );
                }
                if (pools.length > 0) {
                    return <PoolListFooterUpgrade pressedUpgrade={ handleUpgradePressed } numPools={ pools.length } />;
                }
                return null;
            } }
            ListEmptyComponent={ () => {
                // if we're searching:
                if (searchText) {
                    return (
                        <PDView>
                            <PDText style={ styles.emptyText } textAlign="center">🤷‍♂️🤷‍♀️</PDText>
                        </PDView>
                    );
                }
                return null;
            } }
        />
    );
};

const styles = StyleSheet.create({
    content: {
        marginHorizontal: PDSpacing.sm,
        marginTop: PDSpacing.sm,
    },
    emptyText: {
        fontSize: 72,
    },
});

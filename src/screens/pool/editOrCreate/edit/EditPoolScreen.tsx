import * as React from 'react';
import { SectionList, StyleSheet } from 'react-native';
import { useSafeArea } from 'react-native-safe-area-context';
import ModalHeader from '~/components/headers/ModalHeader';
import { PDSafeAreaView } from '~/components/PDSafeAreaView';
import { PDSpacing, useTheme } from '~/components/PDTheme';
import { PDView } from '~/components/PDView';
import { useModal } from '~/hooks/useModal';
import { useThunkDispatch } from '~/redux/AppState';
import { updatePool } from '~/redux/selectedPool/Actions';
import { MenuListItem } from '~/screens/pool/components/MenuListItem';
import { useEditPool } from '~/screens/pool/editOrCreate/hooks/useEditPool';
import { EditOrCreateSectionHeader } from '../EditOrCreateHeader';

import { useEntryPool } from '../hooks/useEntryPool';
import { toPool } from '../shared';
import { DeletePool } from './components/DeletePool';

export const EditPoolScreen: React.FunctionComponent = () => {
    const { visible, toggleVisible } = useModal();
    const { pool } = useEntryPool();
    const dispatchThunk = useThunkDispatch();
    const editPoolSectionInfo = useEditPool(pool, toggleVisible);
    const insets = useSafeArea();
    const theme = useTheme();

    /// Whenever the pool context changes, persist them in the db:
    React.useEffect(() => {
        const updatedPool = toPool(pool);
        if (updatedPool) {
            dispatchThunk(updatePool(updatedPool));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pool]);

    return (
        <PDSafeAreaView bgColor="white" forceInset={ { bottom: 'never' } }>
            <ModalHeader>Edit Pool</ModalHeader>
            <SectionList
                sections={ editPoolSectionInfo }
                renderSectionHeader={ ({ section: { title } }) =>
                    <EditOrCreateSectionHeader title={ title } />
                }
                renderItem={ ({ item, index, section }) => (
                    <MenuListItem
                        { ...item }
                        index={ index }
                        sectionLength={ section.data.length }
                        toggleVisible={ toggleVisible }
                    />
                ) }
                keyExtractor={ (item, index) => item.id + index }
                stickySectionHeadersEnabled={ false }
                contentContainerStyle={ styles.listContent }
                style={ [styles.listContainer, { backgroundColor: theme.colors.background }] }
                contentInset={ { bottom: insets.bottom } }
                initialNumToRender={ 50 }
            />
            <PDView>
                <DeletePool visible={ visible } toggleVisible={ toggleVisible } />
            </PDView>
        </PDSafeAreaView>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    listContent: {
        paddingHorizontal: PDSpacing.md,
    },
    sectionHeaderText: {
        marginBottom:  PDSpacing.md,
        marginTop:  PDSpacing.lg,
        textTransform: 'uppercase',
    },
});

import { useTypedSelector } from '~/redux/AppState';
import { PartialPoolWithId, useEntryPool } from '../pool/editOrCreate/hooks/useEntryPool';

export const usePoolFromAmbiguousSource = (): PartialPoolWithId => {
    // TODO: find a better way to resolve the active swimming pool, this is ridiculous.
    // This screen can be displayed within a PoolProvider (on edit/create screens)
    // or without one (from the PoolDetails screen). The latter case relies on redux.
    // Also, the edit case (but not the create case) can safely rely on redux.
    const reduxPool = useTypedSelector(state => state.selectedPool);
    const contextPool = useEntryPool().pool;
    return reduxPool ?? contextPool;
};

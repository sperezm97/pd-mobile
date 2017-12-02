import { useRealmPoolsHook } from '~/hooks/RealmPoolHook';
import { IPool } from '~/models/Pool';

export const usePoolSearch = (rawSearchInput: string): IPool[] => {
    const pools = useRealmPoolsHook();
    const cleanedUserInput = rawSearchInput.trim().toLowerCase();
    const searchedPools = pools.filter(p => p.name.toLowerCase().includes(cleanedUserInput));
    return rawSearchInput.length > 0 ? searchedPools : pools;
};

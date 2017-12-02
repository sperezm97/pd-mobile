import { useEffect, useState } from 'react';
import { Config } from '~/services/Config/AppConfig';
import { PDMigrator } from '~/services/migrator/NativeModule';

/// Returns the total number of pools from pool doctor.
export const useImportablePools = (): number => {
    const [totalPools, setTotalPools] = useState(0);

    useEffect(() => {
        const asyncStuff = async () => {
            if (Config.isIos) {
                const result = await PDMigrator.countPools();
                setTotalPools(result);
            }
        };
        asyncStuff();
    }, []);

    return totalPools;
};

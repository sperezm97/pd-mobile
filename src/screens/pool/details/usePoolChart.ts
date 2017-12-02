import { useEffect, useState } from 'react';
import { useRealmPoolHistoryHook } from '~/hooks/RealmPoolHook';
import { useTypedSelector } from '~/redux/AppState';
import { ChartService } from '~/services/ChartService';
import { DS } from '~/services/DSUtil';

export const usePoolChart = () => {
    const selectedPool = useTypedSelector((state) => state.selectedPool);
    const deviceSettings = useTypedSelector((state) => state.deviceSettings);
    const isUnlocked = DS.isSubscriptionValid(deviceSettings, Date.now());
    const history = useRealmPoolHistoryHook(selectedPool?.objectId ?? null);

    const [chartData, setChartData] = useState(ChartService.loadFakeData(isUnlocked));


    useEffect(() => {
        if (!selectedPool) {
            return;
        }

        let chosen = ChartService.loadFakeData(isUnlocked);

        const allData = ChartService.loadChartData('1M', selectedPool, isUnlocked);
        const filtered = allData.filter((x) => x.values.length >= 2);
        if (filtered.length > 0) {
            chosen = {
                ...filtered[0],
                interactive: false,
            };
        }
        setChartData(chosen);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isUnlocked, history]);


    return chartData;
};

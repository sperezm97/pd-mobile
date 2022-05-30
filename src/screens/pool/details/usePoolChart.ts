import { useEffect, useState } from 'react';
import { useRealmPoolHistoryHook } from '~/hooks/RealmPoolHook';
import { useTypedSelector } from '~/redux/AppState';
import { ChartService } from '~/services/ChartService';

export const usePoolChart = () => {
    const selectedPool = useTypedSelector((state) => state.selectedPool);
    const history = useRealmPoolHistoryHook(selectedPool?.objectId ?? null);

    const [chartData, setChartData] = useState(ChartService.loadFakeData());


    useEffect(() => {
        if (!selectedPool) {
            return;
        }

        let chosen = ChartService.loadFakeData();

        const allData = ChartService.loadChartData('1M', selectedPool);
        const filtered = allData.filter((x) => x.values.length >= 2);
        if (filtered.length > 0) {
            chosen = {
                ...filtered[0],
                interactive: false,
            };
        }
        setChartData(chosen);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [history]);


    return chartData;
};

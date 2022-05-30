import { ChartCardViewModel } from '~/components/charts/ChartCardViewModel';
import { DateRange } from '~/components/DateRangeSelector';
import { Database } from '~/repository/Database';
import { Pool } from '~/models/Pool';

export class ChartService {
    static loadChartData = (dateRange: DateRange, pool: Pool): ChartCardViewModel[] => {
        const msInRange = ChartService.msInDateRange(dateRange);
        const since_ts = msInRange ? Date.now() - msInRange : null;
        const data = Database.loadLogEntriesForPool(pool.objectId, since_ts, false);
        const entries = data === undefined ? [] : data.map((le) => le);

        interface Graphable {
            title: string;
            id: string;
            idealMin: number | null;
            idealMax: number | null;
        }
        // get all different readings & treatments
        let idsToGraph: Graphable[] = [];
        entries.forEach((entry) => {
            entry.readingEntries.forEach((reading) => {
                const graphable: Graphable = {
                    title: reading.readingName,
                    id: reading.var,
                    idealMin: reading.idealMin || null,
                    idealMax: reading.idealMax || null,
                };
                if (
                    idsToGraph.filter((g) => {
                        return g.title === graphable.title && g.id === graphable.id;
                    }).length === 0
                ) {
                    idsToGraph.push(graphable);
                } else {
                    // update the ideal range:
                    const i = idsToGraph.findIndex((g) => {
                        return g.title === graphable.title && g.id === graphable.id;
                    });
                    idsToGraph[i].idealMin = reading.idealMin || null;
                    idsToGraph[i].idealMax = reading.idealMax || null;
                }
            });
            entry.treatmentEntries.forEach((treatment) => {
                const graphable: Graphable = {
                    title: treatment.treatmentName,
                    id: treatment.var,
                    idealMin: null,
                    idealMax: null,
                };
                if (
                    idsToGraph.filter((g) => {
                        return g.title === graphable.title && g.id === graphable.id;
                    }).length === 0
                ) {
                    idsToGraph.push(graphable);
                }
            });
        });

        // get a chartcardviewmodel for each
        return idsToGraph.map((graphable) => {
            let dates: number[] = [];
            let values: number[] = [];
            entries.forEach((entry) => {
                entry.readingEntries.forEach((reading) => {
                    if (reading.var === graphable.id) {
                        dates.push(entry.userTS);
                        values.push(reading.value);
                    }
                });
                entry.treatmentEntries.forEach((treatment) => {
                    if (treatment.var === graphable.id) {
                        dates.push(entry.userTS);
                        values.push(treatment.ounces);
                    }
                });
            });
            return {
                title: graphable.title,
                masterId: graphable.id,
                values: values,
                timestamps: dates,
                interactive: true,
                idealMin: graphable.idealMin,
                idealMax: graphable.idealMax,
            };
        });
    };

    static loadFakeData = (): ChartCardViewModel => {
        const timestamps = [4, 5, 6]; // TODO: remove
        const values = [3, 5, 4];
        const vm: ChartCardViewModel = {
            timestamps,
            values,
            title: '',
            masterId: 'a9sd8f093',
            interactive: false,
            idealMin: 3,
            idealMax: 4,
        };
        return vm;
    };

    private static msInDateRange = (dr: DateRange): number | null => {
        switch (dr) {
            case '24H':
                return 24 * 60 * 60 * 1000;
            case '7D':
                return 7 * 24 * 60 * 60 * 1000;
            case '1M':
                return 31 * 24 * 60 * 60 * 1000;
            case '3M':
                return 92 * 24 * 60 * 60 * 1000;
            case '1Y':
                return 365 * 24 * 60 * 60 * 1000;
            case 'ALL':
                return null;
        }
    };
}

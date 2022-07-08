import { useEffect, useState } from 'react';
import { Treatment } from '~/formulas/models/Treatment';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { ScoopService } from '~/services/ScoopService';

export const useFetchAllTreatments = (): Treatment[] => {
    const [treaments, setTreatments] = useState<Treatment[]>([]);
    const { ds } = useDeviceSettings();

    useEffect(() => {
        (async () => {
            let rawTreatments = await ScoopService.getAllTreatments();
            rawTreatments = rawTreatments.filter((t) => {
                return ds.scoops.findIndex((s) => s.var === t.id) < 0;
            });

            setTreatments(rawTreatments);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return treaments;
};

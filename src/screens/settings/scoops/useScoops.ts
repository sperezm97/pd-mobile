import { useEffect, useState } from 'react';
import { Treatment } from '~/models/recipe/Treatment';
import { useDeviceSettings } from '~/services/DeviceSettings/Hooks';
import { ScoopService } from '~/services/ScoopService';

export const useFetchAllTreatments = (): Treatment[] => {
    const [treaments, setTreatments] = useState<Treatment[]>([]);
    const { ds } = useDeviceSettings();

    useEffect(() => {
        (async () => {
            let rawTreatments = await ScoopService.getAllTreatments();
            console.log(rawTreatments);
            rawTreatments = rawTreatments.filter((t) => {
                return ds.scoops.findIndex((s) => s.var === t.var) < 0;
            });

            setTreatments(rawTreatments);
        })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return treaments;
};

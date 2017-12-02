import { LogEntry } from '~/models/logs/LogEntry';
import { ReadingEntry } from '~/models/logs/ReadingEntry';
import { TreatmentEntry } from '~/models/logs/TreatmentEntry';
import { IPool } from '~/models/Pool';
import { WaterTypeValue } from '~/models/Pool/WaterType';
import { Reading } from '~/models/recipe/Reading';
import { TreatmentType } from '~/models/recipe/Treatment';
import { Database } from '~/repository/Database';
import { Config } from '../Config/AppConfig';
import { RealmUtil } from '../RealmUtil';
import { RecipeService } from '../RecipeService';
import { Util } from '../Util';

type PoolStatus = 'created' | 'skipped' | 'error';
interface PoolDoctorImportStats {
    poolStatus: PoolStatus;
    logsCreated: number;
    logsSkipped: number;
}

export namespace PoolDoctorImportService {
    export const importPool = async (poolDoctorPool: PoolDoctorPool): Promise<PoolDoctorImportStats> => {
        const p = mapPoolDoctorPoolToPoolDashPool(poolDoctorPool);
        let poolStatus: PoolStatus = 'error';
        let logsCreated = 0;
        let logsSkipped = 0;

        if (!p.poolDoctorId) {
            console.warn('Tried to save non-imported pool -- this method is only intended for Pool Doctor pools');
            return {
                poolStatus,
                logsCreated: 0,
                logsSkipped: 0,
            };
        }
        const matchingPools = await Database.loadPools(`poolDoctorId = "${p.poolDoctorId}"`);
        const existingPool = Util.firstOrNull(RealmUtil.poolsToPojo(matchingPools));

        if (existingPool) {
            poolStatus = 'skipped';
            p.objectId = existingPool.objectId;
        } else {
            await Database.saveNewPool(p);
            poolStatus = 'created';
        }

        for (let l of poolDoctorPool.logs) {
            const le = mapPoolDoctorLogEntryToPoolDashLogEntry(l, p.objectId);

            const isLogEntryAlreadyImported = await Database.doesLogEntryExist(p.objectId, le.poolDoctorId ?? l.created_at);
            if (isLogEntryAlreadyImported) {
                logsSkipped += 1;
            } else {
                await Database.saveNewLogEntry(le);
                logsCreated += 1;
            }
        }

        return { poolStatus, logsCreated, logsSkipped };
    };

    export const deleteAllPoolDoctorPools = async () => {
        await Database.deletePoolsWithPoolDoctorId();
    };

    const mapPoolDoctorPoolToPoolDashPool = (doctorPool: PoolDoctorPool): IPool => {
        const gallons = doctorPool.isGallons
            ? doctorPool.volume
            : doctorPool.volume * 0.264172;

        let waterType: WaterTypeValue = 'chlorine';
        if (doctorPool.type === 1) {
            waterType = 'salt_water';
        } else if (doctorPool.type === 2) {
            waterType = 'bromine';
        }

        return {
            objectId: Util.generateUUID(),
            name: doctorPool.name,
            gallons,
            wallType: 'plaster',
            waterType,
            recipeKey: RecipeService.getFormulaKeyForWaterType(waterType),
            poolDoctorId: doctorPool.modified_at,       // We actually didn't use an id at all, I'm thankful this is here.
        };
    };

    const mapPoolDoctorLogEntryToPoolDashLogEntry = (log: PoolDoctorLog, poolId: string): LogEntry => {

        const ts = Util.timestampFromString(log.created_at);
        return LogEntry.make(
            Util.generateUUID(),
            poolId,
            ts,
            ts,
            null,
            log.readings.map(mapPoolDoctorReadingEntryToPoolDashReadingEntry),
            // Exclude treatments with units that have a value of 0 or less.
            log.treatments.map(mapPoolDoctorTreatmentEntryToPoolDashTreatmentEntry).filter(te => !(!!te.displayUnits && te.ounces <= 0)),
            Config.poolDoctorFormulaKey,
            'Pool Doctor (old)',
            log.notes,
            log.created_at
        );
    };

    const mapPoolDoctorReadingEntryToPoolDashReadingEntry = (old: PoolDoctorReadingEntry): ReadingEntry => {
        const nameToVarMap = {
            'Total Alkalinity': 'ta',
            'pH': 'ph',
            'Ion Levels': 'ion',
            'Calcium Hardness': 'ch',
            'Stabilizer': 'cya',
            'Salt': 'NaCl',
            'TDS': 'tds',
            'Temperature (F)': 'tempf',
            'Temperature (C)': 'tempc',
            'Total Chlorine': 'tc',
            'Bromine': 'bro',
        };

        const fakeReadingForSaving: Reading = {
            name: old.name,
            var: nameToVarMap[old.name] ?? old.name,
            type: 'number',
            units: old.units ?? null,
            defaultValue: 0,
            sliderMax: 0,
            sliderMin: 0,
            decimalPlaces: 1,
            isDefaultOn: true,
            idealMax: null,
            idealMin: null,
            offsetReadingVar: null,
        };

        return ReadingEntry.make(
            fakeReadingForSaving,
            old.value,
        );
    };

    const mapPoolDoctorTreatmentEntryToPoolDashTreatmentEntry = (old: PoolDoctorTreatmentEntry): TreatmentEntry => {
        let type: TreatmentType = 'dryChemical';
        if (old.units === 'gallons' || old.units === 'liters' || old.units === 'milliliters') {
            type = 'liquidChemical';
        }

        let ounces = old.amount;
        if (old.units === 'gallons') {
            ounces *= 128;
        } else if (old.units === 'liters') {
            ounces *= 33.814;
        } else if (old.units === 'milliliters') {
            ounces *= 0.033814;
        } else if (old.units === 'grams') {
            ounces *= 0.035274;
        } else if (old.units === 'kilograms') {
            ounces *= 35.274;
        } else if (old.units === 'pounds') {
            ounces *= 16;
        }
        const fakeTreatmentForSaving = {
            name: stripConcentrationFromTreatmentName(old.name),
            var: getVarNameFromTreatmentName(old.name),
            function: '',    // doesn't matter
            concentration: getConcentrationFromTreatmentName(old.name),
            type,
        };

        return TreatmentEntry.make(
            fakeTreatmentForSaving,
            ounces,
            (old.amount > 0) ? old.amount.toFixed(1) : '',
            old.units || '',
            fakeTreatmentForSaving.concentration
        );
    };

    const getConcentrationFromTreatmentName = (name: string): number => {
        try {
            if (name.indexOf('100%') >= 0) {
                return 100;
            }
            const indexOfPctAndParenthesis = name.indexOf('%)');
            if (indexOfPctAndParenthesis >= 0) {
                const start = name.indexOf('(');
                const numberString = name.substr(start + 1, indexOfPctAndParenthesis - start - 1);
                return (+numberString > 0) ? +numberString : 100;
            }
            const indexOfSign = name.indexOf('%');
            // incase it begins with 4% or something.
            if (indexOfSign === 1) {
                return (+name[0] > 0) ? +name[0] : 100;
            }
            if (indexOfSign < 1) {
                return 100;
            }
            const numbers = name.substr(indexOfSign - 2, 2);
            return +numbers;
        } catch (e) {
            return 100;
        }
    };

    const stripConcentrationFromTreatmentName = (name: string): string => {
        try {
            if (name.indexOf('(100%)') >= 0) {
                return name.replace('(100%)', '');
            }
            if (name.indexOf('100%') >= 0) {
                return name.replace('100%', '');
            }
            // something (30%)
            const indexOfPctAndParenthesis = name.indexOf('%)');
            if (indexOfPctAndParenthesis >= 2) {
                const start = name.indexOf('(');
                const percentString = name.substr(start, indexOfPctAndParenthesis - start + 2);
                return name.replace(percentString, '');
            }
            const indexOfPct = name.indexOf('%');
            if (indexOfPct >= 2) {
                const percentString = name.substr(indexOfPct - 2, 3);
                return name.replace(percentString, '');
            }
            if (indexOfPct === 1) {
                const percentString = name.substr(0, 2);
                return name.replace(percentString, '');
            }
            return name;
        } catch (e) {
            return name;
        }
    };

    const getVarNameFromTreatmentName = (name: string): string => {
        try {
            const nameToVarMap = {
                'Calcium Hypochlorite': 'calc_hypo',
                'Sodium Bicarbonate': 'baking_soda',
                'Sodium Carbonate': 'soda_ash',
                'Pool Salt': 'salt',
                'Calcium Chloride': 'cal_chlor',
                'Stabilizer': 'cya',
                'Bromine': 'bro',
            };
            for (let key of Object.keys(nameToVarMap)) {
                if (name.indexOf(key) >= 0) {
                    return nameToVarMap[key];
                }
            }
            return name;
        } catch (e) {
            return name;
        }
    };
}

export interface PoolDoctorPool {
    // format is tbd
    modified_at: string,
    name: string;
    // The volume might be gallons or liters (yikes)
    volume: number;
    isGallons: boolean;
    // 0 == chlorine, 1 == salt, 2 == bromine?
    type: number;

    logs: PoolDoctorLog[];
}

interface PoolDoctorLog {
    treatments: PoolDoctorTreatmentEntry[];
    readings: PoolDoctorReadingEntry[];
    notes: string;
    created_at: string;
}

interface PoolDoctorTreatmentEntry {
    name: string;
    units: string;
    amount: number;
}

interface PoolDoctorReadingEntry {
    name: string;
    units: string;
    value: number;
}

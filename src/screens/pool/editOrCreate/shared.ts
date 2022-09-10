import { IPool } from '~/models/Pool';
import { Util } from '~/services/Util';

export const toPoolNoId = (pool: Partial<IPool>): IPool | null => {
    if (!!pool.name && !!pool.gallons && !!pool.waterType) {
        return {
            name: pool.name ?? 'My Pool',
            gallons: pool.gallons ?? 0,
            waterType: pool.waterType ?? 'chlorine',
            wallType: pool.wallType ?? 'plaster',
            email: pool.email,
            formulaId: pool.formulaId,
            objectId: pool.objectId ?? Util.generateUUID(),
            poolDoctorId: pool.poolDoctorId,

            // Deprecated fields that we still map anyways:
            recipeKey: pool.recipeKey,
        };
    }
    return null;
};

export const toPool = (pool: Partial<IPool>): IPool | null => {
    const poolWithoutId = toPoolNoId(pool);
    if (poolWithoutId && pool.objectId) {
        return {
            ...poolWithoutId,
            objectId: pool.objectId ?? 'abc',
        };
    }
    return null;
};

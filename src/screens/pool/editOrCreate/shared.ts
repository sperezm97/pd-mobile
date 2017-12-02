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
            recipeKey: pool.recipeKey,
            objectId: pool.objectId ?? Util.generateUUID(),
            poolDoctorId: pool.poolDoctorId,
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

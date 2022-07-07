export class Util {
    static deepCopy = <T>(target: T): T => {
        if (target === null) {
            return target;
        }

        if (target instanceof Date) {
            return new Date(target.getTime()) as any;
        }

        if (target instanceof Array) {
            const cp = [] as any[];
            (target as any[]).forEach((v) => {
                cp.push(v);
            });
            return cp.map((n: any) => Util.deepCopy<any>(n)) as any;
        }


        if (typeof target === 'object' && target !== {}) {
            const cp = { ...(target as { [key: string]: any }) } as { [key: string]: any };
            Object.keys(cp).forEach((k) => {
                cp[k] = Util.deepCopy<any>(cp[k]);
            });
            return cp as T;
        }

        return target;
    };

    static notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
        return value !== null && value !== undefined;
    }

    static removeSuffixIfPresent = (suffix: string, original: string): string => {
        if (original.length < suffix.length) {
            return original;
        }
        const candidate = original.substr(original.length - suffix.length);
        if (candidate === suffix) {
            return original.substr(0, original.length - suffix.length);
        }
        return original;
    };

    static removePrefixIfPresent = (prefix: string, original: string): string => {
        if (original.startsWith(prefix)) {
            return original.slice(prefix.length);
        }
        return original;
    };

    static getDisplayNameForTreatment = (t: { name: string; concentration?: number }): string => {
        if (t.concentration && t.concentration < 100) {
            return `${t.concentration.toFixed(0)}% ${t.name}`;
        } else {
            return t.name;
        }
    };

    static generateUUID = () => {
        return Math.random().toString(36).slice(2);
    };

    static firstOrNull<T>(list: T[]): T | null {
        if (list.length > 0) {
            return list[0];
        }
        return null;
    }

    static lastIndexInArray = (array: any[]): number => {
        return array.length - 1;
    };

    static lastItemInArray = <T>(array: T[]): T => {
        return array[array.length - 1];
    };

    /**
     *
     * The main reason for this function is about to integrate the Realms Objects or Collections
     * and redux, not update the store unless it is a POJO.
     *
     */
    static toPojo = <T>(fields: string[], rawEntity: T): T => {
        const pojo: T = {} as T;
        fields.forEach((field) => (pojo[field] = rawEntity[field]));
        return pojo;
    };

    static toArrayPojo = <T>(entityProps: string[], realmObjects: Realm.Collection<T>): T[] => {
        const parseData: T[] = [];

        realmObjects.forEach((ro) => {
            const pojo = Util.toPojo<T>(entityProps, ro);
            parseData.push(pojo);
        });

        return parseData;
    };

    static abbreviate = (volume: number): string => {
        if (volume < 1000) {
            return volume.toFixed(0);
        }
        return `${(volume / 1000).toFixed(0)}K`;
    };

    static generateTimestamp = () => {
        return Date.now();
    };

    static excludeFalsy = (array: any[]) => {
        return array.filter(Boolean);
    }
    static hasInArray = (array: any[], value: string) => {
        return array.some((s) => s.includes(value));
    }

    static doAsync = async (cb: () => void) => {
        setTimeout(cb, 1);
    }

    static delay = async (seconds: number) => {
        return new Promise((resolve) => {
            setTimeout(resolve, seconds * 1000);
        });
    }

    // These 2 methods use ISO strings (supposedly)
    static stringFromTimestamp = (ts: number): string => {
        const d = new Date(ts);
        return d.toISOString();
    }
    static timestampFromString = (ds: string): number => {
        const d = new Date(ds);
        return d.getTime();
    }
}

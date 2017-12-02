import { DisplayValueOption } from '../Util';

export type PoolUnit = 'metric' | 'us' | 'imperial';

export enum EnumPoolUnit {
    metric = 'metric',
    us = 'us',
    imperial = 'imperial',
}

export const PoolUnitOptions: DisplayValueOption<PoolUnit>[] = [
    {
        display: 'Metric Liters',
        value: 'metric',
    },
    {
        display: 'US Gallons',
        value: 'us',
    },
    {
        display: 'Imperial Gallons',
        value: 'imperial',
    },
];

export const getDisplayForPoolValue = (value: PoolUnit): string => {
    const names = { metric: 'Liters', us: 'US Gallons', imperial: 'Imp Gallons' };
    return names[value];
};

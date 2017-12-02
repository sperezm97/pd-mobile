import { DisplayValueOption } from '../Util';

export type WallTypeValue = 'vinyl' | 'plaster' | 'fiberglass' | 'galvanized_steel' | 'tile';

export const wallTypeOptions: DisplayValueOption<WallTypeValue>[] = [
    {
        display: 'Vinyl',
        value: 'vinyl',
    },
    {
        display: 'Plaster',
        value: 'plaster',
    },
    {
        display: 'Fiberglass',
        value: 'fiberglass',
    },
    {
        display: 'Galvanized Steel',
        value: 'galvanized_steel',
    },
    {
        display: 'Tile',
        value: 'tile',
    },
];

export const getDisplayForWallType = (value: WallTypeValue): string | null => {
    for (let i = 0; i < wallTypeOptions.length; i++) {
        if (wallTypeOptions[i].value === value) {
            return wallTypeOptions[i].display;
        }
    }
    return null;
};

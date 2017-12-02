import React from 'react';

import { EntryEmail } from './EntryEmail';
import { EntryName } from './EntryName';
import { EntryVolume } from './EntryVolume';
import { EntryWallType } from './EntryWallType';
import { EntryWaterType } from './EntryWaterType';

export type EntryPoolElements = 'name' | 'waterType'| 'gallons' | 'wallType' | 'email';

export interface EntryPoolHeader {
    id: EntryPoolElements;
    title: string;
    description: string;
}

type RecordEntryPool = Record<EntryPoolElements, () => JSX.Element>

export namespace EntryPoolHelpers {

    export const getEntryElementById = (id: EntryPoolElements) => {
        const entryPool : RecordEntryPool = {
            name: () => <EntryName/>,
            waterType: () => <EntryWaterType />,
            gallons: () => <EntryVolume />,
            wallType: () => <EntryWallType />,
            email: () => <EntryEmail />,
        };
        return entryPool[id];
    };

    export const entryHeaderInfo: Record<EntryPoolElements, EntryPoolHeader> = {
        name: {
            id: 'name',
            title: 'Pool Name',
            description: 'Every pool deserves a great name.',
        },
        waterType: {
            id: 'waterType',
            title: 'Water Type',
            description: "Select your pool's sanitization method.",
        },
        gallons: {
            id: 'gallons',
            title: 'Pool Volume',
            description: 'How big is your pool?',
        },
        wallType: {
            id: 'wallType',
            title: 'Wall Type',
            description: 'This will help us pick target-levels for some chemicals, but you can still override them later.',
        },
        email: {
            id: 'email',
            title: 'Email Address',
            description: 'If you email a log entry, we’ll pre-populate the “to” field with this address.',
        },
    };
}

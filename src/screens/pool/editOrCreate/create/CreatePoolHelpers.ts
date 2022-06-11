import { PDColor } from '~/components/PDTheme';

import { EntryPoolElements } from '../entryPoolValues/EntryPoolHelpers';


export type CreatePoolField = EntryPoolElements | 'formula' | 'customTargets';

export interface CreatePoolListItem {
    id: CreatePoolField;
    value?: string | null;
    label: string;
    image: string;
    onPress: () => void;
    valueColor: PDColor;
    animationIndex: number;
}

export interface CreatePoolListSection {
    title: string;
    data: CreatePoolListItem[];
}

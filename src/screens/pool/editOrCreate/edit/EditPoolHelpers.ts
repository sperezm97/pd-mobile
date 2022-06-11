import { PDColor } from '~/components/PDTheme';
import { EntryPoolElements } from '../entryPoolValues/EntryPoolHelpers';

export type EditPoolField = EntryPoolElements
    | 'formula'
    | 'customTargets'
    | 'exportData'
    | 'deletePool';

export interface EditPoolListItem {
    id: EditPoolField;
    value?: string | null;
    label: string;
    image: string;
    onPress: () => void;
    valueColor: PDColor;
    animationIndex: number;
}

export interface EditPoolListSection {
    title: string;
    data: EditPoolListItem[];
}


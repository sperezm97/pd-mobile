import { PDColor } from '../PDTheme';

export interface PDSectionListData {
    id: string;
    value?: string | null;
    label: string;
    image: string;
    onPress: () => void;
    valueColor: PDColor;
    animationIndex: number;
}

export interface PDSectionListItemProps extends PDSectionListData {
    index: number;
    sectionLength: number;
}

export interface PDSection {
    title: string;
    data: PDSectionListData[];
}

export interface PickerState {
    key: PickerKey;
    value: string | null;
}

export type PickerKey = 'nothing' | 'water_type' | 'wall_type' | 'chem_concentration' | 'scoop_chem' | 'unit';

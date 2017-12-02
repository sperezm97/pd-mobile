// DO NOT IMPORT ANYTHING FROM THIS FILE.
// instead, use importable.ts.


// To enable reliable offline mode, we preload a few formulas on the device.
// We have a script that does this, but this file is the source-of-truth for which formulas
// we should pull & associate with certain water-types.

import { WaterTypeValue } from '~/models/Pool/WaterType';

export type FormulaMap = Record<WaterTypeValue, string[]>;

export const devFormulaMap: FormulaMap = {
    chlorine: ['wild_passenger_963', 'noteworthy_sensitive_924', 'inconsequential_lawyer_485'],     // This last one is actually just the archived pool doctor one.
    uv: ['clumsy_hold_579', 'orange_status_288'],
    salt_water: ['simple_regret_621', 'orange_status_288'],
    bromine: ['lovely_plan_733'],
    ozone: ['abandoned_course_558'],
    copper: ['naughty_style_347'],
};

export const prodFormulaMap: FormulaMap = {
    chlorine: ['vast_argument_756', 'glum_marriage_172', 'awful_picture_479'],
    uv: ['academic_mouth_0', 'vast_argument_756', 'enraged_secret_755'],         // TODO: actually do these!
    salt_water: ['jumpy_bear_993'],
    bromine: ['meaty_start_588', 'moist_western_543'],
    ozone: ['enraged_secret_755'],      // TODO: fix this up!!
    copper: ['gleaming_guard_569'],
};

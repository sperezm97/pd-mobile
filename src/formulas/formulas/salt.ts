import { Formula } from '~/formulas/models/Formula';
import { ch } from '~/formulas/readings/ch';
import { cya as cya_reading } from '~/formulas/readings/cya';
import { fc } from '~/formulas/readings/fc';
import { ph } from '~/formulas/readings/ph';
import { ta } from '~/formulas/readings/ta';
import { tc } from '~/formulas/readings/tc';
import { phosphate } from '~/formulas/readings/phosphate';
import { temp_c } from '~/formulas/readings/temp_c';
import { temp_f } from '~/formulas/readings/temp_f';
import { baking_soda } from '~/formulas/treatments/baking_soda';

import { calc_hypo } from '~/formulas/treatments/calc_hypo';
import { cal_chlor } from '~/formulas/treatments/cal_chlor';
import { lsi } from '~/formulas/treatments/lsi';
import { m_acid } from '~/formulas/treatments/m_acid';
import { soda_ash } from '~/formulas/treatments/soda_ash';
import { cya as cya_treatment } from '~/formulas/treatments/cya';
import { swg_up } from '~/formulas/treatments/swg_up';
import { swg_down } from '~/formulas/treatments/swg_down';
import { phosphate_rem } from '~/formulas/treatments/phosphate_rem';


/// This is the default formula for salt-water pools:
export const saltFormula: Formula = {
    name: 'Salt',
    description: 'This is for salt-water pools that use calcium hypochlorite for shock.',
    id: 'salt_calc_hypo',
    readings: [
        fc,
        tc,
        ph,
        ta,
        ch,
        cya_reading,
        temp_f,
        temp_c,
        phosphate,
    ],
    targets: [],
    treatments: [
        calc_hypo,
        soda_ash,
        baking_soda,
        m_acid,
        cal_chlor,
        cya_treatment,
        lsi,
        swg_up,
        swg_down,
        phosphate_rem
    ],
};

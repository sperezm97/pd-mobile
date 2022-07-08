import { Formula } from '../models/Formula';
import { bro } from '../readings/bro';
import { ch } from '../readings/ch';
import { ph } from '../readings/ph';
import { ta } from '../readings/ta';
import { tc } from '../readings/tc';
import { tds } from '../readings/tds';
import { cya as cya_reading } from '../readings/cya';
import { temp_c } from '../readings/temp_c';
import { temp_f } from '../readings/temp_f';
import { baking_soda } from '../treatments/baking_soda';
import { cal_chlor } from '../treatments/cal_chlor';
import { lsi } from '../treatments/lsi';
import { cya as cya_treatment } from '../treatments/cya';
import { m_acid } from '../treatments/m_acid';
import { soda_ash } from '../treatments/soda_ash';
import { bromine } from '../treatments/bromine';


export const bromineFormula: Formula = {
    name: 'Bromine',
    description: 'This is for bromine pools (or spas).',
    id: 'bromine',
    readings: [
        bro,
        tc,
        ph,
        ta,
        ch,
        cya_reading,
        temp_f,
        temp_c,
        tds
    ],
    targets: [],
    adjusters: [],
    treatments: [
        bromine,
        soda_ash,
        baking_soda,
        m_acid,
        cal_chlor,
        cya_treatment,
        lsi,
    ]
};

import { Formula } from '../models/Formula';
import { chlorineFormula } from './chlorine';

export const uvFormula: Formula = {
    name: 'UV',
    description: 'This is for pools with a chlorinator and also a UV sanitizing system, which has a lower free-chlorine requirement.',
    id: 'chlorine_uv',
    readings: chlorineFormula.readings,
    targets: [
        ...chlorineFormula.targets,
        /// UV Pools have a lower FC target:
        {
            id: 'fc',
            range: {
                min: 0.8,
                max: 1.2,
            },
            name: 'Free Chlorine',
            description: null,
        }
    ],
    adjusters: chlorineFormula.adjusters,
    treatments: chlorineFormula.treatments
};

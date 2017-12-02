import { PreloadedFormulas } from './models';
import devData from './generated/dev_formulas.json';
import prodData from './generated/prod_formulas.json';

// TODO: some cleaner separation of prod & dev data here (both sets of formulas are loaded in each app).
// they're not both persisted to disk as formulas in each app -- but they are bundled w/ the js & loaded into application memory (yuck).

/// These 2 variables can be safely imported at runtime by the rest of the app:
export const preloadedDev: PreloadedFormulas = devData;
export const preloadedProd: PreloadedFormulas = prodData;

// The shape of this is `${formula.id}|${formula.ts}`
// Explicitly typealiasing here makes it slightly harder for us to confuse this with a raw id.
export type FormulaKey = string;

// We don't want to import formula here, but we want this function to be convenient to call.
export const getFormulaKey = (formula: { id: string; ts: number }): string => {
    return `${formula.id}|${formula.ts}`;
};

/// Represents a simple min <> max range. It's not specified whether this is inclusive or exclusive,
/// but we use floats... so that precision is flaky anyways.
export interface Range {
    min: number;
    max: number;
}

/// These are so simple we can just declare it here.
export const avg = (r: Range): number => {
    return (r.min + r.max) / 2;
};

export const isIn = (val: number, r: Range): boolean => {
    return (val >= r.min && val <= r.max);
};

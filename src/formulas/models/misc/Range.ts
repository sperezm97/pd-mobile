/// Represents a simple min <> max range. It's not specified whether this is inclusive or exclusive,
/// but we use floats... so that precision is flaky anyways.
export interface Range {
    min: number;
    max: number;
}

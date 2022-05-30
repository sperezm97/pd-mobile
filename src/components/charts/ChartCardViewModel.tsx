export interface ChartCardViewModel {
    /// The title to display on the chart card
    title: string;
    /// The master-id of the reading or treatment being graphed
    masterId: string;
    /// The values to graph along the y axis
    values: number[];
    /// The labels for the x axis (don't have to correspond to values)
    timestamps: number[];
    /// Whether the view should be interactive
    interactive: boolean;
    /// The ideal range, if any:
    idealMin: number | null;
    idealMax: number | null;
}

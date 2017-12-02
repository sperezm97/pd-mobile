import { PDColor } from '~/components/PDTheme';
import { PoolUnit } from '~/models/Pool/PoolUnit';

export interface RectangleMeasurements {
    deepest: string;
    shallowest: string;
    length: string;
    width: string;
}

export interface OtherMeasurements {
    deepest: string;
    shallowest: string;
    area: string;
}

export interface CircleMeasurements {
    deepest: string;
    shallowest: string;
    diameter: string;
}

export interface OvalMeasurements {
    deepest: string;
    shallowest: string;
    length: string;
    width: string;
}

export interface BaseShapeEntry {
    unit: string;
}

export interface Shape {
    id: ShapeId;
    label: string;
    icon: string;
}

export type ShapeId = 'rectangle' | 'circle' | 'oval' | 'other';
export type SomeShape = RectangleMeasurements | CircleMeasurements | OtherMeasurements | OvalMeasurements;
export type AllShapesKeys = keyof RectangleMeasurements | keyof CircleMeasurements | keyof OtherMeasurements | keyof OvalMeasurements;
export type Formula = (props: SomeShape) => number;


export const shapes: Shape[] = [
    {
        id: 'rectangle',
        label: 'Rectangle',
        icon: 'IconRectangle',
    },
    {
        id: 'circle',
        label: 'Circle',
        icon: 'IconCircle',
    },
    {
        id: 'oval',
        label: 'Oval',
        icon: 'IconOval',
    },
    {
        id: 'other',
        label: 'Other',
        icon: 'IconOther',
    },
];

export class VolumeEstimatorHelpers {
    static inputAccessoryId = 'volume_estimator_input_accessory'
    static areAllRequiredMeasurementsCompleteForShape = (shape: SomeShape) => Object.keys(shape).every((sp) => !!shape[sp]);

    static getBigShapeForSVG = (shapeId: ShapeId): string => {
        const bigShapeNamesById: Record<ShapeId, string> = {
            rectangle: 'Rectangle',
            circle: 'Circle',
            oval: 'Oval',
            other: 'Other',
        };
        return bigShapeNamesById[shapeId];
    };
    static getDarkBigShapeForSVG = (shapeId: ShapeId): string => {
        const bigShapeNamesById: Record<ShapeId, string> = {
            rectangle: 'RectangleDark',
            circle: 'CircleDark',
            oval: 'OvalDark',
            other: 'OtherDark',
        };
        return bigShapeNamesById[shapeId];
    };

    static getPrimaryColorByShapeId = (shapeId: ShapeId): PDColor => {
        const shapeByPrimaryColor: Record<ShapeId, PDColor> = {
            rectangle: 'blue',
            circle:'green',
            oval: 'orange',
            other: 'purple',
        };

        return shapeByPrimaryColor[shapeId];
    };

    static getPrimaryBlurredColorByShapeId = (shapeId: ShapeId): PDColor => {
        const shapeByPrimaryColor: Record<ShapeId, PDColor> = {
            rectangle:'blurredBlue',
            circle: 'blurredGreen',
            oval: 'blurredOrange',
            other: 'blurredPurple',
        };

        return shapeByPrimaryColor[shapeId];
    };

    static getPrimaryThemKeyByShapeId = (shapeId: ShapeId): PDColor => {
        const shapeByPrimaryColor: Record<ShapeId, PDColor> = {
            rectangle: 'blue',
            circle: 'green',
            oval: 'orange',
            other: 'purple',
        };

        return shapeByPrimaryColor[shapeId];
    };

    static estimateRectangleVolume = ({ width, length, deepest, shallowest }: RectangleMeasurements, units: PoolUnit): number => {
        const averageDepth = (+deepest + +shallowest) / 2.0;
        const surfaceArea = +width * +length;
        return surfaceArea * averageDepth * getMultiplierForUnits(units);
    };

    static estimateOvalVolume = ({ deepest, shallowest, length, width }: OvalMeasurements, units: PoolUnit): number => {
        const averageDepth = (+deepest + +shallowest) / 2.0;
        const surfaceArea = +width * +length;
        return surfaceArea * averageDepth * getMultiplierForUnits(units);
    };

    static estimateCircleVolume = ({ shallowest, deepest, diameter }: CircleMeasurements, units: PoolUnit): number => {
        const averageDepth = (+deepest + +shallowest) / 2.0;
        const radius = +diameter / 2.0;
        const surfaceArea = Math.PI * square(radius);
        return surfaceArea * averageDepth * getMultiplierForUnits(units);
    };

    static estimateOtherVolume = ({ area, deepest, shallowest }: OtherMeasurements, units: PoolUnit): number => {
        const averageDepth = (+deepest + +shallowest) / 2.0;
        return +area * averageDepth * getMultiplierForUnits(units);
    };

    static getButtonLabelForUnit = (unit: PoolUnit) : string => {
        const label : Record<PoolUnit, string> = {
            us: 'US',
            metric: 'Metric',
            imperial: 'Imperial',
        };
        return label[unit];
    }

    static getResultLabelForUnit = (unit: PoolUnit) : string => {
        const label : Record<PoolUnit, string> = {
            us: 'Gallons (US)',
            metric: 'Liters',
            imperial: 'Gallons (Imperial)',
        };
        return label[unit];
    }

    static getAbbreviationUnit = (unit: PoolUnit): string => {
        const abbreviation : Record<PoolUnit, string> = {
            us: 'FT',
            metric: 'M',
            imperial: 'FT',
        };
        return abbreviation[unit];
    }

    static getInputAccessoryLabelByShapeKey = (key: AllShapesKeys): string => {
        const abbreviation : Record<AllShapesKeys, string> = {
            deepest: 'Next',
            area:'Next',
            diameter:'Next',
            length: 'Next',
            width:'Next',
            shallowest: 'Done',
        };
        return abbreviation[key];
    }
}

const getMultiplierForUnits = (units: PoolUnit): number => {
    const cubicMetersToLiters = 1000;
    const cubicFeetToGallons = 7.48052;
    const cubicFeetToImperialGallons = 6.22884;

    if (units === 'us') {
        return cubicFeetToGallons;
    } else if (units === 'imperial') {
        return cubicFeetToImperialGallons;
    } else if (units === 'metric') {
        return cubicMetersToLiters;
    } else {
        console.warn('invalid unit: ' + units);
        return 1;
    }
};

const square = (x: number): number => Math.pow(x, 2);

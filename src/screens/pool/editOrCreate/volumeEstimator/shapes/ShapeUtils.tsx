import React from 'react';
import { PoolUnit } from '~/models/Pool/PoolUnit';

import { ShapeId } from '../VolumeEstimatorHelpers';
import { CircleVolumeShape } from './CircleVolumeShape';
import { OtherVolumeShape } from './OtherVolumeShape';
import { OvalVolumeShape } from './OvalVolumeShape';
import { RectangleVolumeShape } from './RectangleVolumeShape';

// I move this to a separate file, to fixed teh cycle warning between VolumeEstimatorHelper and The Shapes.
export const getElementByShapeId = (shapeId: ShapeId) => {
    const ReactElements: Record<ShapeId, React.FC<ShapesProps>> = {
        rectangle: RectangleVolumeShape,
        circle: CircleVolumeShape,
        oval: OvalVolumeShape,
        other: OtherVolumeShape,
    };
    return ReactElements[shapeId];
};


export interface ShapesProps {
    unit: PoolUnit
}

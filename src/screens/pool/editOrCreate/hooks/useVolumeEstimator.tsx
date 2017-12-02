import React, { useContext, useState } from 'react';

import {
    CircleMeasurements, OtherMeasurements, OvalMeasurements, RectangleMeasurements,
    ShapeId,
    SomeShape,
} from '../volumeEstimator/VolumeEstimatorHelpers';

interface EntryShape {
    rectangle: RectangleMeasurements;
    circle: CircleMeasurements;
    other: OtherMeasurements;
    oval: OvalMeasurements;
    estimation: string;
}

type ShapeDispatchType = React.Dispatch<React.SetStateAction<EntryShape>>;

const initialState: EntryShape = {
    rectangle: {
        deepest: '',
        shallowest: '',
        length: '',
        width: '',
    },
    oval: {
        deepest: '',
        shallowest: '',
        length: '',
        width: '',
    },
    circle: {
        deepest: '',
        shallowest: '',
        diameter: '',
    },
    other: {
        deepest: '',
        shallowest: '',
        area: '',
    },
    estimation: '',
};

const ShapeState = React.createContext<EntryShape>(initialState);
const ShapeDispatch = React.createContext<ShapeDispatchType>(() => {});

export const ShapeProvider: React.FC = ({ children }) => {
    const [shape, setShape] = useState<EntryShape>(initialState);

    return (
        <ShapeState.Provider value={ shape }>
            <ShapeDispatch.Provider value={ setShape }>
                {children}
            </ShapeDispatch.Provider>
        </ShapeState.Provider>
    );
};

export const useVolumeEstimator = (shapeId?: ShapeId) => {
    const shape = useContext(ShapeState);
    const dispatch = useContext(ShapeDispatch);

    const setShape = (values: Partial<SomeShape>) => {
        dispatch((prev) => ({ ...prev, [shapeId as ShapeId]: { ...prev[shapeId as ShapeId], ...values } }));
    };
    // make sure the gallons are saved on Gallons
    const setEstimation = (value: string) => {
        dispatch({ ...shape, estimation: value });
    };

    const clear = () => {
        dispatch({ ...initialState });
    };

    return {
        shape: shape[shapeId as ShapeId],
        setShape,
        setEstimation,
        estimation: shape.estimation,
        clear,
    };
};

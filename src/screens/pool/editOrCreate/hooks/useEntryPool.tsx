import React, { useContext, useState } from 'react';
import { IPool } from '~/models/Pool';
import { useTypedSelector } from '~/redux/AppState';
import { RecipeService } from '~/services/RecipeService';
import { Util } from '~/services/Util';

export type PartialPoolWithId = Partial<IPool> & Pick<IPool, 'objectId'>;

interface PartialPoolContext {
    pool: PartialPoolWithId;
    setPool: React.Dispatch<React.SetStateAction<PartialPoolWithId>>;
}

const createPoolDefaults: Partial<IPool> = {
    gallons: undefined,
    name: 'House Pool',
    waterType: 'chlorine',
    email: undefined,
    recipeKey: RecipeService.defaultFormulaKey,
    wallType: 'plaster',
};

const PartialPoolContext = React.createContext<PartialPoolContext>({
    pool: {
        ...createPoolDefaults,
        objectId: 'invalid_pool_id',        // gross!
    },

    // We're going to override this with the setState call in the PoolProvider component
    setPool: () => {
        console.log('this is the default issue');
    },
});

const getInitialPool = (reduxPool: IPool | null): PartialPoolWithId => {
    if (reduxPool) {
        return reduxPool;
    }
    const initialPool = createPoolDefaults;
    return {
        ...initialPool,
        objectId: Util.generateUUID(),
    };
};

export const PoolProvider: React.FC = (props) => {
    const reduxPool = useTypedSelector((state) => state.selectedPool);

    const initialPool = getInitialPool(reduxPool);
    const [pool, setPool] = useState(initialPool);

    const context = {
        pool,
        setPool,
    };

    return <PartialPoolContext.Provider value={ context }>{props.children}</PartialPoolContext.Provider>;
};

// This hook allows both CreatePool and EditPool to access and Edit the Pool state
export const useEntryPool = () => {
    const { pool, setPool } = useContext(PartialPoolContext);

    /// When the selected recipe key in redux changes, update the partial pool.
    const selectedFormulaKey = useTypedSelector((state) => state.selectedFormulaKey);
    React.useEffect(() => {
        if (selectedFormulaKey && selectedFormulaKey !== pool.recipeKey) {
            setPool({ ...pool, recipeKey: selectedFormulaKey });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedFormulaKey]);

    const isRequiredFilledOut = !!pool.name && !!pool.gallons && !!pool.waterType;

    const setPoolValue = (newValue: Partial<IPool>) => {
        setPool({ ...pool, ...newValue });
    };

    return {
        pool,
        setPool: setPoolValue,
        isRequiredFilledOut,
    };
};

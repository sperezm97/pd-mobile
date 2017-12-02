import { useEffect, useState } from 'react';

/// Executes the provided callback once, the first time this instance of the component loads.
export const useViewDidLoad = (cb: () => void) => {
    const [hasLoaded, setHasLoaded] = useState(false);
    useEffect(() => {
        if (!hasLoaded) {
            setHasLoaded(true);
            cb();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
};

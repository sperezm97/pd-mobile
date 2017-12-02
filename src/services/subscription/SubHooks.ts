import { useEffect, useState } from 'react';
import Purchase, { PurchasesPackage } from 'react-native-purchases';
import { IAP, PurchaseState } from '~/services/subscription/IAP';
import { useDeviceSettings } from '../DeviceSettings/Hooks';


/**
 * This hook checks if the user is currently subscribed.
 * It also subscribes to purchase update events
 */
 export const usePurchaseState = (): PurchaseState => {
    const [purchaseState, setPurchaseState] = useState<PurchaseState>({ status: 'loading', details: null });
    const { updateDSForPurchaseState } = useDeviceSettings();

    const refreshPurchaseState = async () => {
        const newPS = await IAP.fetchSubscriptionStatus();
        setPurchaseState(newPS);
        updateDSForPurchaseState(newPS);
    };

    useEffect(() => {
        // Initial load
        refreshPurchaseState();

        // Listen for changes (just re-pull the info after every change)
        Purchase.addPurchaserInfoUpdateListener(refreshPurchaseState);

        // Unsubscribe from changes on unmount
        return () => { Purchase.removePurchaserInfoUpdateListener(refreshPurchaseState); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return purchaseState;
};

/**
 * This hooks returns a list of the available products from the app store.
 * It only loads once, there are no update events
 */
export const useAvailablePackages = (): PurchasesPackage[] => {
    const [packages, setPackages] = useState<PurchasesPackage[]>([]);

    useEffect(() => {
        const cb = async () => {
            // All products includes active and inactive products form the user.
            const rawPackages = await IAP.fetchAvailablePackages();
            setPackages(rawPackages);
        };

        cb();
    }, []);

    return packages;
};

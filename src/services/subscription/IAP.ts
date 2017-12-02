import Purchases, {
    PurchaserInfo, PurchasesPackage,
} from 'react-native-purchases';
import { KNOWN_PRODUCTS, ProductId } from '~/models/InAppPurchase';

import { Config } from '../Config/AppConfig';
import { Util } from '../Util';

export interface PurchaseState {
    status: PurchaseStatus,
    details: null | {
        sku: ProductId;
        will_renew: boolean,
        exp: Date,
    },
}
type PurchaseStatus = 'not_bought' | 'loading' | 'unavailable' | 'cancelled' | 'error' | 'valid';

export class IAP {
    static configureOnLaunch = () => {
        Purchases.setDebugLogsEnabled(__DEV__);
        Purchases.setup(Config.revenueCatPublicKey);
    };

    static purchaseUnlock = async (): Promise<PurchaseState> => {
        const packages = await IAP.fetchAvailablePackages();
        if (packages.length > 0) {
            // This is the package we want to buy!
            const p = packages[0];
            const result = await IAP.purchasePackage(p);
            return result;
        }
        return IAP.getErrorResponse('unavailable');
    };

    static restoreUnlock = async (): Promise<PurchaseState> => {
        try {
            const purchaserInfo = await Purchases.restoreTransactions();
            return IAP.getStatus(purchaserInfo);
        } catch (e) {
            console.error('restore', e);
            if (e.userCancelled) {
                return IAP.getErrorResponse('cancelled');
            }
            return IAP.getErrorResponse('error');
        }
    };

    static getManagementURL = async (): Promise<string | null> => {
        const purchaserInfo = await Purchases.getPurchaserInfo();
        return purchaserInfo.managementURL;
    };

    static fetchSubscriptionStatus = async (): Promise<PurchaseState> => {
        try {
            const purchaserInfo = await Purchases.getPurchaserInfo();
            return IAP.getStatus(purchaserInfo);
        } catch (e) {
            console.error('check status', e);
            return IAP.getErrorResponse('error');
        }
    };

    static fetchAvailablePackages = async (): Promise<PurchasesPackage[]> => {
        try {
            const offerings = await Purchases.getOfferings();
            console.log(JSON.stringify(offerings));
            if (offerings.all.standard?.availablePackages) {
                return offerings.all.standard?.availablePackages;
            } else {
                return Promise.reject('There are no packages currently available');
            }
        } catch (e) {
            return Promise.reject('unable to retrieve packages');
        }
    };

    static purchasePackage = async (p: PurchasesPackage): Promise<PurchaseState> => {
        try {
            const purchaseMade = await Purchases.purchasePackage(p);
            const result = IAP.getStatus(purchaseMade.purchaserInfo);
            if (result.status === 'not_bought') {
                return IAP.getErrorResponse('error');
            }
            return result;
        } catch (e) {
            console.log('purchase', e);
            if (!e.userCancelled) {
                return IAP.getErrorResponse('error');
            }
            return IAP.getErrorResponse('cancelled');
        }
    };

    static restoreLastPurchase = async (): Promise<PurchaseState> => {
        try {
            const purchaserInfo = await Purchases.restoreTransactions();
            return IAP.getStatus(purchaserInfo);
        } catch (e) {
            console.error('restore', e);
            if (e.userCancelled) {
                return IAP.getErrorResponse('cancelled');
            }
            return IAP.getErrorResponse('error');
        }
    };

    private static getStatus = (purchaserInfo: PurchaserInfo): PurchaseState => {
        const { active } = purchaserInfo.entitlements;
        const entitlement = Util.firstOrNull(
            // Check for these 2 keys:
            [active.unlock_20, active.monthly_2]
            .filter(x => !!x)
            .filter(x => x.isActive)        // this one is probably unnecessary
        );
        if (entitlement) {
            // Paranoid type-checking: verify that the sku matches:
            const sku = entitlement.productIdentifier as ProductId;
            if (!KNOWN_PRODUCTS.includes(sku)) {
                return IAP.getErrorResponse('not_bought');
            }
            // The date really should exist in this branch.
            // If it doesn't, just assume it'll be valid for ~100 years... because I'm a bad programmer
            const exp_date = new Date(entitlement.expirationDate ?? '2120-01-01');
            return {
                status: 'valid',
                details: {
                    exp: exp_date,
                    sku,
                    will_renew: entitlement.willRenew,
                },
            };
        }
        return IAP.getErrorResponse('not_bought');
    };


    private static getErrorResponse(status: PurchaseStatus): PurchaseState {
        return {
            status,
            details: null,
        };
    }
}

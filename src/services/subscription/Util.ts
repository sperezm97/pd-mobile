import differenceInDays from 'date-fns/differenceInDays';
import { ProductId, Products } from '~/models/InAppPurchase';

/// Subscription Utils, for interpreting subscription data & returning strings for display
export namespace SU {

    export const getDisplayNameByCurrentSubscription = (currentSubscription: ProductId | null) => {
        switch (currentSubscription) {
            case Products.MONTHLY:
                return 'Monthly';
            case Products.ANNUALLY:
                return 'Yearly';
            default:
                return '';
        }
    };

    export const getDisplayPriceByCurrentSubscription = (currentSubscription: ProductId | null) => {
        switch (currentSubscription) {
            case Products.MONTHLY:
                return '$2';
            case Products.ANNUALLY:
                return '$20';
            default:
                return '';
        }
    };

    export const getRenewalTimeString = (exp: Date, will_renew: boolean): string => {
        const firstWord = will_renew ? 'Renews' : 'Expires';
        return `${firstWord} in ${differenceInDays(exp, new Date())} days`;
    };
}

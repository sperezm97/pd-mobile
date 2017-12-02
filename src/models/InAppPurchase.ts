export enum Products {
    MONTHLY = 'monthly_2',
    ANNUALLY = 'unlock_20'
}

export type ProductId = 'monthly_2' | 'unlock_20'
export const KNOWN_PRODUCTS: ProductId[] = ['monthly_2', 'unlock_20'];

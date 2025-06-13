import { lazy } from 'react';

const SellerFinance = [
    {
        path: 'seller-finance',
        component: lazy(() => import('views/seller-finance')),
    },
    
];

export default SellerFinance;

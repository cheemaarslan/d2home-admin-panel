import { lazy } from 'react';

const DeliveryManDetails = [
  {
    path: 'deliveryman-details/:id/:weekRange',  
    component: lazy(() => import('../../views/deliveryman-finance/deliveryman-detail')),  
  },
];

export default DeliveryManDetails;

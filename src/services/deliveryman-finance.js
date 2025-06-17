import request from './request';

const DeliverymanFinanceService = {
  getDeliverymanFinance: async (params = {}) => {
    try {
      const defaultParams = {
        page: 1,
        per_page: 10,
        ...params
      };
      
      const response = await request.get('/dashboard/admin/deliveryman-finance', { 
        params: defaultParams 
      });
      console.log('Raw API Response:', response.data);
      
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      const meta = response.data.meta || {};
      const summary = response.data.summary || {};

      return { data, meta, summary };
    } catch (error) {
      console.error('Error fetching deliveryman finance data:', error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch deliveryman finance data');
      } else if (error.request) {
        throw new Error('No response received from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  },

getDeliveryManDetails: async (id) => {
  if (!id) {
    throw new Error('Delivery Man ID is required');
  }
  
  try {
    const response = await request.get(`/dashboard/admin/deliveryman-finance/deliveryman-details/${id}`, {
      
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for delivery man ${id}:`, error);
    throw error;
  }
},

//add method for  download-invoice api 
 downloadInvoice: (invoiceId, params = {}) => {
    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }

    return request.get(`/dashboard/admin/deliveryman-finance/download-invoice/${invoiceId}`, {
      params,
      responseType: 'blob',
    })
  },
// Example usage in a component:
// <button onClick={() => downloadInvoice('some-uuid')}>Download Invoice</button>
};

export default DeliverymanFinanceService;
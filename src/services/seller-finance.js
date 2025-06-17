import request from './request';

const SellerFinanceService = {
getSellerFinance: async (params = {}) => {
  try {
    const defaultParams = {
      page: 1,
      per_page: 10,
      ...params
    };
    
    const response = await request.get('/dashboard/admin/seller-finance', { 
      params: defaultParams 
    });
    console.log('Raw API Response:', response.data);
    
    const data = Array.isArray(response.data) ? response.data : response.data.data || [];
    const meta = response.data.meta || {};
    const summary = response.data.summary || {};

    return { data, meta, summary };
  } catch (error) {
    console.error('Error fetching seller finance data:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch seller finance data';
    throw new Error(errorMessage);
  }
},

getShopDetails: async (shopUuid) => {
  if (!shopUuid) {
    throw new Error('Shop UUID is required');
  }
  
  try {
    const response = await request.get(`/dashboard/admin/seller-finance/${shopUuid}`, {
      params: { lang: 'en' }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching details for shop ${shopUuid}:`, error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch shop details';
    throw new Error(errorMessage);
  }
},
// /dashboard/admin/seller-finance/download-invoice/${invoiceId}`
//add method for  download-invoice api 
 downloadInvoice: (invoiceId, params = {}) => {
    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }

    return request.get(`/dashboard/admin/seller-finance/download-invoice/${invoiceId}`, {
      params,
      responseType: 'blob',
    })
  },
// Example usage in a component:
// <button onClick={() => downloadInvoice('some-uuid')}>Download Invoice</button>
};

export default SellerFinanceService;


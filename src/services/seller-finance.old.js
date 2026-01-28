import request from './request';

const SellerFinanceService = {
  getSellerFinance: async (params = {}) => {
    try {
      const defaultParams = {
        page: 1,
        per_page: 10,
        status: 'unpaid',
        ...params
      };
     

      const response = await request.get('/dashboard/admin/seller-finance', {
        params: defaultParams
      });
    

      // Validate response structure (direct array)
      if (!Array.isArray(response.data)) {
    
        return { data: [], meta: {}, summary: {} };
      }

      const shops = response.data;
      const targetStatus = defaultParams.status; // e.g., 'unpaid'
      const data = shops.reduce((acc, shop) => {
        const shopData = shop.shop || {};
        const weeklyOrders = Array.isArray(shop.weekly_orders) ? shop.weekly_orders : [];
     

        const formattedOrders = weeklyOrders
          .map(order => {
            if (!order || !order.week_range || !order.statistics) {
            
              return null;
            }
            return {
              shop: {
                id: shopData.id || null,
                uuid: shopData.uuid || null,
                name: shopData.translation?.title || `${shopData.seller?.firstname || ''} ${shopData.seller?.lastname || ''}`.trim() || 'N/A'
              },
              week_range: order.week_range || 'Unknown',
              orders_count: parseInt(order.statistics.orders_count || 0, 10),
              total_price: parseFloat(order.statistics.total_price || 0),
              total_commission: parseFloat(order.statistics.total_commission || 0),
              total_discounts: parseFloat(order.statistics.total_discounts || 0),
              status: order.status || 'unpaid',
              record_id: order.record_id || null // Add record_id
            };
          })
          .filter(order => order !== null && order.status === targetStatus); // Filter by status

       
        return [...acc, ...formattedOrders];
      }, []);

  

      const meta = response.data.meta || {
        total: data.length,
        current_page: defaultParams.page,
        per_page: defaultParams.per_page
      };

      const summary = response.data.summary || {};

      return { data, meta, summary };
    } catch (error) {
     
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch seller finance data';
      throw new Error(errorMessage);
    }
  },

  updateStatus: async (shopUuid, payload) => {
    try {
      const response = await request.post(`/dashboard/admin/seller-finance/${shopUuid}/update-status`, payload);
    
      return response.data;
    } catch (error) {
      
      throw new Error(error.response?.data?.message || 'Failed to update status');
    }
  },
getShopDetails: async (recordId) => {
  console.log(recordId);
  if (!recordId || isNaN(parseInt(recordId))) {
    throw new Error('Valid Record ID is required');
  }
  try {
    const response = await request.post(`/dashboard/admin/seller-finance/details`, { record_id: recordId, lang: 'en' });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch shop details';
    throw new Error(errorMessage);
  }
},
// /dashboard/admin/seller-finance/download-invoice/${invoiceId}`
//add method for  download-invoice api 
 downloadInvoice: async (invoiceId, params = {}) => {
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


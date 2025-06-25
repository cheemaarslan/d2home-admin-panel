import request from './request';


const DeliverymanFinanceService = {
  getDeliverymanFinance: async (params = {}) => {
    try {
      const defaultParams = {
        page: 1,
        per_page: 10,
        ...params,
      };

      console.log('Sending request with params:', defaultParams);

      const response = await request.get('/dashboard/admin/deliveryman-finance', {
        params: defaultParams,
      });

      console.log('Raw API Response:', response.data);

      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      const meta = response.data.meta || {};
      const summary = response.data.summary || {};

      // Log unique status values for debugging
      const statusValues = [...new Set(data.map((record) => record.status || record.weekly_reports?.[0]?.status || 'undefined'))];
      console.log('Unique status values in API response:', statusValues);

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

getDeliveryManDetails: async (id, week_range ) => {
    if (!id || !week_range) {
        throw new Error('Deliveryman ID, week range are required');
    }

    console.log('My payload: ', { week_range });
    console.log('Id: ', id);

    try {
        const response = await request.get(
            `/dashboard/admin/deliveryman-finance/deliveryman-details/${id}`,
            { params: { week_range } }
        );
        return response.data;
    } catch (error) {
        console.error(`Error fetching details for delivery man ${id}:`, error);
        throw error;
    }
},



downloadInvoice: async (invoiceId, params = {}, week_range) => {
  if (!invoiceId) {
    throw new Error("Invoice ID is required");
  }
  return request.get(
    `/dashboard/admin/deliveryman-finance/download-invoice/${invoiceId}`,
    {
      params: {
        ...params,
        week_range,
      },
      responseType: 'blob',
      timeout: 32000,
    }
  );
},

  updateStatus: async (deliverymanId, payload) => {
    if (!deliverymanId || !payload.status || !payload.week_range) {
      throw new Error('Deliveryman ID, status, and week range are required');
    }

    try {
      const response = await request.post(
        `/dashboard/admin/deliveryman-finance/${deliverymanId}/status`,
        payload
      );
      console.log('Update status response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error updating status for deliveryman ${deliverymanId}:`, error);
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to update status');
      } else if (error.request) {
        throw new Error('No response received from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  },
};

export default DeliverymanFinanceService;
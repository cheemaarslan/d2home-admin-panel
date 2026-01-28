import request from './request';
import { message } from 'antd';


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

  getDeliveryManDetails: async (id, week_range) => {
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

  exportToExcel: async (filteredData) => {
  if (!filteredData) {
    throw new Error('filtered Data is required');
  }
  const key = 'export-all';
  try {
    message.loading({ content: 'Preparing export...', key });

    const response = await request.post(
      `/dashboard/admin/deliveryman-finance/download-excel`,
      { filteredData, lang: 'en' },
      {
        responseType: 'blob' // This is crucial for file downloads
      }
    );

    // Create a safe filename fallback
    const timestamp = new Date().toISOString().slice(0, 10);
    let filename = `deliveryman_finance_${filteredData}_${timestamp}.xlsx`;

    // Try to get filename from headers (more robust approach)
    if (response.headers) {
      const disposition = response.headers['content-disposition'] ||
        response.headers.get('content-disposition');
      if (disposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
    }

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      window.URL.revokeObjectURL(url);
      link.remove();
    }, 100);

    message.success({
      content: 'Export downloaded successfully!',
      key,
      duration: 2
    });

    return true;
  } catch (error) {
    console.error('Export error:', error);
    let errorMessage = 'Failed to download Excel file';

    // Try to parse error message from blob if response was blob
    if (error.response?.data instanceof Blob) {
      try {
        const text = await error.response.data.text();
        const result = JSON.parse(text);
        errorMessage = result.message || errorMessage;
      } catch (e) {
        console.error('Error parsing error blob:', e);
      }
    } else {
      errorMessage = error.response?.data?.message ||
        error.message ||
        errorMessage;
    }

    message.error({
      content: `Export failed: ${errorMessage}`,
      key,
      duration: 4
    });

    throw new Error(errorMessage);
  }
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
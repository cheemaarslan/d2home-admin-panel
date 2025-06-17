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
downloadInvoice: async (invoiceId) => {
    if (!invoiceId) {
        throw new Error('Invoice ID is required');
    }

    try {
        console.log('Making request to:', `/dashboard/admin/deliveryman-finance/download-invoice/${invoiceId}`);
        const response = await request.get(`/dashboard/admin/deliveryman-finance/download-invoice/${invoiceId}`, {
            responseType: 'blob',
        });

        // Log response for debugging
        console.log('API Response:', {
            status: response?.status,
            headers: response?.headers,
            data: response?.data ? 'Blob data received' : 'No data',
        });

        // Check if response and headers exist
        if (!response || !response.headers) {
            throw new Error('Invalid response from server: Response or headers missing');
        }

        // Check if the response is a PDF
        const contentType = response.headers['content-type'];
        if (!contentType.includes('application/pdf')) {
            const errorText = await response.data.text();
            let errorMessage = 'Failed to download invoice';
            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
            } catch (e) {
                console.error('Error parsing response:', errorText);
            }
            throw new Error(errorMessage);
        }

        // Create a link element to trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice_${invoiceId}.pdf`);
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        return { status: true, message: 'Invoice downloaded successfully' };
    } catch (error) {
        console.error(`Error downloading invoice ${invoiceId}:`, {
            message: error.message,
            stack: error.stack,
            response: error.response ? {
                status: error.response.status,
                headers: error.response.headers,
                data: error.response.data ? 'Data received' : 'No data',
            } : 'No response received',
            request: error.request ? error.request : 'No request details',
            config: error.config ? {
                url: error.config.url,
                method: error.config.method,
                headers: error.config.headers,
            } : 'No config details',
        });
        throw new Error(error.message || 'Failed to download invoice');
    }
}
// Example usage in a component:
// <button onClick={() => downloadInvoice('some-uuid')}>Download Invoice</button>
};

export default DeliverymanFinanceService;
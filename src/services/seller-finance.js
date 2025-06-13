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

//add method for  download-invoice api 
downloadInvoice: async (invoiceId) => {
    if (!invoiceId) {
      throw new Error('Invoice ID is required');
    }

    try {
      console.log('Making request to:', `/dashboard/admin/seller-finance/download-invoice/${invoiceId}`);
      const response = await request.get(`/dashboard/admin/seller-finance/download-invoice/${invoiceId}`, {
        responseType: 'blob',
      });

      // Log detailed response for debugging
      console.log('Service response:', {
        status: response?.status,
        headers: response?.headers,
        data: response?.data ? 'Blob received' : 'No data',
        contentType: response?.headers?.['content-type'],
      });

      // Validate response
      if (!response || !response.data) {
        throw new Error('No response or data received from server');
      }
      if (response.status !== 200) {
        let errorMessage = `Server responded with status ${response.status}`;
        if (response.data instanceof Blob) {
          errorMessage = await response.data.text(); // Convert blob to text for error details
        }
        throw new Error(errorMessage);
      }
      if (response.headers['content-type'] !== 'application/pdf') {
        let errorMessage = 'Invalid response: Not a PDF';
        if (response.data instanceof Blob) {
          errorMessage = await response.data.text();
        }
        throw new Error(errorMessage);
      }

      return response;
    } catch (error) {
      console.error(`Error downloading invoice ${invoiceId}:`, error);
      let errorMessage = 'Failed to download invoice';

      if (error.response) {
        if (error.response.status === 404) {
          errorMessage = 'Invoice not found';
        } else if (error.response.status === 403) {
          errorMessage = 'Unauthorized access';
        } else if (error.response.data instanceof Blob) {
          errorMessage = await error.response.data.text();
        } else {
          errorMessage = error.response.data?.message || `Server responded with status ${error.response.status}`;
        }
      } else if (error.request) {
        errorMessage = 'No response received from server. Check network or API URL.';
      } else {
        errorMessage = error.message || 'Error setting up request';
      }

      throw new Error(errorMessage);
    }
  },
// Example usage in a component:
// <button onClick={() => downloadInvoice('some-uuid')}>Download Invoice</button>
};

export default SellerFinanceService;


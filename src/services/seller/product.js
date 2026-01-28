import request from '../request';
import requestWithoutTimeout from '../requestWithoutTimeout';

const productService = {
  getAll: (params) =>
    request.get('dashboard/seller/products/paginate', { params }),
  getById: (uuid, params) =>
    request.get(`dashboard/seller/products/${uuid}`, { params }),
  create: (params) => request.post(`dashboard/seller/products`, {}, { params }),
  export: (params) =>
    requestWithoutTimeout.get(`dashboard/seller/products/export`, { params }),
  import: (data) =>
    requestWithoutTimeout.post('dashboard/seller/products/import', data),
  update: (uuid, params) =>
    request.put(`dashboard/seller/products/${uuid}`, {}, { params }),
  delete: (params) =>
    request.delete(`dashboard/seller/products/delete`, { params }),
  extras: (uuid, data) =>
    request.post(`dashboard/seller/products/${uuid}/extras`, data),
  stocks: (uuid, data) =>
    request.post(`dashboard/seller/products/${uuid}/stocks`, data),
  properties: (uuid, data) =>
    request.post(`dashboard/seller/products/${uuid}/properties`, data),
  setActive: (uuid) =>
    request.post(`dashboard/seller/products/${uuid}/active`, {}),
  getStock: (params) =>
    request.get(`dashboard/seller/stocks/select-paginate`, { params }),
  updateStatus: (uuid, params) =>
    request.get(`dashboard/seller/products/${uuid}/status/change`, { params }),
  updateKitchens: (data) =>
    request.post('dashboard/seller/products/multi/kitchen/update', data),
  setIsBogo: (uuid, newStatus) => {
    if (typeof uuid !== 'string') {
      console.error('Invalid UUID:', uuid);
      throw new Error('Invalid UUID');
    }
    return request
      .post(`dashboard/seller/products/${uuid}/is-bogo`, { is_bogo: newStatus ? 1 : 0 })
      .then((response) => {
        console.log('setIsBogo API response:', response.data);
        return { is_bogo: response.data.is_bogo || newStatus };
      })
      .catch((error) => {
        console.error('Error in setIsBogo:', error);
        throw error;
      });
  },
};

export default productService;

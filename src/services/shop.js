import request from './request';

const shopService = {
  get: (params) => request.get('dashboard/admin/shops', { params }),
  getAll: (params) => request.get('dashboard/admin/shops/paginate', { params }),
  getById: (id, params) =>
    request.get(`dashboard/admin/shops/${id}`, { params }),
  create: (params) => request.post('dashboard/admin/shops', {}, { params }),
  update: (id, params) =>
    request.put(`dashboard/admin/shops/${id}`, {}, { params }),
  setVerify: (uuid) => request.post(`dashboard/admin/shops/${uuid}/verify`, {}),
  setPosToggle: (uuid, newStatus) =>
    request.post(`dashboard/admin/shops/${uuid}/pos-status`, { pos_status: newStatus ? 1 : 0 })
      .then((res) => {
        console.log('setPosToggle API response:', res.data);
        return { pos_access: newStatus }; // Fallback to newStatus if API returns data: null
      }),
  delete: (params) =>
    request.delete(`dashboard/admin/shops/delete`, { params }),
  search: (params) => request.get('dashboard/admin/shops/search', { params }),
  getShopDeliveries: (params) =>
    request.get(`rest/shops/deliveries`, { params }),
  statusChange: (id, params) =>
    request.post(`dashboard/admin/shops/${id}/status/change`, {}, { params }),
  selectPaginate: (params) =>
    request
      .get('rest/shops/select-paginate', { params })
      .then((res) => res.data),
  dropAll: () => request.get(`dashboard/admin/shops/drop/all`),
  restoreAll: () => request.get(`dashboard/admin/shops/restore/all`),
};

export default shopService;
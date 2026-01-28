import request from './request';

const OrderStatusService = {
  getAll: (params) => request.get('dashboard/admin/order-statuses', { params, timeout: 60000 }),
get: (params) => request.get('rest/order-statuses', {
  params,
  timeout: 60000 // Timeout in milliseconds
}),
  status: (id) => request.post(`dashboard/admin/order-statuses/${id}/active`),
};

export default OrderStatusService;

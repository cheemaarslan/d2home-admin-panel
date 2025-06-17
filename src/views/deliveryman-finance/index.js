import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DeliverymanFinanceService from '../../services/deliveryman-finance';
import { Table, Button, Spin, Typography, Alert } from 'antd';

const { Title } = Typography;

const DeliverymanFinance = () => {
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFinanceData = async () => {
      try {
        setLoading(true);
        const response = await DeliverymanFinanceService.getDeliverymanFinance({
          page: pagination.page,
          per_page: pagination.perPage
        });
        console.log('API Response in Component:', response);
        setFinanceData([...(response.data || [])]);
        console.log('financeData:', response.data);
        setPagination(prev => ({
          ...prev,
          total: response.meta?.total ?? response.data?.length ?? 0
        }));
      } catch (err) {
        setError(err.message);
        console.error('Fetch error:', err);
      } finally {
        console.log('Loading state reset');
        setLoading(false);
      }
    };

    fetchFinanceData();
  }, [pagination.page, pagination.perPage]);

  const handleViewDetails = (deliverymanId, weekRange) => {
    if (!deliverymanId || !weekRange) {
      console.error('Missing deliveryman ID or week range:', { deliverymanId, weekRange });
      alert('Invalid deliveryman ID or week range');
      return;
    }
   
    navigate(`/deliveryman-details/${deliverymanId}/${encodeURIComponent(weekRange)}`);
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      render: (_, __, index) => (pagination.page - 1) * pagination.perPage + index + 1,
    },
    {
      title: 'Deliveryman',
      key: 'deliveryman',
      render: (_, record) => (
        <span>
          {record.deliveryMan?.firstname || 'N/A'} {record.deliveryMan?.lastname || ''}
        </span>
      ),
    },
    {
      title: 'Total Orders',
      dataIndex: ['statistics', 'orders_count'],
      key: 'orders_count',
      align: 'center',
      render: (value) => value ?? 0,
    },
    {
      title: 'Total Price',
      dataIndex: ['statistics', 'total'],
      key: 'total_price',
      align: 'right',
      render: (value) => `$${value?.toFixed(2) ?? '0.00'}`,
    },
    {
      title: 'Week Range',
      dataIndex: 'week_range',
      key: 'week_range',
      align: 'center',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleViewDetails(record.deliveryMan?.id, record.week_range)}
          disabled={!record.deliveryMan?.id || !record.week_range}
        >
          View Invoice
        </Button>
      ),
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination({
      page: pagination.current,
      perPage: pagination.pageSize,
      total: pagination.total
    });
  };

  if (loading) return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />;
  if (error) return <Alert message="Error" description={error} type="error" showIcon />;
  if (financeData.length === 0) {
    console.log('No data condition triggered, financeData:', financeData);
    return (
      <div style={{ padding: 24 }}>
        <Title level={2}>Deliveryman Finance Overview</Title>
        <Alert message="No data available" description="No deliveryman finance records found." type="info" showIcon />
      </div>
    );
  }

  console.log('Rendering Table with dataSource:', financeData);
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Deliveryman Finance Overview</Title>
      <Table
        columns={columns}
        dataSource={financeData}
        rowKey={(record) => record.deliveryMan?.id ? `${record.deliveryMan.id}-${record.week_range}` : `row-${Math.random()}`}
        pagination={{
          current: pagination.page,
          pageSize: pagination.perPage,
          total: pagination.total || financeData.length,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50']
        }}
        onChange={handleTableChange}
        bordered
        style={{ marginTop: 16 }}
        onRow={(record) => {
          console.log('Table row:', record);
          return {};
        }}
      />
    </div>
  );
};

export default DeliverymanFinance;
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerFinanceService from '../../services/seller-finance';
// Import icons for the buttons
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Table, Button, Spin, Typography, Alert, Tabs, Space, message } from 'antd';

// Custom Styles for the component
const componentStyles = `
  .seller-finance-container {
    padding: 24px;
    background-color: #f7fafc; /* Lighter gray background */
  }

  .finance-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e8e8e8;
  }

  /* Style Ant Design Tabs */
  .ant-tabs-nav {
    margin-bottom: 24px !important;
  }

  .ant-tabs-tab {
    font-size: 16px;
    padding: 12px 16px;
  }
  
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #1890ff !important;
  }
  
  .ant-tabs-ink-bar {
    background: #1890ff !important;
    height: 3px !important;
    border-radius: 2px;
  }

  /* Style Ant Design Table */
  .ant-table-wrapper {
    border-radius: 8px;
    overflow: hidden; /* Ensures border-radius is applied to headers */
  }

  .ant-table-thead > tr > th {
    background-color: #fafafa !important;
    color: #333 !important;
    font-weight: 600 !important;
    border-bottom: 1px solid #e8e8e8 !important;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f0f8ff !important; /* A light blue hover effect */
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0 !important;
  }

  /* Custom Button Styles */
  .btn-paid {
    background-color: #e6f7ff !important;
    border-color: #91d5ff !important;
    color: #1890ff !important;
  }
  
  .btn-paid:hover {
    background-color: #d9f0ff !important;
    border-color: #69c0ff !important;
  }
`;

const { Title } = Typography;
const { TabPane } = Tabs;

const SellerFinance = () => {
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('paid');
  const [pagination, setPagination] = useState({
    page: 1,
    perPage: 10,
    total: 0
  });
  const navigate = useNavigate();

  const fetchFinanceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await SellerFinanceService.getSellerFinance({
        page: pagination.page,
        per_page: pagination.perPage,
        status: activeTab,
      });
      setFinanceData([...(response.data || [])]);
      setPagination(prev => ({
        ...prev,
        total: response.meta?.total ?? response.data?.length ?? 0
      }));
    } catch (err) {
      setError(err.message);
      setFinanceData([]);
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, pagination.page, pagination.perPage]);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  const handleMarkAsPaid = async (record) => {
    const key = `update-${record.shop.uuid}`;
    message.loading({ content: 'Updating...', key });
    try {
      await SellerFinanceService.updateStatus(record.shop.uuid, { status: 'paid' });
      message.success({ content: 'Marked as Paid!', key, duration: 2 });
      fetchFinanceData();
    } catch (err) {
      message.error({ content: `Failed to update: ${err.message}`, key, duration: 3 });
    }
  };

  const handleMarkAsCanceled = async (record) => {
    const key = `update-${record.shop.uuid}`;
    message.loading({ content: 'Updating...', key });
    try {
      await SellerFinanceService.updateStatus(record.shop.uuid, { status: 'canceled' });
      message.success({ content: 'Marked as Canceled!', key, duration: 2 });
      fetchFinanceData();
    } catch (err) {
      message.error({ content: `Failed to update: ${err.message}`, key, duration: 3 });
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleViewShop = (shopUuid) => {
    if (!shopUuid) {
      message.error('This shop has no valid identifier');
      return;
    }
    navigate(`/seller-finance/${shopUuid}`);
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      render: (_, __, index) => (pagination.page - 1) * pagination.perPage + index + 1,
    },
    {
      title: 'Seller',
      dataIndex: ['shop', 'seller'],
      key: 'seller',
      render: (seller) => (
        <span>
          {seller?.firstname || 'N/A'} {seller?.lastname || ''}
          {seller?.role === 'seller' && (
            <span style={{ color: '#52c41a', marginLeft: 8 }}></span>
          )}
        </span>
      ),
    },
    {
      title: 'Orders',
      dataIndex: ['statistics', 'orders_count'],
      key: 'orders',
      align: 'center',
      render: (value) => value ?? 0,
    },
    {
      title: 'Commission',
      dataIndex: ['statistics', 'total_commission'],
      key: 'commission',
      render: (value) => `$${value ?? 0}`,
      align: 'right',
    },
    {
      title: 'Discounts',
      dataIndex: ['statistics', 'total_discounts'],
      key: 'discounts',
      render: (value) => `$${value ?? 0}`,
      align: 'right',
    },
    {
      title: 'Total',
      key: 'total',
      render: (_, record) => {
        const commission = record?.statistics?.total_commission ?? 0;
        const discounts = record?.statistics?.total_discounts ?? 0;
        const total = commission - discounts;
        return `$${total.toFixed(2)}`;
      },
      align: 'right',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        if (activeTab === 'unpaid') {
          return (
            <Space>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleViewShop(record?.shop?.uuid)}
                disabled={!record?.shop?.uuid}
              >
                View
              </Button>
              <Button
                className="btn-paid"
                icon={<CheckCircleOutlined />}
                onClick={() => handleMarkAsPaid(record)}
              >
                Mark Paid
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleMarkAsCanceled(record)}
              >
                Mark Cancel
              </Button>
            </Space>
          );
        }
        return (
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewShop(record?.shop?.uuid)}
            disabled={!record?.shop?.uuid}
          >
            View
          </Button>
        );
      },
    },
  ];

  const handleTableChange = (pagination) => {
    setPagination({
      page: pagination.current,
      perPage: pagination.pageSize,
      total: pagination.total
    });
  };

  return (
    <>
      <style>{componentStyles}</style>
      <div className="seller-finance-container">
        <div className="finance-card">
          <Title level={2} style={{ marginBottom: '24px' }}>Seller Finance Overview</Title>
          
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Paid" key="paid" />
            <TabPane tab="Unpaid" key="unpaid" />
            <TabPane tab="Canceled" key="canceled" />
          </Tabs>
          
          {/* CORRECTED RENDER LOGIC */}
          <div>
            {loading ? (
              <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />
            ) : error ? (
              <Alert message="Error" description={error} type="error" showIcon />
            ) : financeData.length === 0 ? (
              <Alert message="No data available" description={`No ${activeTab} records found.`} type="info" showIcon />
            ) : (
              <Table
                columns={columns}
                dataSource={financeData}
                rowKey={(record) => record.shop?.id ?? `row-${Math.random()}`}
                pagination={{
                  current: pagination.page,
                  pageSize: pagination.perPage,
                  total: pagination.total,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50']
                }}
                onChange={handleTableChange}
                onRow={(record) => ({})}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerFinance;

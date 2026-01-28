import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SellerFinanceService from '../../services/seller-finance';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Table, Button, Spin, Typography, Alert, Tabs, Space, message, Input } from 'antd';
import { CgExport } from 'react-icons/cg';
import { export_url } from '../../configs/app-global';
import productService from '../../services/product';
import { useTranslation } from 'react-i18next';

// Custom Styles
const componentStyles = `
  .index-container {
    padding: 24px;
    background-color: #f7fafc;
  }

  .finance-card {
    background: #ffffff;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e8e8e8;
  }

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

  .ant-table-wrapper {
    border-radius: 8px;
    overflow-x: scroll;
  }

  .ant-table-thead > tr > th {
    background-color: #fafafa !important;
    color: #333 !important;
    font-weight: 600 !important;
    border-bottom: 1px solid #e8e8e8 !important;
  }

  .ant-table-tbody > tr:hover > td {
    background-color: #f0f8ff !important;
  }

  .ant-table-tbody > tr > td {
    border-bottom: 1px solid #f0f0f0 !important;
  }

  .btn-paid {
    background-color: #e6f7ff !important;
    border-color: #91d5ff !important;
    color: #1890ff !important;
  }

  .btn-paid:hover {
    background-color: #d9f0ff !important;
    border-color: #69c0ff !important;
  }

  .search-container {
    display: flex;
    justify-content: flex-end;
  }

  .search-input {
    width: 300px;
  }

  .ant-btn-default:not(:disabled):not(.ant-btn-dangerous) {
    color: #1d6f42;
    border-color: #1d6f42;
  }

  .ant-btn-default:not(:disabled):not(.ant-btn-dangerous):hover {
    color: #1a6139;
    border-color: #1a6139;
  }

  .top-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  .export-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const { Title } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const IndexPage = () => {
  const { t } = useTranslation();
  const [financeData, setFinanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('unpaid');
  const [searchText, setSearchText] = useState('');
  const [downloading, setDownloading] = useState(false);
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

      const data = Array.isArray(response.data) ? response.data : [];
      setFinanceData(data);
      console.log('Fetched Finance Data:', data);
      // Do not setFilteredData here; let the search effect handle it
      setPagination(prev => ({
        ...prev,
        total: response.meta?.total ?? data.length ?? 0
      }));
    } catch (err) {
      setError(err.message);
      setFinanceData([]);
      // Do not reset filteredData here; let the search effect handle it
    } finally {
      setLoading(false);
    }
  }, [activeTab, pagination.page, pagination.perPage]);

  useEffect(() => {
    if (searchText) {
      const filtered = financeData.filter((record) => {
        const sellerName = record.shop?.name?.toLowerCase() || '';
        return sellerName.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
      setPagination(prev => ({ ...prev, total: filtered.length }));
    } else {
      setFilteredData(financeData);
      setPagination(prev => ({ ...prev, total: financeData.length }));
    }
  }, [searchText, financeData]);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  const handleMarkAsPaid = async (record) => {
    const key = `update-${record.shop.uuid}-${record.record_id}`;
    message.loading({ content: 'Updating...', key });
    try {
      await SellerFinanceService.updateStatus(record.shop.uuid, {
        status: 'paid',
        record_id: record.record_id
      });
      message.success({ content: 'Marked as Paid!', key, duration: 2 });
      fetchFinanceData();
    } catch (err) {
      message.error({ content: `Failed to update: ${err.message}`, key, duration: 3 });
    }
  };

  const excelExport = () => {
    setDownloading(true);
    const params = {
      filteredData: filteredData,
    };
    productService
      .exportSeller(params)
      .then((res) => {
        const body = export_url + res.data.file_name;
        window.location.href = body;
      })
      .finally(() => setDownloading(false));
  };

  const handleMarkAsCanceled = async (record) => {
    const key = `update-${record.shop.uuid}-${record.record_id}`;
    message.loading({ content: 'Updating...', key });
    try {
      await SellerFinanceService.updateStatus(record.shop.uuid, {
        status: 'canceled',
        record_id: record.record_id
      });
      message.success({ content: 'Marked as Canceled!', key, duration: 2 });
      fetchFinanceData();
    } catch (err) {
      message.error({ content: `Failed to update: ${err.message}`, key, duration: 3 });
    }
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchText('');
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleViewShop = (record) => {
    if (!record || !record.record_id) {
      message.error('This shop has no valid identifier');
      return;
    }
    navigate(`/seller-finance/${record.record_id}`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      render: (_, __, index) => (pagination.page - 1) * pagination.perPage + index + 1,
    },
    {
      title: 'Seller',
      dataIndex: ['shop', 'name'],
      key: 'seller',
      render: (name) => name || 'N/A'
    },
    {
      title: 'Week Range',
      dataIndex: 'week_range',
      key: 'week_range',
      render: (weekRange) => weekRange || 'Unknown'
    },
    {
      title: 'Orders',
      dataIndex: 'orders_count',
      key: 'orders_count',
      align: 'center',
      render: (value) => value ?? 0
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (value) => `$${parseFloat(value ?? 0).toFixed(2)}`,
      align: 'right'
    },
    {
      title: 'Commission',
      dataIndex: 'total_commission',
      key: 'total_commission',
      render: (value) => `$${parseFloat(value ?? 0).toFixed(2)}`,
      align: 'right'
    },
    {
      title: 'Discounts',
      dataIndex: 'total_discounts',
      key: 'total_discounts',
      render: (value) => `$${parseFloat(value ?? 0).toFixed(2)}`,
      align: 'right'
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unpaid'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        if (record.status === 'unpaid') {
          return (
            <Space>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleViewShop(record)}
                disabled={!record.record_id || isNaN(parseInt(record.record_id))}
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
            onClick={() => handleViewShop(record)}
            disabled={!record.record_id || isNaN(parseInt(record.record_id))}
          >
            View
          </Button>
        );
      }
    }
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
      <div className="index-container">
        <div className="finance-card">
          <div className="top-header">
            <div className="export-container">
              <Button loading={downloading} onClick={excelExport}>
                <CgExport className='mr-2' />
                {t('export')}
              </Button>
            </div>
            <div className="search-container">
              <Search
                placeholder="Search seller"
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                className="search-input"
                onSearch={handleSearch}
                onChange={(e) => setSearchText(e.target.value)}
                value={searchText}
              />
            </div>
          </div>

          <Title level={2} style={{ marginBottom: '24px' }}>Weekly Finance Overview</Title>

          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <TabPane tab="Unpaid" key="unpaid" />
            <TabPane tab="Paid" key="paid" />
            <TabPane tab="Canceled" key="canceled" />
          </Tabs>

          {loading ? (
            <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: 50 }} />
          ) : error ? (
            <Alert message="Error" description={error} type="error" showIcon />
          ) : filteredData.length === 0 ? (
            <Alert
              message="No data available"
              description={searchText ? `No sellers found matching "${searchText}"` : `No ${activeTab} records found.`}
              type="info"
              showIcon
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey={(record) => record.record_id}
              pagination={{
                current: pagination.page,
                pageSize: pagination.perPage,
                total: pagination.total,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50']
              }}
              onChange={handleTableChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default IndexPage;
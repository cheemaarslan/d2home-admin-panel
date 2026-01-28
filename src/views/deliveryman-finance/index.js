import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import DeliverymanFinanceService from '../../services/deliveryman-finance';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, ExportOutlined } from '@ant-design/icons';
import { Table, Button, Spin, Typography, Alert, Tabs, Space, message, Modal, Input } from 'antd';
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

  .top-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 16px;
    padding-top: 10px;
    padding-bottom: 10px;
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

  .export-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .ant-btn-default:not(:disabled):not(.ant-btn-dangerous) {
    color: #1d6f42;
    border-color: #1d6f42;
  }

  .ant-btn-default:not(:disabled):not(.ant-btn-dangerous):hover {
    color: #1a6139;
    border-color: #1a6139;
  }
`;

const { Title } = Typography;
const { TabPane } = Tabs;
const { Search } = Input;

const DeliverymanFinance = () => {
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
    total: 0,
  });
  const navigate = useNavigate();

  const fetchFinanceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await DeliverymanFinanceService.getDeliverymanFinance({
        page: pagination.page,
        per_page: pagination.perPage,
        status: activeTab,
      });

      const data = Array.isArray(response.data) ? response.data : [];

      // Flatten the data structure
      const flattenedData = data.flatMap(record => {
        return record.weekly_reports.map(report => ({
          ...record,
          weekly_reports: [report], // Keep as array for compatibility
          status: report.status, // Make status accessible at top level
        }));
      });

      // Now filter based on status
      const filteredData = flattenedData.filter(record => {
        const recordStatus = (record.status || 'unpaid').toLowerCase();
        return recordStatus === activeTab.toLowerCase();
      });

      setFinanceData(filteredData);
      setFilteredData(filteredData);
      setPagination((prev) => ({
        ...prev,
        total: response.meta?.total ?? filteredData.length ?? 0,
      }));
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch data');
      setFinanceData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, pagination.page, pagination.perPage]);

  useEffect(() => {
    fetchFinanceData();
  }, [fetchFinanceData]);

  useEffect(() => {
    if (searchText) {
      const filtered = financeData.filter((record) => {
        const fullName = `${record.deliveryMan?.firstname || ''} ${record.deliveryMan?.lastname || ''}`.toLowerCase();
        return fullName.includes(searchText.toLowerCase());
      });
      setFilteredData(filtered);
      setPagination((prev) => ({ ...prev, total: filtered.length }));
    } else {
      setFilteredData(financeData);
      setPagination((prev) => ({ ...prev, total: financeData.length }));
    }
  }, [searchText, financeData]);

  const handleMarkAsPaid = async (record) => {
    const key = `update-${record.deliveryMan?.id}-${record.weekly_reports?.[0]?.week_range}`;
    message.loading({ content: 'Updating...', key });
    try {
      await DeliverymanFinanceService.updateStatus(record.deliveryMan?.id, {
        status: 'paid',
        week_range: record.weekly_reports?.[0]?.week_range,
      });
      message.success({ content: 'Marked as Paid!', key, duration: 2 });
      fetchFinanceData();
    } catch (err) {
      message.error({ content: `Failed to update: ${err.message}`, key, duration: 3 });
    }
  };

  const handleMarkAsCanceled = async (record) => {
    Modal.confirm({
      title: 'Confirm Cancel',
      content: 'Are you sure you want to mark this record as canceled?',
      onOk: async () => {
        const key = `update-${record.deliveryMan?.id}-${record.weekly_reports?.[0]?.week_range}`;
        message.loading({ content: 'Updating...', key });
        try {
          await DeliverymanFinanceService.updateStatus(record.deliveryMan?.id, {
            status: 'canceled',
            week_range: record.weekly_reports?.[0]?.week_range,
          });
          message.success({ content: 'Marked as Canceled!', key, duration: 2 });
          fetchFinanceData();
        } catch (err) {
          message.error({ content: `Failed to update: ${err.message}`, key, duration: 3 });
        }
      },
    });
  };


  const excelExport = () => {
    setDownloading(true);
    const params = {
      filteredData: filteredData,
    };
    productService
      .exportDeliveryMan(params)
      .then((res) => {
        const body = export_url + res.data.file_name;
        window.location.href = body;
      })
      .finally(() => setDownloading(false));
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchText('');
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleViewDetails = async (record) => {
    const deliverymanId = record.deliveryMan?.id;
    const weekRange = record.weekly_reports?.[0]?.week_range;
    if (!deliverymanId || !weekRange) {
      message.error('Invalid deliveryman ID or week range');
      return;
    }
    await DeliverymanFinanceService.getDeliveryManDetails(deliverymanId, weekRange);
    navigate(`/deliveryman-details/${deliverymanId}/${encodeURIComponent(weekRange)}`);
  };

  const handleSearch = (value) => {
    setSearchText(value);
    setPagination((prev) => ({ ...prev, page: 1 }));
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
      key: 'orders_count',
      align: 'center',
      render: (_, record) => record.weekly_reports?.[0]?.statistics?.orders_count ?? 0,
    },
    {
      title: 'Total Price',
      key: 'total_price',
      align: 'right',
      render: (_, record) => `$${record.weekly_reports?.[0]?.statistics?.total_price?.toFixed(2) ?? '0.00'}`,
    },
    {
      title: 'Total Commission',
      key: 'total_commission',
      align: 'right',
      render: (_, record) => `$${record.weekly_reports?.[0]?.statistics?.total_commission?.toFixed(2) ?? '0.00'}`,
    },
    {
      title: 'Total Discounts',
      key: 'total_discounts',
      align: 'right',
      render: (_, record) => `$${record.weekly_reports?.[0]?.statistics?.total_discounts?.toFixed(2) ?? '0.00'}`,
    },
    {
      title: 'Week Range',
      key: 'week_range',
      align: 'center',
      render: (_, record) => record.weekly_reports?.[0]?.week_range ?? 'N/A',
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) =>
        (record.status || record.weekly_reports?.[0]?.status || 'unpaid').charAt(0).toUpperCase() +
        (record.status || record.weekly_reports?.[0]?.status || 'unpaid').slice(1),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const recordStatus = (record.status || record.weekly_reports?.[0]?.status || 'unpaid').toLowerCase();
        if (recordStatus === 'unpaid') {
          return (
            <Space>
              <Button
                type="primary"
                icon={<EyeOutlined />}
                onClick={() => handleViewDetails(record)}
                disabled={!record.deliveryMan?.id || !record.weekly_reports?.[0]?.week_range}
                aria-label={`View details for ${record.deliveryMan?.firstname} ${record.weekly_reports?.[0]?.week_range}`}
              >
                View
              </Button>
              <Button
                className="btn-paid"
                icon={<CheckCircleOutlined />}
                onClick={() => handleMarkAsPaid(record)}
                aria-label="Mark as paid"
              >
                Mark Paid
              </Button>
              <Button
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleMarkAsCanceled(record)}
                aria-label="Mark as canceled"
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
            onClick={() => handleViewDetails(record)}
            disabled={!record.deliveryMan?.id || !record.weekly_reports?.[0]?.week_range}
            aria-label={`View details for ${record.deliveryMan?.firstname} ${record.weekly_reports?.[0]?.week_range}`}
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
      total: pagination.total,
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
                placeholder="Search deliveryman"
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
          <Title level={2} style={{ marginBottom: '24px' }}>
            Deliveryman Finance Overview
          </Title>
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
              description={searchText ? `No deliverymen found matching "${searchText}"` : `No ${activeTab} records found.`}
              type="info"
              showIcon
            />
          ) : (
            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey={(record) =>
                record.deliveryMan?.id && record.weekly_reports?.[0]?.week_range
                  ? `${record.deliveryMan.id}-${record.weekly_reports[0].week_range}`
                  : `row-${Math.random()}`
              }
              pagination={{
                current: pagination.page,
                pageSize: pagination.perPage,
                total: pagination.total,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50'],
              }}
              onChange={handleTableChange}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DeliverymanFinance;
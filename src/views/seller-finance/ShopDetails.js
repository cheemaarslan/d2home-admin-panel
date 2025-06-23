import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Spin, Alert, Table, Divider, Card, Row, Col, Button, message } from 'antd';
import { DownloadOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import download from 'downloadjs';
import SellerFinanceService from '../../services/seller-finance';

const { Title, Text, Paragraph } = Typography;

const FONT_FAMILY = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

const companyDetails = {
  name: 'D2Home',
  addressLine1: '10/12 Clarke St, Crows Nest NSW 2065, Australia',
  addressLine2: '',
  email: 'info@d2home.com',
  phone: '0292918313',
  abn: '',
};

// Error Boundary Component
class TableErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert
          message="Error Rendering Table"
          description={this.state.error?.message || 'An error occurred while rendering the orders table.'}
          type="error"
          showIcon
        />
      );
    }
    return this.props.children;
  }
}

// Normalize orders to array
const normalizeOrders = (orders) => {
  console.log('Normalizing orders:', orders);
  if (Array.isArray(orders)) {
    return orders.filter(order => order && typeof order === 'object' && order.id);
  }
  if (orders && typeof orders === 'object' && !Array.isArray(orders)) {
    return Object.values(orders).filter(order => order && typeof order === 'object' && order.id);
  }
  console.warn('Orders is invalid:', orders);
  return [];
};

const ShopDetails = () => {
  const { recordId } = useParams();
  const [shopData, setShopData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    console.log('Current URL:', window.location.pathname);
    console.log('Current recordId:', recordId);

    const fetchShopDetails = async () => {
      try {
        setLoading(true);
        const response = await SellerFinanceService.getShopDetails(recordId);
        console.log('API Response Data:', response);
        console.log('Orders structure:', response.orders);
        console.log('Is orders an array?', Array.isArray(response.orders));
        console.log('Normalized orders:', normalizeOrders(response.orders));
        if (response && response.shop && response.orders && response.total_commission !== undefined) {
          setShopData(response);
        } else {
          console.error('API response is missing expected fields:', {
            hasShop: !!response.shop,
            hasOrders: !!response.orders,
            hasTotalCommission: response.total_commission !== undefined,
          });
          throw new Error('API response is missing expected data fields (shop, orders, total_commission)');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch shop details');
        console.error('Error fetching shop details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopDetails();
  }, [recordId]);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const handleDownloadInvoice = async () => {
    if (!recordId) {
      message.error('Shop UUID is missing');
      return;
    }

    setDownloading(true);
    try {
      const blobData = await SellerFinanceService.downloadInvoice(recordId);
      download(blobData, `shop-invoice-${recordId}.pdf`, 'application/pdf');
      message.success('Invoice downloaded successfully');
    } catch (err) {
      console.error('Download failed:', err);
      message.error(err.message || 'Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7f7f7' }}><Spin size="large" /></div>;
  }

  if (error) {
    return <div style={{ padding: 24 }}><Alert message="Error Processing Report" description={error} type="error" showIcon /></div>;
  }

  if (!shopData) {
    return <div style={{ padding: 24 }}><Alert message="No Data" description="Required report data could not be loaded or is incomplete." type="warning" showIcon /></div>;
  }

  const derivedSellerDetails = {
    name: shopData.shop?.translation?.title || `${shopData.shop?.seller?.firstname || ''} ${shopData.shop?.seller?.lastname || ''}`.trim() || 'N/A',
    mobile: shopData.shop?.phone || 'N/A',
    email: shopData.shop?.seller?.email || shopData.shop?.email || 'N/A',
    address: shopData.shop?.translation?.address || 'N/A',
  };

  const normalizedOrders = normalizeOrders(shopData.orders);
  const orderDates = normalizedOrders.map(order => new Date(order.updated_at || order.created_at)).filter(date => !isNaN(date.valueOf()));
  const derivedInvoiceMeta = {
    invoiceNumber: '01',
    dateOfInvoice: formatDate(new Date()),
    billingPeriodStart: orderDates.length > 0 ? formatDate(new Date(Math.min.apply(null, orderDates))) : 'N/A',
    billingPeriodEnd: orderDates.length > 0 ? formatDate(new Date(Math.max.apply(null, orderDates))) : 'N/A',
  };

  const financialSummary = {
    totalSales: normalizedOrders.reduce((sum, order) => sum + (Number(order.total_price) || 0), 0),
    grossPlatformCommission: Number(shopData.total_commission) || 0,
    sumOfOrderDiscounts: normalizedOrders.reduce((sum, order) => sum + (Number(order.total_discount) || 0), 0),
    totalChargesAndDiscountsByPlatform: 0,
    netAmountPayableToSeller: 0,
  };

  financialSummary.totalChargesAndDiscountsByPlatform = financialSummary.grossPlatformCommission + financialSummary.sumOfOrderDiscounts;
  financialSummary.netAmountPayableToSeller = financialSummary.totalSales - financialSummary.totalChargesAndDiscountsByPlatform;

  const orderColumns = [
    { title: 'Serial No.', key: 'serial', render: (_, __, index) => <Text style={{ color: '#555' }}>{index + 1}</Text> },
    { title: 'Order No.', dataIndex: 'id', key: 'order_no', render: (id) => <Text style={{ color: '#555' }}>{id}</Text> },
    {
      title: 'Order Date', dataIndex: 'updated_at', key: 'order_date',
      render: (date) => <Text style={{ color: '#555' }}>{formatDate(date)}</Text>,
    },
    {
      title: 'Amount', dataIndex: 'total_price', key: 'amount', align: 'right',
      render: (price) => <Text strong style={{ color: '#333' }}>${(Number(price) || 0).toFixed(2)}</Text>,
    },
  ];

  const commonTextStyle = { color: '#555', lineHeight: 1.6, display: 'block' };
  const strongTextStyle = { color: '#333', fontWeight: 600, lineHeight: 1.6, display: 'block' };

  const financialTableRows = [
    { desc: 'Total Sale Amount', sub: '', total: financialSummary.totalSales, isBold: false },
    { desc: 'D2Home Commission:', sub: financialSummary.grossPlatformCommission, total: '', isBold: false },
    { desc: 'D2Home Discounts (site promotions):', sub: financialSummary.sumOfOrderDiscounts, total: '', isBold: false },
    { desc: 'Total D2Home Commission:', sub: '', total: financialSummary.totalChargesAndDiscountsByPlatform, isBold: true },
    { desc: 'Subtotal:', sub: '', total: financialSummary.netAmountPayableToSeller, isBold: true },
    { desc: 'The amount to be transferred:', sub: '', total: financialSummary.netAmountPayableToSeller, isBold: true, isFinal: true },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5', fontFamily: FONT_FAMILY }}>
      <Card style={{ maxWidth: 840, margin: '0 auto', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'right', padding: '20px 25px 10px 20px' }}>
          <Button type="primary" icon={<DownloadOutlined />} loading={downloading} onClick={handleDownloadInvoice}>
            Download Invoice
          </Button>
        </div>

        <div style={{ backgroundColor: '#f59e0b' }}>
          <Row align="middle" justify="space-between">
            <Col xs={24} md={12} style={{ padding: '20px 25px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{ color: 'white', fontWeight: 'bold', fontSize: '40px', padding: '2px' }}>
                    D2Home
                  </span>
                </div>
                <div>
                  <Text style={{ color: 'white', display: 'block', fontSize: '14px' }}>
                    <MailOutlined style={{ marginRight: 8, fontSize: 14 }} /> {companyDetails.email}
                  </Text>
                  <Text style={{ color: 'white', display: 'block', fontSize: 14 }}>
                    <PhoneOutlined style={{ marginRight: 8, fontSize: 14 }} /> {companyDetails.phone}
                  </Text>
                </div>
              </div>
            </Col>
            <Col xs={24} md={6} style={{ textAlign: 'right', height: '100%' }}>
              <img
                src="/assets/images/d2home-logo.png"
                alt="D2Home Logo"
                style={{ height: '100%', width: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Col>
          </Row>
        </div>

        <div style={{ padding: '0 25px' }}>
          <Divider style={{ margin: '25px 0' }} />
        </div>

        <Row gutter={[24, 24]} style={{ marginBottom: 25, padding: '0 25px' }}>
          <Col xs={24} md={12}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 14 }}>Invoice No:</Text>
              <Text style={{ fontSize: 14, marginLeft: 8 }}>#{derivedInvoiceMeta.invoiceNumber}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong style={{ fontSize: 14 }}>Invoice To:</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: 16 }}>{derivedSellerDetails.name}</Text>
            </div>
            <div>
              <Text style={{ fontSize: 14, display: 'block' }}>Phone: {derivedSellerDetails.mobile}</Text>
              <Text style={{ fontSize: 14, display: 'block' }}>Email: {derivedSellerDetails.email}</Text>
            </div>
          </Col>

          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 14 }}>Invoice Date:</Text>
              <Text style={{ fontSize: 14, marginLeft: 8 }}>{derivedInvoiceMeta.dateOfInvoice}</Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong style={{ fontSize: 14 }}>Pay To:</Text>
            </div>
            <div>
              <Text style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: 16 }}>{companyDetails.name}</Text>
            </div>
            <div>
              <Text style={{ fontSize: 14, display: 'block' }}>{companyDetails.addressLine1}</Text>
              <Text style={{ fontSize: 14, display: 'block' }}>{companyDetails.addressLine2}</Text>
            </div>
          </Col>
        </Row>

        <div style={{ padding: '0 25px', marginBottom: 25 }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
            <thead>
              <tr style={{ backgroundColor: '#e49000', color: '#000000', borderBottom: '2px solid black', border: '1px solid black' }}>
                <th style={{ padding: '10px 12px', border: '1px solid #e8e8e8', textAlign: 'left', color: '#333', fontWeight: 600 }}>Description</th>
                <th style={{ padding: '10px 12px', border: '1px solid #e8e8e8', textAlign: 'right', color: '#333', fontWeight: 600 }}>Sub Total</th>
                <th style={{ padding: '10px 12px', border: '1px solid #e8e8e8', textAlign: 'right', color: '#333', fontWeight: 600 }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {financialTableRows.map((row, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px 12px', border: '1px solid #e8e8e8', borderTop: index === 0 ? '1px solid #e8e8e8' : 'none', color: row.isBold ? '#333' : '#555', fontWeight: row.isBold ? 600 : 400 }}>
                    {row.desc}
                  </td>
                  <td style={{ padding: '10px 12px', border: '1px solid #e8e8e8', borderTop: index === 0 ? '1px solid #e8e8e8' : 'none', textAlign: 'right', color: '#555' }}>
                    {row.sub !== '' ? `$${Number(row.sub).toFixed(2)}` : ''}
                  </td>
                  <td style={{ padding: '10px 12px', border: '1px solid #e8e8e8', borderTop: index === 0 ? '1px solid #e8e8e8' : 'none', textAlign: 'right', color: row.isBold ? '#333' : '#555', fontWeight: row.isBold ? 600 : 400, fontSize: row.isFinal ? 15 : 13 }}>
                    {row.total !== '' ? `$${Number(row.total).toFixed(2)}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Paragraph style={{ marginBottom: 25, fontSize: 12, color: '#777', padding: '0 25px', lineHeight: 1.5 }}>
          This credit will be credited to your account in the next few days BAN: Michael transferred. If you have any questions about this credit, please contact our service centre [{companyDetails.email}]. Details of this credit are on the attached pages.
        </Paragraph>

        <div style={{ padding: '0 25px', marginBottom: 25 }}>
          <Title level={5} style={{ marginBottom: 12, color: '#333', fontWeight: 600 }}>Overview of individual orders - online payments</Title>
          <TableErrorBoundary>
            <Table
              columns={orderColumns}
              dataSource={normalizedOrders}
              rowKey="id"
              pagination={false}
              bordered
              size="middle"
              className="invoice-orders-table"
              summary={() => (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={3}>
                    <Text style={strongTextStyle}>Total:</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <Text style={{ ...strongTextStyle, fontSize: 14 }}>${financialSummary.totalSales.toFixed(2)}</Text>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              )}
            />
          </TableErrorBoundary>
        </div>

        <div style={{ textAlign: 'center', marginTop: 25, paddingTop: 20, paddingBottom: 20, borderTop: '1px solid #333', margin: '0 25px' }}>
          <Text style={{ fontSize: 14, color: '#555', lineHeight: 1.5 }}>
            Thank you for your business and your trust. It is our pleasure to work with you as a valued partner.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default ShopDetails;
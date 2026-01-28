import React, { useEffect, useState } from 'react';
import { Typography, Spin, Alert, Button, message } from 'antd';
import { DownloadOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from '@ant-design/icons';
import download from 'downloadjs';
import SellerFinanceService from '../../services/seller-finance';
import getInvoiceLogo from '../../helpers/getInvoiceLogo';
const { Title, Text, Paragraph } = Typography;

const FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'";

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
          message='Error Rendering Table'
          description={
            this.state.error?.message ||
            'An error occurred while rendering the orders table.'
          }
          type='error'
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
    return orders.filter(
      (order) => order && typeof order === 'object' && order.id,
    );
  }
  if (orders && typeof orders === 'object' && !Array.isArray(orders)) {
    return Object.values(orders).filter(
      (order) => order && typeof order === 'object' && order.id,
    );
  }
  console.warn('Orders is invalid:', orders);
  return [];
};

const ShopDetails = () => {
  const recordId = parseInt(window.location.pathname.split('/')[2], 10);
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
        if (response && response.shop && response.orders && 
            response.total_sales !== undefined && 
            response.total_commission !== undefined && 
            response.sum_of_order_discounts !== undefined && 
            response.total_charges_and_discounts !== undefined && 
            response.sub_total !== undefined && 
            response.net_amount_payable !== undefined) {
          setShopData(response);
        } else {
          console.error('API response is missing expected fields:', {
            hasShop: !!response.shop,
            hasOrders: !!response.orders,
            hasTotalSales: response.total_sales !== undefined,
            hasTotalCommission: response.total_commission !== undefined,
            hasSumOfOrderDiscounts: response.sum_of_order_discounts !== undefined,
            hasTotalChargesAndDiscounts: response.total_charges_and_discounts !== undefined,
            hasSubTotal: response.sub_total !== undefined,
            hasNetAmountPayable: response.net_amount_payable !== undefined,
          });
          throw new Error('API response is missing expected data fields');
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
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
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
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundColor: '#f7f7f7',
        }}
      >
        <Spin size='large' />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message='Error Processing Report'
          description={error}
          type='error'
          showIcon
        />
      </div>
    );
  }

  if (!shopData) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message='No Data'
          description='Required report data could not be loaded or is incomplete.'
          type='warning'
          showIcon
        />
      </div>
    );
  }

  const derivedSellerDetails = {
    name:
      shopData.shop?.translation?.title ||
      `${shopData.shop?.seller?.firstname || ''} ${shopData.shop?.seller?.lastname || ''}`.trim() ||
      'N/A',
    mobile: shopData.shop?.phone || 'N/A',
    email: shopData.shop?.seller?.email || shopData.shop?.email || 'N/A',
    address: shopData.shop?.translation?.address || 'N/A',
  };

  const normalizedOrders = normalizeOrders(shopData.orders);
  const orderDates = normalizedOrders
    .map((order) => new Date(order.updated_at || order.created_at))
    .filter((date) => !isNaN(date.valueOf()));
  const derivedInvoiceMeta = {
    invoiceNumber: recordId,
    dateOfInvoice: formatDate(new Date()),
    billingPeriodStart:
      orderDates.length > 0
        ? formatDate(new Date(Math.min.apply(null, orderDates)))
        : 'N/A',
    billingPeriodEnd:
      orderDates.length > 0
        ? formatDate(new Date(Math.max.apply(null, orderDates)))
        : 'N/A',
  };

  const financialTableRows = [
    {
      desc: 'Total Sale Amount',
      sub: '',
      total: shopData.total_sales,
      isBold: false,
    },
    {
      desc: 'D2Home App Fee:',
      sub: shopData.total_commission,
      total: '',
      isBold: false,
    },
    {
      desc: 'D2Home Discounts (site promotions):',
      sub: shopData.sum_of_order_discounts,
      total: '',
      isBold: false,
    },
    {
      desc: 'Total D2Home App Fee:',
      sub: '',
      total: shopData.total_charges_and_discounts,
      isBold: true,
    },
    {
      desc: 'Subtotal:',
      sub: '',
      total: shopData.sub_total,
      isBold: true,
    },
    {
      desc: 'Amount payable to the seller:',
      sub: '',
      total: shopData.net_amount_payable,
      isBold: true,
      isFinal: true,
    },
  ];

  return (
    <div
      style={{
        padding: '20px',
        backgroundColor: '#f0f2f5',
        fontFamily: FONT_FAMILY,
      }}
    >
      <div
        style={{
          maxWidth: 840,
          margin: '0 auto',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
          borderRadius: 8,
        }}
      >
        <div style={{ textAlign: 'right', padding: '20px 25px 10px 20px' }}>
          <Button
            type='primary'
            icon={<DownloadOutlined />}
            loading={downloading}
            onClick={handleDownloadInvoice}
          >
            Download Invoice
          </Button>
        </div>

        <div style={{ backgroundColor: '#f59e0b' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '20px 25px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span
                style={{
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '40px',
                  padding: '2px',
                }}
              >
                D2Home
              </span>
              <div>
                <Text
                  style={{ color: 'white', display: 'block', fontSize: '14px' }}
                >
                  <EnvironmentOutlined style={{ marginRight: 8, fontSize: 14 }} />{' '}
                  {companyDetails.addressLine1 || 'N/A'}
                </Text>
                <Text
                  style={{ color: 'white', display: 'block', fontSize: '14px' }}
                >
                  <EnvironmentOutlined style={{ marginRight: 8, fontSize: 14 }} />{' '}
                  {companyDetails.addressLine2 || 'N/A'}
                </Text>
                <Text
                  style={{ color: 'white', display: 'block', fontSize: '14px' }}
                >
                  <MailOutlined style={{ marginRight: 8, fontSize: 14 }} />{' '}
                  {companyDetails.email}
                </Text>
                <Text
                  style={{ color: 'white', display: 'block', fontSize: 14 }}
                >
                  <PhoneOutlined style={{ marginRight: 8, fontSize: 14 }} />{' '}
                  {companyDetails.phone}
                </Text>
              </div>
            </div>
            <img
              src={getInvoiceLogo()}
              alt='D2Home Logo'
              style={{
                height: 100,
                width: 100,
                objectFit: 'cover',
                borderRadius: '50%',
              }}
            />
          </div>
        </div>

        <div style={{ padding: '0 25px' }}>
          <hr style={{ margin: '25px 0', border: '1px solid #e8e8e8' }} />
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 24,
            marginBottom: 25,
            padding: '0 25px',
          }}
        >
          <div style={{ flex: '1 1 300px' }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 14 }}>
                Invoice No:
              </Text>
              <Text style={{ fontSize: 14, marginLeft: 8 }}>
                #100{derivedInvoiceMeta.invoiceNumber}
              </Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong style={{ fontSize: 14 }}>
                Invoice To:
              </Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text
                style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: 16 }}
              >
                {derivedSellerDetails.name}
              </Text>
            </div>
            <div>
              <Text style={{ fontSize: 14, display: 'block' }}>
                Phone: {derivedSellerDetails.mobile}
              </Text>
              <Text style={{ fontSize: 14, display: 'block' }}>
                Email: {derivedSellerDetails.email}
              </Text>
            </div>
          </div>

          <div style={{ flex: '1 1 300px', textAlign: 'right' }}>
            <div style={{ marginBottom: 16 }}>
              <Text strong style={{ fontSize: 14 }}>
                Invoice Date:
              </Text>
              <Text style={{ fontSize: 14, marginLeft: 8 }}>
                {derivedInvoiceMeta.dateOfInvoice}
              </Text>
            </div>
            <div style={{ marginBottom: 8 }}>
              <Text strong style={{ fontSize: 14 }}>
                Pay To:
              </Text>
            </div>
            <div>
              <Text
                style={{ color: '#f59e0b', fontWeight: 'bold', fontSize: 16 }}
              >
                {companyDetails.name}
              </Text>
            </div>
            <div>
              <Text style={{ fontSize: 14, display: 'block' }}>
                {companyDetails.addressLine1}
              </Text>
              <Text style={{ fontSize: 14, display: 'block' }}>
                {companyDetails.addressLine2}
              </Text>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 25px', marginBottom: 25 }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              fontSize: 13,
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#e49000' }}>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'left',
                    color: '#333',
                    fontWeight: 600,
                    borderBottom: '3px solid black',
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'right',
                    color: '#333',
                    fontWeight: 600,
                    borderBottom: '3px solid black',
                  }}
                >
                  Sub Total
                </th>
                <th
                  style={{
                    padding: '10px 12px',
                    textAlign: 'right',
                    color: '#333',
                    fontWeight: 600,
                    borderBottom: '3px solid black',
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {financialTableRows.map((row, index) => (
                <tr key={index}>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid black',
                      color: row.isBold ? '#333' : '#555',
                      fontWeight: row.isBold ? 600 : 400,
                    }}
                  >
                    {row.desc}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      textAlign: 'right',
                      color: '#555',
                      borderBottom: '1px solid black',
                    }}
                  >
                    {row.sub !== '' ? `$${Number(row.sub).toFixed(2)}` : ''}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      textAlign: 'right',
                      color: row.isBold ? '#333' : '#555',
                      fontWeight: row.isBold ? 600 : 400,
                      fontSize: row.isFinal ? '15px' : '13px',
                      borderBottom: '1px solid black',
                    }}
                  >
                    {row.total !== '' ? `$${Number(row.total).toFixed(2)}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '0 25px', marginBottom: 25 }}>
          <Title
            level={5}
            style={{ marginBottom: 12, color: '#333', fontWeight: 600 }}
          >
            Overview of individual orders - online payments
          </Title>
          <TableErrorBoundary>
            <table
              style={{
                width: '100%',
                borderCollapse: 'separate',
                borderSpacing: 0,
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#e49000' }}>
                  <th
                    style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      color: '#333',
                      fontWeight: 600,
                      borderBottom: '3px solid black',
                    }}
                  >
                    Serial No.
                  </th>
                  <th
                    style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      color: '#333',
                      fontWeight: 600,
                      borderBottom: '3px solid black',
                    }}
                  >
                    Order No.
                  </th>
                  <th
                    style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      color: '#333',
                      fontWeight: 600,
                      borderBottom: '3px solid black',
                    }}
                  >
                    Order Date
                  </th>
                  <th
                    style={{
                      padding: '10px 12px',
                      textAlign: 'right',
                      color: '#333',
                      fontWeight: 600,
                      borderBottom: '3px solid black',
                    }}
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {normalizedOrders.map((order, idx) => (
                  <tr key={order.id}>
                    <td
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid black',
                        color: '#555',
                      }}
                    >
                      {idx + 1}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid black',
                        color: '#555',
                      }}
                    >
                      {order.id}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        borderBottom: '1px solid black',
                        color: '#555',
                      }}
                    >
                      {formatDate(order.updated_at)}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        textAlign: 'right',
                        borderBottom: '1px solid black',
                        color: '#333',
                        fontWeight: 600,
                      }}
                    >
                      ${Number(order.total_price).toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan={3}
                    style={{
                      padding: '10px 12px',
                      textAlign: 'right',
                      color: '#333',
                      fontWeight: 600,
                      borderBottom: '1px solid black',
                    }}
                  >
                    Total:
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      textAlign: 'right',
                      color: '#333',
                      fontWeight: 600,
                      fontSize: '14px',
                      borderBottom: '1px solid black',
                    }}
                  >
                    ${Number(shopData.total_sales).toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </TableErrorBoundary>
        </div>

        <Paragraph
          style={{
            marginBottom: 25,
            fontSize: '12px',
            color: '#777',
            padding: '0 25px',
            lineHeight: 1.5,
          }}
        >
          This credit will be credited to your account in the next few days BAN:
          Michael transferred. If you have any questions about your receipt,
          please contact our service center [{companyDetails.email}]. Details of
          this invoice can be found on the attached page.
        </Paragraph>

        <div
          style={{
            textAlign: 'center',
            marginTop: 30,
            padding: '20px 25px',
            borderTop: '1px solid #e8e8e8',
          }}
        >
          <Text style={{ fontSize: '12px', color: '#777', lineHeight: 1.5 }}>
            Thank you for your business and your trust. It is our pleasure to
            work with you as a valued shop partner.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;

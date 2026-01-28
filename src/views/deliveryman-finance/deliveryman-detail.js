import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getInvoiceLogo from '../../helpers/getInvoiceLogo';
import {
  Typography,
  Spin,
  Alert,
  Table,
  Divider,
  Card,
  Row,
  Col,
  Button,
  message,
} from 'antd'; // Added message to imports
import { DownloadOutlined } from '@ant-design/icons';
import download from 'downloadjs';
import DeliverymanFinanceService from '../../services/deliveryman-finance';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

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

const DeliveryManDetails = () => {
  const { id, weekRange } = useParams();
  const week_range = decodeURIComponent(weekRange);

  const [deliveryManData, setDeliveryManData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    const fetchDeliveryManDetails = async () => {
      try {
        setLoading(true);
        const response = await DeliverymanFinanceService.getDeliveryManDetails(
          id,
          week_range,
        );
        console.log('API Response Data:', response);
        if (
          response &&
          response.deliveryMan &&
          response.orders &&
          response.total_commission !== undefined &&
          response.sub_total !== undefined &&
          response.total_delivery_man_fee !== undefined
        ) {
          setDeliveryManData(response);
        } else {
          console.error('API response is missing expected fields:', {
            hasDeliveryMan: !!response.deliveryMan,
            hasOrders: !!response.orders,
            hasTotalCommission: response.total_commission !== undefined,
            hasSubTotal: response.sub_total !== undefined,
            hasTotalDeliveryManFee: response.total_delivery_man_fee !== undefined,
          });
          throw new Error(
            'API response is missing expected data fields (deliveryMan, orders, total_commission)',
          );
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch delivery man details');
        console.error('Error fetching delivery man details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDeliveryManDetails();
    } else {
      setError('Delivery Man ID is missing in URL');
      setLoading(false);
    }
  }, [id, week_range]);

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
  if (!id) {
    message.error('Delivery Man ID is missing');
    return;
  }

  setDownloading(true);
  try {
    const response = await DeliverymanFinanceService.downloadInvoice(
      id,
      {},
      week_range
    );

    // Create a Blob from the response data
    const blob = new Blob([response], { type: 'application/pdf' });
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = url;
    a.download = `delivery-man-invoice-${id}-${week_range || 'all'}.pdf`;
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    message.success('Invoice downloaded successfully');
  } catch (err) {
    console.error('Download failed:', err);
    message.error(err.response?.data?.message || err.message || 'Failed to download invoice');
  } finally {
    setDownloading(false);
  }
};
  let derivedSellerDetails = {
    name: 'N/A',
    mobile: 'N/A',
    email: 'N/A',
    address: 'N/A',
  };
  let derivedInvoiceMeta = {
    invoiceNumber: 'N/A',
    dateOfInvoice: formatDate(new Date()),
    billingPeriodStart: 'N/A',
    billingPeriodEnd: 'N/A',
  };

  // Initialize financialSummary structure with more descriptive names for clarity
  let financialSummary = {
    totalSales: 0,
    // Gross commission from API (e.g., $16 in your example)
    grossPlatformCommission: 0,
    // Sum of order.total_discount (e.g., $6 in your example)
    sumOfOrderDiscounts: 0,
    // Sum of grossPlatformCommission + sumOfOrderDiscounts (e.g., $22 in your example)
    // This will be displayed in the row labeled "Total ShoppingBabes Commission:"
    totalChargesAndDiscountsByPlatform: 0,
    // Net amount payable to seller: totalSales - totalChargesAndDiscountsByPlatform
    // This will be used for "Sub Total:" and "The amount to be transferred:"
    netAmountPayableToSeller: 0,
  };

  if (deliveryManData) {
    derivedSellerDetails = {
      name:
        deliveryManData.deliveryMan?.translation?.title ||
        `${deliveryManData.deliveryMan?.firstname || ''} ${deliveryManData.deliveryMan?.lastname || ''}`.trim() ||
        'N/A',
      mobile: deliveryManData.deliveryMan?.phone || 'N/A',
      email: deliveryManData.deliveryMan?.email || 'N/A',
      address: deliveryManData.deliveryMan?.translation?.address || 'N/A',
    };

    derivedInvoiceMeta.invoiceNumber = deliveryManData.recordId || 'N/A';

    if (deliveryManData.orders && deliveryManData.orders.length > 0) {
      const orderDates = deliveryManData.orders.map(
        (order) => new Date(order.updated_at || order.created_at),
      );
      if (orderDates.length > 0) {
        const validOrderDates = orderDates.filter(
          (date) => !isNaN(date.valueOf()),
        );
        if (validOrderDates.length > 0) {
          const minDate = new Date(Math.min.apply(null, validOrderDates));
          const maxDate = new Date(Math.max.apply(null, validOrderDates));
          derivedInvoiceMeta.billingPeriodStart = formatDate(minDate);
          derivedInvoiceMeta.billingPeriodEnd = formatDate(maxDate);
        }
      }
    }

    // --- Corrected Financial Calculations based on your LATEST instruction ---
    financialSummary.totalSales = Array.isArray(deliveryManData.orders)
      ? deliveryManData.orders.reduce(
          (sum, order) => sum + (Number(order.total_price) || 0),
          0,
        )
      : 0;

    // This is the "commission $16.00" part from your example
    financialSummary.grossPlatformCommission =
      Number(deliveryManData.total_commission) || 0;

    // This is the "discount $6.00" part from your example
    financialSummary.sumOfOrderDiscounts = Array.isArray(deliveryManData.orders)
      ? deliveryManData.orders.reduce(
          (sum, order) => sum + (Number(order.total_discount) || 0),
          0,
        )
      : 0;

    // User: "make sum of commission and discount" - this is the total amount deducted by the platform.
    // (e.g., $16 + $6 = $22)
    financialSummary.totalChargesAndDiscountsByPlatform =
      financialSummary.grossPlatformCommission +
      financialSummary.sumOfOrderDiscounts;

    // User: "subtract this from total [sales]" - this is the net amount payable to the seller.
    financialSummary.netAmountPayableToSeller =
      financialSummary.totalSales -
      financialSummary.totalChargesAndDiscountsByPlatform;
    // --- End of Corrected Financial Calculations ---
  }

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

  if (
    !deliveryManData ||
    !deliveryManData.deliveryMan ||
    !deliveryManData.orders ||
    deliveryManData.orders.length === 0
  ) {
    return (
      <div style={{ padding: 24 }}>
        <Alert
          message='No Data'
          description='Required report data could not be loaded or is incomplete. here'
          type='warning'
          showIcon
        />
      </div>
    );
  }

  const orderColumns = [
    {
      title: 'Serial No.',
      key: 'serial',
      render: (_, __, index) => (
        <Text style={{ color: '#555' }}>{index + 1}</Text>
      ),
    },
    {
      title: 'Order No.',
      dataIndex: 'id',
      key: 'order_no',
      render: (id) => <Text style={{ color: '#555' }}>{id}</Text>,
    },
    {
      title: 'Order Date',
      dataIndex: 'updated_at',
      key: 'order_date',
      render: (date) => (
        <Text style={{ color: '#555' }}>{formatDate(date)}</Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'total_price',
      key: 'amount',
      align: 'right',
      render: (price) => (
        <Text strong style={{ color: '#333' }}>
          ${(Number(price) || 0).toFixed(2)}
        </Text>
      ),
    },
  ];

  const commonTextStyle = { color: '#555', lineHeight: 1.6, display: 'block' };
  const strongTextStyle = {
    color: '#333',
    fontWeight: 600,
    lineHeight: 1.6,
    display: 'block',
  };

  // Define the financial table rows using the calculated financialSummary
  // and your specified row structure.
  const financialTableRows = [
    {
      desc: 'Total DeliveryMan Amount',
      sub: '',
      total: deliveryManData.total_delivery_man_fee || 0,
      isBold: false,
    },
    {
      desc: 'D2Home App Fee:',
      sub: deliveryManData.total_commission || 0,
      total: '',
      isBold: false,
    },
    {
      desc: 'D2Home Discounts (platform promotions):',
      sub: financialSummary.sumOfOrderDiscounts,
      total: '',
      isBold: false,
    },
    // This line's 'total' now reflects the SUM of gross commission and sum of order discounts.
    {
      desc: 'Total D2Home App Fee:',
      sub: '',
      total: financialSummary.totalChargesAndDiscountsByPlatform,
      isBold: true,
    },
    // 'Sub Total' now reflects the net amount payable after the combined charges/discounts.
    {
      desc: 'Sub Total:',
      sub: '',
      total: deliveryManData.sub_total || 0,
      isBold: true,
    },
    // 'The amount to be transferred' also reflects the net amount payable.
    {
      desc: 'Amount payable to the delivery man:',
      sub: '',
      total: deliveryManData.total_delivery_man_fee || 0,
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
      <Card
        style={{
          maxWidth: 840,
          margin: '0 auto',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }}
      >
        {/* MODIFICATION START: Download Invoice Button moved here */}
        <div style={{ textAlign: 'right', padding: '20px 25px 10px 25px' }}>
          <Button
            type='primary'
            icon={<DownloadOutlined />}
            loading={downloading}
            onClick={handleDownloadInvoice}
          >
            Download Invoice
          </Button>
        </div>
        {/* MODIFICATION END */}

        <div style={{ backgroundColor: '#f59e0b' }}>
          <Row align='middle' justify='space-between'>
            {/* Left Side */}
            <Col xs={24} md={12} style={{ padding: '20px 25px' }}>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
              >
                {/* D2Home Text */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <span
                    style={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '40px',
                      padding: '0 8px',
                    }}
                  >
                    D2Home
                  </span>
                </div>
                {/* Contact Info */}
                <div>
                <Text
                    style={{
                      color: 'white',
                      display: 'block',
                      fontSize: '14px',
                    }}
                  >
                    <EnvironmentOutlined
                      style={{ marginRight: 8, fontSize: '14px' }}
                    />{' '}
                    {companyDetails.addressLine1}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      display: 'block',
                      fontSize: '14px',
                    }}
                  >
                    <EnvironmentOutlined
                      style={{ marginRight: 8, fontSize: '14px' }}
                    />{' '}
                    {companyDetails.addressLine2 || 'N/A'}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      display: 'block',
                      fontSize: '14px',
                    }}
                  >
                    <MailOutlined
                      style={{ marginRight: 8, fontSize: '14px' }}
                    />{' '}
                    {companyDetails.email}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      display: 'block',
                      fontSize: '14px',
                    }}
                  >
                    <PhoneOutlined
                      style={{ marginRight: 8, fontSize: '14px' }}
                    />{' '}
                    {companyDetails.phone}
                  </Text>
                </div>
              </div>
            </Col>

            {/* Right Side (Logo) */}
            <Col xs={24} md={6} style={{ textAlign: 'center', height: '100%' }}>
              <img
                src={getInvoiceLogo()} // Use the actual logo URL returned by the function
                alt='D2Home Logo'
                style={{
                  height: 100,
                  width: 100,
                  objectFit: 'cover',
                  borderRadius: '50%',
                }}
              />
            </Col>
          </Row>
        </div>

        <div style={{ padding: '0 25px' }}>
          {' '}
          <Divider style={{ margin: '25px 0' }} />{' '}
        </div>

        <Row gutter={[24, 24]} style={{ marginBottom: 25, padding: '0 25px' }}>
          {/* Left Column */}
          <Col xs={24} md={12}>
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
          </Col>

          {/* Right Column */}
          <Col xs={24} md={12} style={{ textAlign: 'right' }}>
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
          </Col>
        </Row>

        <div style={{ padding: '0 25px', marginBottom: 25 }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              fontSize: '13px',
            }}
          >
            <thead>
              <tr
                style={{ backgroundColor: '#e49000' }}
              >
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
                    textAlign: 'left',
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
                    textAlign: 'left',
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
                      color: '#555',
                    }}
                  >
                    {row.desc}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid black',
                      color: '#555',
                    }}
                  >
                    {row.sub !== '' ? `$${Number(row.sub).toFixed(2)}` : ''}
                  </td>
                  <td
                    style={{
                      padding: '10px 12px',
                      borderBottom: '1px solid black',
                      color: '#555',
                    }}
                  >
                    {row.total !== '' ? `$${Number(row.total).toFixed(2)}` : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

        <div style={{ padding: '0 25px', marginBottom: 25 }}>
          <Title
            level={5}
            style={{ marginBottom: 12, color: '#333', fontWeight: 600 }}
          >
            Overview of individual orders - online payments
          </Title>
          <table
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              fontSize: '13px',
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
              {(deliveryManData.orders || []).map((order, idx) => (
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
                      borderBottom: '1px solid black',
                      color: '#333',
                      textAlign: 'right',
                      fontWeight: 600,
                    }}
                  >
                    ${(Number(order.delivery_fee) || 0).toFixed(2)}
                  </td>
                </tr>
              ))}
              <tr style={{ backgroundColor: '#fafafa' }}>
                <td
                  colSpan={3}
                  style={{
                    padding: '10px 12px',
                    color: '#333',
                    fontWeight: 600,
                    textAlign: 'right',
                    borderBottom: 'none',
                  }}
                >
                  Total:
                </td>
                <td
                  style={{
                    padding: '10px 12px',
                    color: '#333',
                    fontWeight: 600,
                    textAlign: 'right',
                    borderBottom: 'none',
                    fontSize: '14px',
                  }}
                >
                  ${deliveryManData.total_delivery_man_fee.toFixed(2)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          style={{
            textAlign: 'center',
            marginTop: 30,
            paddingTop: 20,
            paddingBottom: 20,
            borderTop: '1px solid #e8e8e8',
            margin: '0 25px',
          }}
        >
          <Text style={{ fontSize: '12px', color: '#777', lineHeight: 1.5 }}>
            Thank you for your business and your trust. It is our pleasure to
            work with you as a valued shop partner.
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default DeliveryManDetails;
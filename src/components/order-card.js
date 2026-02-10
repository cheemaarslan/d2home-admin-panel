import React, { useState, useEffect } from 'react';
import {
  DownloadOutlined,
  EyeOutlined,
  UserOutlined,
  CarOutlined,
  DollarOutlined,
  PayCircleOutlined,
  BorderlessTableOutlined,
  DeleteOutlined,
  FieldTimeOutlined,
  EditOutlined,
  ClockCircleOutlined,
  RadarChartOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { Avatar, Card, List, Skeleton, Space, Tag } from 'antd';
import numberToPrice from '../helpers/numberToPrice';
import { BiMap } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import useDemo from '../helpers/useDemo';
import { shallowEqual, useSelector } from 'react-redux';

const { Meta } = Card;

const OrderCard = ({
  data: item,
  goToShow,
  loading,
  setLocationsMap,
  setId,
  setIsModalVisible,
  setText,
  setDowloadModal,
  setTabType,
  setIsTransactionModalOpen,
}) => {
  const { t } = useTranslation();
  const lastTransaction = item.transactions?.at(-1) || {};
  const [showDriverAlert, setShowDriverAlert] = useState(false);
  const [showShopAlert, setShowShopAlert] = useState(false);
  
  // Get settings from Redux
  const { settings } = useSelector(
    (state) => state.globalSettings,
    shallowEqual
  );

  // Get timeout values in minutes from settings
  const deliverymanTimeoutMinutes = Number(settings?.deliveryman_order_acceptance_timeout) || 2;
  const shopTimeoutMinutes = Number(settings?.shop_order_acceptance_timeout) || 1;

  // Calculate if DELIVERYMAN timeout has passed
  useEffect(() => {
    // Check if order meets basic conditions
    const meetsBasicConditions = 
      item?.status === 'accepted' && 
      (item?.delivery_type === 'delivery' || item?.delivery_type === 'Delivery') && 
      !item?.deliveryman;

    if (!meetsBasicConditions) {
      setShowDriverAlert(false);
      return;
    }

    // Use accepted_at if available, otherwise use updated_at or created_at
    const referenceTime = item?.accepted_at || item?.updated_at || item?.created_at;
    
    if (!referenceTime) {
      setShowDriverAlert(false);
      return;
    }

    const checkTimeout = () => {
      const orderTime = moment(referenceTime);
      const currentTime = moment();
      const minutesPassed = currentTime.diff(orderTime, 'minutes');
      
      console.log('=== DELIVERYMAN CHECK ===');
      console.log('Order ID:', item.id);
      console.log('Reference Time:', referenceTime);
      console.log('Minutes Passed:', minutesPassed);
      console.log('Timeout Minutes:', deliverymanTimeoutMinutes);
      console.log('Should Show Driver Alert:', minutesPassed >= deliverymanTimeoutMinutes);
      
      if (minutesPassed >= deliverymanTimeoutMinutes) {
        setShowDriverAlert(true);
      } else {
        setShowDriverAlert(false);
      }
    };

    // Check immediately
    checkTimeout();

    // Set up interval to check every 30 seconds
    const interval = setInterval(checkTimeout, 30000);

    return () => clearInterval(interval);
  }, [item, deliverymanTimeoutMinutes]);

  // Calculate if SHOP timeout has passed (check from created_at)
  useEffect(() => {
    // Check if order is still in "new" status
    const meetsShopConditions = item?.status === 'new';

    if (!meetsShopConditions) {
      setShowShopAlert(false);
      return;
    }

    const createdTime = item?.created_at;
    
    if (!createdTime) {
      setShowShopAlert(false);
      return;
    }

    const checkShopTimeout = () => {
      const orderTime = moment(createdTime);
      const currentTime = moment();
      const minutesPassed = currentTime.diff(orderTime, 'minutes');
      
      
      
      if (minutesPassed >= shopTimeoutMinutes) {
        setShowShopAlert(true);
      } else {
        setShowShopAlert(false);
      }
    };

    checkShopTimeout();
    const interval = setInterval(checkShopTimeout, 30000);
    return () => clearInterval(interval);
  }, [item, shopTimeoutMinutes]);

  // Logic to check for missing deliveryman
  const isAwaitingDeliveryman = 
    item?.status === 'accepted' && 
    (item?.delivery_type === 'delivery' || item?.delivery_type === 'Delivery') && 
    !item?.deliveryman &&
    showDriverAlert;

  // Logic to check if shop hasn't accepted
  const isShopNotAccepted = 
    item?.status === 'new' && 
    showShopAlert;

  // --- AMAZING STYLES START ---
  const amazingStyles = `
    @keyframes gradientFlow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    @keyframes pulseGlow {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 79, 0.7); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(255, 77, 79, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255, 77, 79, 0); }
    }
    @keyframes shopPulse {
      0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(250, 173, 20, 0.7); }
      70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(250, 173, 20, 0); }
      100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(250, 173, 20, 0); }
    }
    .amazing-label {
      background: linear-gradient(-45deg, #ff4d4f, #ff7875, #faad14, #ff4d4f);
      background-size: 400% 400%;
      animation: gradientFlow 3s ease infinite, pulseGlow 2s infinite;
      color: white !important;
      border: none !important;
      font-weight: 800;
      border-radius: 20px;
      padding: 4px 12px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-size: 12px;
    }
    .shop-alert-label {
      background: linear-gradient(-45deg, #faad14, #ffc53d, #faad14, #ff7875);
      background-size: 400% 400%;
      animation: gradientFlow 3s ease infinite, shopPulse 2s infinite;
      color: white !important;
      border: none !important;
      font-weight: 800;
      border-radius: 20px;
      padding: 4px 12px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      font-size: 12px;
    }
  `;
  // --- AMAZING STYLES END ---

  const data = [
    {
      title: 'Client',
      icon: <UserOutlined />,
      data: item?.user
        ? `${item.user?.firstname || '-'} ${item.user?.lastname || '-'}`
        : t('deleted.user'),
    },
    {
      title: 'Deliveryman',
      icon: <CarOutlined />,
      data: isAwaitingDeliveryman ? (
        <Tag className="amazing-label">
          <RadarChartOutlined spin style={{ marginRight: 6, fontSize: '14px' }} />
          {t('Searching Driver...')}
        </Tag>
      ) : (
        `${item.deliveryman?.firstname || '-'} ${item.deliveryman?.lastname || '-'}`
      ),
    },
    {
      title: 'Amount',
      icon: <DollarOutlined />,
      data: numberToPrice(
        item?.total_price,
        item.currency?.symbol,
        item?.currency?.position,
      ),
    },
    {
      title: 'Last Payment type',
      icon: <PayCircleOutlined />,
      data: lastTransaction?.payment_system?.tag || '-',
    },
    {
      title: 'Last payment status',
      icon: <BorderlessTableOutlined />,
      data: lastTransaction?.status ? (
        <div
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            setIsTransactionModalOpen(lastTransaction);
          }}
        >
          {lastTransaction?.status}{' '}
          <EditOutlined disabled={item?.deleted_at} />
        </div>
      ) : (
        '-'
      ),
    },
    {
      title: 'Delivery date',
      icon: <FieldTimeOutlined />,
      data: moment(item?.delivery_date).format('YYYY-MM-DD') || '-',
    },
    {
      title: 'Created at',
      icon: <FieldTimeOutlined />,
      data: moment(item?.created_at).format('YYYY-MM-DD') || '-',
    },
  ];
  const { isDemo } = useDemo();
  const actions = [
    <BiMap
      size={20}
      onClick={(e) => {
        e.stopPropagation();
        setLocationsMap(item.id);
      }}
    />,
    <DeleteOutlined
      onClick={(e) => {
        if (isDemo) {
          toast.warning(t('cannot.work.demo'));
          return;
        }
        e.stopPropagation();
        setId([item.id]);
        setIsModalVisible(true);
        setText(true);
        setTabType(item.status);
      }}
    />,
    <DownloadOutlined
      onClick={(e) => {
        e.stopPropagation();
        setDowloadModal(item.id);
      }}
    />,
    <EyeOutlined
      onClick={(e) => {
        e.stopPropagation();
        goToShow(item);
      }}
    />,
  ];

  return (
    <Card 
      actions={actions} 
      className='order-card'
      style={{
        borderColor: isAwaitingDeliveryman ? '#ffccc7' : isShopNotAccepted ? '#fff7e6' : undefined,
        borderWidth: (isAwaitingDeliveryman || isShopNotAccepted) ? '2px' : undefined,
      }}
    >
      {/* Inject styles when needed */}
      {(isAwaitingDeliveryman || isShopNotAccepted) && <style>{amazingStyles}</style>}

      <Skeleton loading={loading} avatar active>
        <Space direction="vertical" size={4} style={{ width: '100%', marginBottom: 8 }}>
          {/* Shop Alert - Show first */}
          {isShopNotAccepted && (
            <Tag className="shop-alert-label">
              <ShopOutlined spin style={{ marginRight: 6, fontSize: '14px' }} />
              {t('Shop Not Accepted Order')}
            </Tag>
          )}
          
          {/* Deliveryman Alert */}
          {isAwaitingDeliveryman && (
            <Tag 
              color="#ff4d4f" 
              style={{ 
                marginBottom: 0,
                fontSize: '13px',
                padding: '4px 10px',
                fontWeight: 'bold',
                animation: 'pulseGlow 2s infinite' 
              }}
            >
              <ClockCircleOutlined spin style={{ marginRight: 5 }}/>
              {t('Pending Driver Assignment')}
            </Tag>
          )}
        </Space>

        <Space direction="vertical" size={8} style={{ width: '100%' }}>
          <Meta
            avatar={<Avatar src={item?.shop?.logo_img} />}
            description={`#${item.id}`}
            title={item?.shop?.translation?.title}
          />
        </Space>
        <List
          itemLayout='horizontal'
          dataSource={data}
          renderItem={(item, key) => {
            return (
              <List.Item key={key}>
                <Space>
                  {item?.icon}
                  <span>
                    {`${item?.title}:`}
                    {item?.data}
                  </span>
                </Space>
              </List.Item>
            );
          }}
        />
      </Skeleton>
    </Card>
  );
};

export default OrderCard;
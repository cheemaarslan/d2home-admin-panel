import React, { useState, useEffect } from 'react';
import {
  DownloadOutlined,
  EyeOutlined,
  UserOutlined,
  ContainerOutlined,
  CarOutlined,
  DollarOutlined,
  PayCircleOutlined,
  BorderlessTableOutlined,
  FieldTimeOutlined,
  DeleteOutlined,
  EditOutlined,
  RadarChartOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { Avatar, Card, List, Skeleton, Space, Tag } from 'antd';
import { IMG_URL } from '../configs/app-global';
import numberToPrice from '../helpers/numberToPrice';
import moment from 'moment';
import { BiMap } from 'react-icons/bi';
import useDemo from '../helpers/useDemo';
import { useTranslation } from 'react-i18next';
import { shallowEqual, useSelector } from 'react-redux';

const { Meta } = Card;

const OrderCardSeller = ({
  data: item,
  goToShow,
  loading,
  setLocationsMap,
  setId,
  setIsModalVisible,
  setText,
  setDowloadModal,
  setType,
  orderType,
  setIsTransactionModalOpen,
}) => {
  const { isDemo, demoFunc } = useDemo();
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
  const shopTimeoutMinutes = Number(settings?.shop_order_acceptance_timeout) || 2;

  // Calculate if DELIVERYMAN timeout has passed (check from updated_at or accepted_at)
  useEffect(() => {
    // Check if order meets basic conditions for deliveryman alert
    const meetsDriverConditions = 
      !orderType && 
      item?.status === 'accepted' && 
      (item?.delivery_type === 'delivery' || item?.delivery_type === 'Delivery') && 
      !item?.deliveryman;

    if (!meetsDriverConditions) {
      setShowDriverAlert(false);
      return;
    }

    const referenceTime = item?.accepted_at || item?.updated_at || item?.created_at;
    
    if (!referenceTime) {
      setShowDriverAlert(false);
      return;
    }

    const checkDriverTimeout = () => {
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

    checkDriverTimeout();
    const interval = setInterval(checkDriverTimeout, 30000);
    return () => clearInterval(interval);
  }, [item, deliverymanTimeoutMinutes, orderType]);

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
      
      console.log('=== SHOP CHECK ===');
      console.log('Order ID:', item.id);
      console.log('Created Time:', createdTime);
      console.log('Minutes Passed:', minutesPassed);
      console.log('Timeout Minutes:', shopTimeoutMinutes);
      console.log('Should Show Shop Alert:', minutesPassed >= shopTimeoutMinutes);
      
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

  // --- LOGIC ---
  const isAwaitingDeliveryman = 
    !orderType && 
    item?.status === 'accepted' && 
    (item?.delivery_type === 'delivery' || item?.delivery_type === 'Delivery') && 
    !item?.deliveryman &&
    showDriverAlert;

  const isShopNotAccepted = 
    item?.status === 'new' && 
    showShopAlert;

  // --- AMAZING STYLES ---
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

  const data = [
    {
      title: 'Client',
      icon: <UserOutlined />,
      data: item?.user
        ? `${item.user?.firstname || '-'} ${item.user?.lastname || '-'}`
        : t('deleted.user'),
    },
    {
      title: 'Number of products',
      icon: <ContainerOutlined />,
      data: item?.order_details_count,
    },
    {
      title: orderType ? 'Table' : 'Deliveryman',
      icon: <CarOutlined />,
      data: orderType
        ? `${item?.table?.name || '-'}`
        : isAwaitingDeliveryman ? (
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
        item.total_price,
        item.currency?.symbol,
        item.currency?.position,
      ),
    },
    {
      title: 'Last Payment type',
      icon: <PayCircleOutlined />,
      data: lastTransaction?.payment_system?.tag || '-',
    },
    {
      title: 'Last Payment status',
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
      title: t('delivery.type'),
      icon: <FieldTimeOutlined />,
      data: item?.delivery_type || '-',
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

  return (
    <Card
      actions={[
        <BiMap
          size={20}
          onClick={(e) => {
            e.stopPropagation();
            setLocationsMap(item.id);
          }}
        />,
        <EyeOutlined key='setting' onClick={() => goToShow(item)} />,
        <DeleteOutlined
          onClick={(e) => {
            if (isDemo) {
              demoFunc();
              return;
            }
            e.stopPropagation();
            setId([item.id]);
            setIsModalVisible(true);
            setText(true);
            setType(item.status);
          }}
        />,
        <DownloadOutlined
          key='ellipsis'
          onClick={() => setDowloadModal(item.id)}
        />,
      ]}
      className='order-card'
      style={{
        borderColor: isAwaitingDeliveryman ? '#ffccc7' : isShopNotAccepted ? '#fff7e6' : undefined,
        borderWidth: (isAwaitingDeliveryman || isShopNotAccepted) ? '2px' : undefined,
      }}
    >
      {/* --- Style tag loads before the tags use it --- */}
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

        <Meta
          avatar={
            <Avatar src={IMG_URL + item.user?.img} icon={<UserOutlined />} />
          }
          description={`#${item.id}`}
          title={`${item.user?.firstname || '-'} ${item.user?.lastname || '-'}`}
        />
        <List
          itemLayout='horizontal'
          dataSource={data}
          renderItem={(item, key) => (
            <List.Item key={key}>
              <Space>
                {item?.icon}
                <span>
                  {`${item?.title}:`}
                  {item?.data}
                </span>
              </Space>
            </List.Item>
          )}
        />
      </Skeleton>
    </Card>
  );
};

export default OrderCardSeller;
import React from 'react';
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
  ClockCircleOutlined
} from '@ant-design/icons';
import { Avatar, Card, List, Skeleton, Space, Tag } from 'antd';
import { IMG_URL } from '../configs/app-global';
import numberToPrice from '../helpers/numberToPrice';
import moment from 'moment';
import { BiMap } from 'react-icons/bi';
import useDemo from '../helpers/useDemo';
import { useTranslation } from 'react-i18next';

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

  // --- LOGIC ---
  const isAwaitingDeliveryman = 
    !orderType && 
    item?.status === 'accepted' && 
    (item?.delivery_type === 'delivery' || item?.delivery_type === 'Delivery') && 
    !item?.deliveryman;

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
        borderColor: isAwaitingDeliveryman ? '#ffccc7' : undefined,
        borderWidth: isAwaitingDeliveryman ? '2px' : undefined,
      }}
    >
      {/* --- FIX: Style tag moved here so it loads before the tags use it --- */}
      {isAwaitingDeliveryman && <style>{amazingStyles}</style>}

      <Skeleton loading={loading} avatar active>
        {isAwaitingDeliveryman && (
            <Tag 
              color="#ff4d4f" 
              style={{ 
                marginBottom: 8,
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
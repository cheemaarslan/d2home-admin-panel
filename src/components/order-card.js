import React from 'react';
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
  RadarChartOutlined
} from '@ant-design/icons';
import { Avatar, Card, List, Skeleton, Space, Tag } from 'antd';
import numberToPrice from '../helpers/numberToPrice';
import { BiMap } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import useDemo from '../helpers/useDemo';

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

  // Logic to check for missing deliveryman
  const isAwaitingDeliveryman = 
    item?.status === 'accepted' && 
    (item?.delivery_type === 'delivery' || item?.delivery_type === 'Delivery') && 
    !item?.deliveryman;

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
        <>
           {/* Inject the styles here */}
           <style>{amazingStyles}</style>
           <Tag className="amazing-label">
             <RadarChartOutlined spin style={{ marginRight: 6, fontSize: '14px' }} />
             {t('Searching Driver...')}
           </Tag>
        </>
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
        borderColor: isAwaitingDeliveryman ? '#ffccc7' : undefined,
        borderWidth: isAwaitingDeliveryman ? '2px' : undefined,
      }}
    >
      <Skeleton loading={loading} avatar active>
        <Space direction="vertical" size={8} style={{ width: '100%' }}>
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
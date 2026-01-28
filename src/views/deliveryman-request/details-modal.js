import React from 'react';
import { Button, Modal, Descriptions, Image, Space, Tag, Divider, Row, Col, Card, Alert } from 'antd';
import { useTranslation } from 'react-i18next';
import {
  CarOutlined,
  IdcardOutlined,
  FileProtectOutlined,
  SafetyCertificateOutlined,
  PictureOutlined
} from '@ant-design/icons';

// Helper: Extract images from keys like "images[0]", "images[1]"
const extractImages = (data) => {
  const imgs = [];
  Object.keys(data).forEach(k => {
    if (k.startsWith('images[') && data[k]?.includes('http')) {
      imgs.push(data[k]);
    }
  });
  return imgs;
};

// Helper: Find any key starting with prefix (e.g. license_front_photo or license_front)
const extractField = (data, prefixes) => {
  for (const p of prefixes) {
    const key = Object.keys(data).find(k => k.startsWith(p));
    if (key && data[key]?.includes('http')) return data[key];
  }
  return null;
};

// ImageZoom with fallback placeholder
const ImageZoom = ({ src, title }) => {
  const valid = src && typeof src === 'string' && src.includes('http');

  if (!valid) {
    return (
      <div
        style={{
          width: 100,
          height: 100,
          border: '2px dashed #d9d9d9',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: 12,
          background: '#fafafa',
          marginRight: 12,
        }}
      >
        No Image
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={title}
      width={100}
      height={100}
      style={{
        objectFit: 'cover',
        borderRadius: 8,
        border: '2px solid #f0f0f0',
        cursor: 'pointer',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      }}
      preview={{ src }}
      fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="
    />
  );
};

export default function DeliverymanRequestModal({ data, handleClose }) {
  const { t } = useTranslation();
  if (!data) return null;

  const d = data.data || {};
  const user = data.model || {};

  // Extract vehicle images from "images[0]", "images[1]", etc.
  const vehicleImages = extractImages(d);

  // Extract document images (flexible key matching)
  const licenseFront = extractField(d, ['license_front_photo', 'license_front']);
  const licenseBack = extractField(d, ['license_back_photo', 'license_back']);
  const passportFront = extractField(d, ['passport_front_photo', 'passport_front']);
  const passportBack = extractField(d, ['passport_back_photo', 'passport_back']);
  const visaFront = extractField(d, ['visa_copy_front_photo', 'visa_front']);
  const visaBack = extractField(d, ['visa_copy_back_photo', 'visa_back']);
  const policePhoto = extractField(d, ['police_check_photo', 'police_check']);
  const workingPhoto = extractField(d, ['working_right_photo', 'working_right']);

  return (
    <Modal
      title={
        <span style={{ fontSize: 18 }}>
          <CarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Request Detail - {user.firstname} {user.lastname}
        </span>
      }
      visible={!!data}
      onCancel={handleClose}
      width={1200}
      footer={
        <Button type="default" onClick={handleClose}>
          {t('close')}
        </Button>
      }
      bodyStyle={{ padding: '16px 24px', fontSize: '16px', lineHeight: 1.6 }}
    >
      <div style={{ maxHeight: '75vh', overflowY: 'auto', fontSize: '16px', lineHeight: 1.6 }}>

        {/* VEHICLE IMAGES */}
        {vehicleImages.length > 0 ? (
          <Card
            title={<><PictureOutlined style={{ marginRight: 6 }} /> <span style={{ fontSize: '1.05rem' }}>Vehicle Images ({vehicleImages.length})</span></>}
            style={{ marginBottom: 20 }}
            size="small"
          >
            <Space size={12} wrap>
              {vehicleImages.map((url, i) => (
                <ImageZoom key={i} src={url} title={`Vehicle Image ${i + 1}`} />
              ))}
            </Space>
          </Card>
        ) : (
          <Alert message="No vehicle images" type="warning" showIcon style={{ marginBottom: 20 }} />
        )}

        {/* USER INFO */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Descriptions title={<span style={{ fontSize: '1.05rem' }}>{t('user.info')}</span>} bordered column={1} style={{ fontSize: '1rem' }}>
            <Descriptions.Item label="ID">{data.id}</Descriptions.Item>
            <Descriptions.Item label={t('firstname')}>{user.firstname || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('lastname')}>{user.lastname || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('phone')}>{user.phone || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('email')}>{user.email || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('role')}>{user.role || '-'}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* VEHICLE DETAILS */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Descriptions title={<span style={{ fontSize: '1.05rem' }}>Vehicle Information</span>} bordered column={2} style={{ fontSize: '1rem' }}>
            <Descriptions.Item label={t('brand')}>{d.brand || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('model')}>{d.model || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('car.number')}>{d.number || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('car.color')}>{d.color || '-'}</Descriptions.Item>
            <Descriptions.Item label={t('type.of.technique')}>
              <Tag color="blue" style={{ fontSize: '0.95rem' }}>{d.type_of_technique || '-'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('online')}>
              <Tag color={d.online ? 'green' : 'red'} style={{ fontSize: '0.95rem' }}>
                {d.online ? t('online') : t('offline')}
              </Tag>
            </Descriptions.Item>
          </Descriptions>

          <Divider orientation="left" style={{ fontSize: '1.05rem' }}>Vehicle Dimensions</Divider>
          <Row gutter={16} style={{ fontSize: '1rem' }}>
            <Col span={6}><strong>Height:</strong> {d.height || 0} cm</Col>
            <Col span={6}><strong>Width:</strong> {d.width || 0} cm</Col>
            <Col span={6}><strong>Length:</strong> {d.length || 0} cm</Col>
            <Col span={6}><strong>Weight:</strong> {d.kg || 0} kg</Col>
          </Row>
        </Card>

        {/* DOCUMENTS */}
        <Card size="small">
          <Descriptions title={<span style={{ fontSize: '1.05rem' }}>{t('documents')}</span>} column={1} style={{ fontSize: '1rem' }} />

          {/* Driving License */}
          {(d.license || licenseFront || licenseBack || d.license_expiry_date) && (
            <div style={{ fontSize: '1rem' }}>
              <Divider orientation="left" style={{ fontSize: '1.05rem' }}>
                <SafetyCertificateOutlined style={{ marginRight: 6 }} /> Driving License
              </Divider>
              <Row gutter={16} style={{ fontSize: '1rem' }}>
                {d.license && <Col span={12}><strong style={{ fontSize: '1.05rem' }}>License Number:</strong> <span style={{ fontSize: '1rem' }}>{d.license}</span></Col>}
                {d.license_expiry_date && <Col span={12}><strong style={{ fontSize: '1.05rem' }}>Expiry Date:</strong> <span style={{ fontSize: '1rem' }}>{d.license_expiry_date}</span></Col>}
              </Row>
              <Space size={12} style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' }}>
                <ImageZoom src={licenseFront} title="License Front" />
                <ImageZoom src={licenseBack} title="License Back" />
              </Space>
            </div>
          )}

          {/* Passport */}
          {(d.passport_number || passportFront || passportBack || d.passport_expiry_date) && (
            <div style={{ fontSize: '1rem' }}>
              <Divider orientation="left" style={{ fontSize: '1.05rem' }}>
                <IdcardOutlined style={{ marginRight: 6 }} /> {t('passport')}
              </Divider>
              <Row gutter={16} style={{ fontSize: '1rem' }}>
                {d.passport_number && (
                  <Col span={12}>
                    <strong style={{ fontSize: '1.05rem' }}>Passport Number:</strong>{' '}
                    <span style={{ fontSize: '1rem' }}>{d.passport_number}</span>
                  </Col>
                )}
                {d.passport_expiry_date && (
                  <Col span={12}>
                    <strong style={{ fontSize: '1.05rem' }}>Expiry Date:</strong>{' '}
                    <span style={{ fontSize: '1rem' }}>{d.passport_expiry_date}</span>
                  </Col>
                )}
              </Row>
              <Space size={12} style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap' }}>
                <ImageZoom src={passportFront} title="Passport Front" />
                <ImageZoom src={passportBack} title="Passport Back" />
              </Space>
            </div>
          )}

          {/* Visa Copy */}
          {(d.visa_copy || visaFront || visaBack) && (
            <div style={{ fontSize: '1rem' }}>
              <Divider orientation="left" style={{ fontSize: '1.05rem' }}>
                <FileProtectOutlined style={{ marginRight: 6 }} /> <span>Visa Copy</span>
              </Divider>
              {d.visa_copy && (
                <div style={{ marginBottom: 8 }}>
                  <strong style={{ fontSize: '1.05rem' }}>Visa Copy:</strong>{' '}
                  <span style={{ fontSize: '1rem' }}>{d.visa_copy}</span>
                </div>
              )}
              <Space size={12} style={{ display: 'flex', flexWrap: 'wrap' }}>
                <ImageZoom src={visaFront} title="Visa Copy Front" />
                <ImageZoom src={visaBack} title="Visa Copy Back" />
              </Space>
            </div>
          )}

          {/* Police Check */}
          {(d.police_check || policePhoto) && (
            <>
              <Divider orientation="left" style={{ fontSize: '1.05rem' }}>
                <SafetyCertificateOutlined style={{ marginRight: 6 }} /> Police Check
              </Divider>
              {d.police_check && <div style={{ marginBottom: 8, fontSize: '1rem' }}><strong>Police Check:</strong> {d.police_check}</div>}
              <Space size={12} style={{ display: 'flex' }}>
                <ImageZoom src={policePhoto} title="Police Check Photo" />
              </Space>
            </>
          )}

          {/* Working Right */}
          {(d.working_right || workingPhoto) && (
            <>
              <Divider orientation="left" style={{ fontSize: '1.05rem' }}>
                <SafetyCertificateOutlined style={{ marginRight: 6 }} /> Working Right
              </Divider>
              {d.working_right && <div style={{ marginBottom: 8, fontSize: '1rem' }}><strong>Working Right:</strong> {d.working_right}</div>}
              <Space size={12} style={{ display: 'flex' }}>
                <ImageZoom src={workingPhoto} title="Working Right Photo" />
              </Space>
            </>
          )}
        </Card>
      </div>
    </Modal>
  );
}
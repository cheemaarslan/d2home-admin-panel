import React, { useEffect } from 'react';
import { Form, Row, Col, Input, DatePicker, InputNumber, Select, Switch, Card, Divider, Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import MediaUpload from '../../components/upload';
import Map from '../../components/map';
import {
  CarOutlined,
  IdcardOutlined,
  CalendarOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  FileProtectOutlined,
  SafetyCertificateOutlined,
  ToolOutlined,
  DashboardOutlined,
  BorderOuterOutlined,
  PictureOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

const type_of_technique = [
  { label: 'PETROL', value: 'petrol' },
  { label: 'Diesel', value: 'diesel' },
  { label: 'Gas', value: 'gas' },
  { label: 'Motorbike', value: 'motorbike' },
  { label: 'Bike', value: 'bike' },
  { label: 'Foot', value: 'foot' },
  { label: 'Electric', value: 'electric' },
];

const DelivertSetting = ({
  location, setLocation, form, image, setImage,
  licenseFront, setLicenseFront,
  licenseBack, setLicenseBack,
  passportFront, setPassportFront,
  passportBack, setPassportBack,
  visaFront, setVisaFront,
  visaBack, setVisaBack,
  policePhoto, setPolicePhoto,
  workingPhoto, setWorkingPhoto

}) => {
  const { t } = useTranslation();

  // Sync photo state to form
  useEffect(() => {
    form.setFieldsValue({ license_front_photo: licenseFront[0]?.name || undefined });
  }, [licenseFront, form]);
  useEffect(() => {
    form.setFieldsValue({ license_back_photo: licenseBack[0]?.name || undefined });
  }, [licenseBack, form]);
  useEffect(() => {
    form.setFieldsValue({ passport_front_photo: passportFront[0]?.name || undefined });
  }, [passportFront, form]);
  useEffect(() => {
    form.setFieldsValue({ passport_back_photo: passportBack[0]?.name || undefined });
  }, [passportBack, form]);
  useEffect(() => {
    form.setFieldsValue({ visa_copy_front_photo: visaFront[0]?.name || undefined });
  }, [visaFront, form]);
  useEffect(() => {
    form.setFieldsValue({ visa_copy_back_photo: visaBack[0]?.name || undefined });
  }, [visaBack, form]);
  useEffect(() => {
    form.setFieldsValue({ police_check_photo: policePhoto[0]?.name || undefined });
  }, [policePhoto, form]);
  useEffect(() => {
    form.setFieldsValue({ working_right_photo: workingPhoto[0]?.name || undefined });
  }, [workingPhoto, form]);

  return (
    <div style={{ marginTop: 24, width: '100%' }}>
      {/* VEHICLE INFORMATION */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          width: '100%'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Title level={4} style={{ marginBottom: 16 }}>
          <CarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          Vehicle Information
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label={t('brand')} name="brand" rules={[{ required: true, message: t('required') }, { min: 2 }]}>
              <Input prefix={<ToolOutlined />} placeholder="Toyota" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label={t('model')} name="model" rules={[{ required: true, message: t('required') }, { min: 2 }]}>
              <Input prefix={<CarOutlined />} placeholder="Camry" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label={t('type.of.technique')} name="type_of_technique" rules={[{ required: true }]}>
              <Select options={type_of_technique} placeholder={t('select.type')} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label={t('car.number')} name="number" rules={[{ required: true, message: t('required') }, { min: 2 }]}>
              <Input prefix={<IdcardOutlined />} placeholder="" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Form.Item label={t('car.color')} name="color" rules={[{ required: true, message: t('required') }, { min: 2 }]}>
              <Input prefix={<DashboardOutlined />} placeholder="Black" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* DIMENSIONS */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          width: '100%'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Title level={4} style={{ marginBottom: 16 }}>
          <BorderOuterOutlined style={{ marginRight: 8, color: '#52c41a' }} />
          Vehicle Dimensions
        </Title>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label={t('height')} name="height" rules={[{ required: true }]}>
              <InputNumber className="w-100" addonAfter="cm" min={1} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label={t('weight')} name="kg" rules={[{ required: true }]}>
              <InputNumber className="w-100" addonAfter="kg" min={1} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label={t('length')} name="length" rules={[{ required: true }]}>
              <InputNumber className="w-100" addonAfter="cm" min={1} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Form.Item label={t('width')} name="width" rules={[{ required: true }]}>
              <InputNumber className="w-100" addonAfter="cm" min={1} />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* VEHICLE IMAGE */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          width: '100%'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Title level={4} style={{ marginBottom: 16 }}>
          <PictureOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
          Vehicle Image
        </Title>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Form.Item name="images" rules={[{ required: true, message: "Please upload vehicle image" }]}>
              <MediaUpload
                type="deliveryman/settings"
                imageList={image}
                setImageList={setImage}
                form={form}
                length="1"
                multiple={true}
              />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      {/* DOCUMENTS */}
      <Card
        style={{
          marginBottom: 24,
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          width: '100%'
        }}
        bodyStyle={{ padding: '24px' }}
      >
        <Title level={4} style={{ marginBottom: 16 }}>
          <FileProtectOutlined style={{ marginRight: 8, color: '#722ed1' }} />
          {t('documents')}
        </Title>

        {/* License */}
        <Divider orientation="left"><SafetyCertificateOutlined /> Driving License</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}><Form.Item label="License Number" name="license"><Input prefix={<IdcardOutlined />} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Expiry Date" name="license_expiry_date"><DatePicker className="w-100" format="YYYY-MM-DD" suffixIcon={<CalendarOutlined />} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Front Photo" name="license_front_photo"><MediaUpload type="users" imageList={licenseFront} setImageList={setLicenseFront} form={form} multiple={false} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Back Photo" name="license_back_photo"><MediaUpload type="users" imageList={licenseBack} setImageList={setLicenseBack} form={form} multiple={false} /></Form.Item></Col>
        </Row>

        {/* Passport */}
        <Divider orientation="left"><GlobalOutlined /> Passport</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}><Form.Item label="Passport Number" name="passport_number"><Input prefix={<IdcardOutlined />} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Expiry Date" name="passport_expiry_date"><DatePicker className="w-100" format="YYYY-MM-DD" suffixIcon={<CalendarOutlined />} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Front Photo" name="passport_front_photo"><MediaUpload type="users" imageList={passportFront} setImageList={setPassportFront} form={form} multiple={false} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Back Photo" name="passport_back_photo"><MediaUpload type="users" imageList={passportBack} setImageList={setPassportBack} form={form} multiple={false} /></Form.Item></Col>
        </Row>

        {/* Visa */}
        <Divider orientation="left"><FileProtectOutlined /> Visa Copy</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}><Form.Item label="Visa Copy" name="visa_copy"><Input prefix={<GlobalOutlined />} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Front Photo" name="visa_copy_front_photo"><MediaUpload type="users" imageList={visaFront} setImageList={setVisaFront} form={form} multiple={false} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Back Photo" name="visa_copy_back_photo"><MediaUpload type="users" imageList={visaBack} setImageList={setVisaBack} form={form} multiple={false} /></Form.Item></Col>
        </Row>

        {/* Police & Work */}
        <Divider orientation="left"><CheckCircleOutlined /> Legal Documents</Divider>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}><Form.Item label="Police Check" name="police_check"><Input prefix={<SafetyCertificateOutlined />} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Police Check Photo" name="police_check_photo"><MediaUpload type="users" imageList={policePhoto} setImageList={setPolicePhoto} form={form} multiple={false} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Working Right" name="working_right"><Input prefix={<ToolOutlined />} /></Form.Item></Col>
          <Col xs={24} sm={12}><Form.Item label="Working Right Photo" name="working_right_photo"><MediaUpload type="users" imageList={workingPhoto} setImageList={setWorkingPhoto} form={form} multiple={false} /></Form.Item></Col>
        </Row>
      </Card>

      {/* ONLINE & MAP */}
      <Col span={6}>
        <Form.Item
          label={t('online')}
          name='online'
          rules={[{ required: true, message: t('required') }]}
          valuePropName='checked'
        >
          <Switch />
        </Form.Item>
      </Col>
      <Col span={24}>
        <Form.Item label={t('map')} name='location'>
          <Map location={location} setLocation={setLocation} />
        </Form.Item>
      </Col>

    </div>
  );
};

export default DelivertSetting;
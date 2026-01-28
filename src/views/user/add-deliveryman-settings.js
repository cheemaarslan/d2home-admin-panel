import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  InputNumber,
  Switch,
  Divider,
  Typography,
  DatePicker,
  Modal,
} from 'antd';
import { useTranslation } from 'react-i18next';
import deliveryService from '../../services/delivery';
import Loading from '../../components/loading';
import { shallowEqual, useSelector } from 'react-redux';
import MediaUpload from '../../components/upload';
import Map from '../../components/map';
import getDefaultLocation from '../../helpers/getDefaultLocation';
import { toast } from 'react-toastify';
import moment from 'moment';
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

const DeliverySettingCreate = ({ id }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loading, setLoading] = useState(false);

  // Image states
  const [vehicleImage, setVehicleImage] = useState([]);
  const [licenseFront, setLicenseFront] = useState([]);
  const [licenseBack, setLicenseBack] = useState([]);
  const [passportFront, setPassportFront] = useState([]);
  const [passportBack, setPassportBack] = useState([]);
  const [visaFront, setVisaFront] = useState([]);
  const [visaBack, setVisaBack] = useState([]);
  const [policePhoto, setPolicePhoto] = useState([]);
  const [workingPhoto, setWorkingPhoto] = useState([]);

  // Preview Modal
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [previewList, setPreviewList] = useState(null);

  const { settings } = useSelector((state) => state.globalSettings, shallowEqual);
  const [location, setLocation] = useState(getDefaultLocation(settings));

  const createImages = (items = []) =>
    items
      .filter(Boolean)
      .map((item) => {
        if (typeof item === 'string') {
          return {
            uid: item,
            name: item,
            url: `https://api.d2home.com.au/storage/images/users/${item}`,
          };
        }
        return {
          uid: item.id || item.uid || item,
          name: item.path || item.name || item,
          url: item.path
            ? `https://api.d2home.com.au/storage/images/users/${item.path}`
            : item.url || '',
        };
      });

  // Fetch data
  useEffect(() => {
    if (!id) return;

    const fetchDeliverySettings = () => {
      setLoading(true);
      deliveryService
        .getById(id)
        .then((res) => {
          const data = res.data;
          const lat = data?.location?.latitude;
          const lng = data?.location?.longitude;
          setLocation({ lat, lng });

          setVehicleImage(createImages(data.galleries));
          setLicenseFront(createImages([data.license_front_photo]));
          setLicenseBack(createImages([data.license_back_photo]));
          setPassportFront(createImages([data.passport_front_photo]));
          setPassportBack(createImages([data.passport_back_photo]));
          setVisaFront(createImages([data.visa_copy_front_photo]));
          setVisaBack(createImages([data.visa_copy_back_photo]));
          setPolicePhoto(createImages([data.police_check_photo]));
          setWorkingPhoto(createImages([data.working_right_photo]));

          form.setFieldsValue({
            brand: data.brand,
            model: data.model,
            type_of_technique: data.type_of_technique,
            number: data.number,
            color: data.color,
            height: data.height,
            kg: data.kg,
            length: data.length,
            width: data.width,
            online: data.online == 1,
            license: data.license,
            license_expiry_date: data.license_expiry_date ? moment(data.license_expiry_date) : null,
            passport_number: data.passport_number,
            passport_expiry_date: data.passport_expiry_date ? moment(data.passport_expiry_date) : null,
            visa_copy: data.visa_copy,
            police_check: data.police_check,
            working_right: data.working_right,
          });
        })
        .finally(() => setLoading(false));
    };

    fetchDeliverySettings();
  }, [id, form]);

  // Sync image names to form
  useEffect(() => form.setFieldsValue({ images: vehicleImage.map(i => i.name) }), [vehicleImage, form]);
  useEffect(() => form.setFieldsValue({ license_front_photo: licenseFront[0]?.name }), [licenseFront, form]);
  useEffect(() => form.setFieldsValue({ license_back_photo: licenseBack[0]?.name }), [licenseBack, form]);
  useEffect(() => form.setFieldsValue({ passport_front_photo: passportFront[0]?.name }), [passportFront, form]);
  useEffect(() => form.setFieldsValue({ passport_back_photo: passportBack[0]?.name }), [passportBack, form]);
  useEffect(() => form.setFieldsValue({ visa_copy_front_photo: visaFront[0]?.name }), [visaFront, form]);
  useEffect(() => form.setFieldsValue({ visa_copy_back_photo: visaBack[0]?.name }), [visaBack, form]);
  useEffect(() => form.setFieldsValue({ police_check_photo: policePhoto[0]?.name }), [policePhoto, form]);
  useEffect(() => form.setFieldsValue({ working_right_photo: workingPhoto[0]?.name }), [workingPhoto, form]);

  const onFinish = (values) => {
    setLoadingBtn(true);
    const params = {
      ...values,
      images: vehicleImage.map((img) => img.name),
      location: { latitude: location.lat, longitude: location.lng },
      online: values.online ? 1 : 0,
      license_front_photo: licenseFront[0]?.name,
      license_back_photo: licenseBack[0]?.name,
      passport_front_photo: passportFront[0]?.name,
      passport_back_photo: passportBack[0]?.name,
      visa_copy_front_photo: visaFront[0]?.name,
      visa_copy_back_photo: visaBack[0]?.name,
      police_check_photo: policePhoto[0]?.name,
      working_right_photo: workingPhoto[0]?.name,
    };

    deliveryService
      .update(id, params)
      .then(() => toast.success(t('successfully.updated')))
      .catch(() => toast.error(t('failed.to.update')))
      .finally(() => setLoadingBtn(false));
  };

  // Open Preview
  const openPreview = (file, setter) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewTitle(file.name);
    setPreviewList(() => setter);
    setPreviewVisible(true);
  };

  // Delete from Modal
  const handleDelete = () => {
    if (previewList) {
      previewList([]);
    }
    setPreviewVisible(false);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {loading ? (
        <Loading />
      ) : (
        <div style={{ marginTop: 24 }}>

          {/* VEHICLE INFORMATION */}
          <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
            <Title level={4} style={{ marginBottom: 16 }}>
              <CarOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              Vehicle Information
            </Title>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label={t('brand')} name="brand" rules={[{ required: true }]}>
                  <Input prefix={<ToolOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label={t('model')} name="model" rules={[{ required: true }]}>
                  <Input prefix={<CarOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label={t('type.of.technique')} name="type_of_technique" rules={[{ required: true }]}>
                  <Select options={type_of_technique} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label={t('car.number')} name="number" rules={[{ required: true }]}>
                  <Input prefix={<IdcardOutlined />} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Form.Item label={t('car.color')} name="color" rules={[{ required: true }]}>
                  <Input prefix={<DashboardOutlined />} />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* DIMENSIONS */}
          <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
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
          <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
            <Title level={4} style={{ marginBottom: 16 }}>
              <PictureOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
              Vehicle Image
            </Title>
            <Form.Item name="images" rules={[{ required: true, message: t('please.upload.vehicle.image') }]}>
              <MediaUpload
                type="deliveryman/settings"
                imageList={vehicleImage}
                setImageList={setVehicleImage}
                form={form}
                multiple={true}
                onPreview={(file) => openPreview(file, setVehicleImage)}
              />
            </Form.Item>
          </Card>

          {/* DOCUMENTS */}
          <Card style={{ marginBottom: 24, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '24px' }}>
            <Title level={4} style={{ marginBottom: 16 }}>
              <FileProtectOutlined style={{ marginRight: 8, color: '#722ed1' }} />
              {t('documents')}
            </Title>

            <Divider orientation="left"><SafetyCertificateOutlined /> Driving License</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}><Form.Item label="License Number" name="license"><Input prefix={<IdcardOutlined />} /></Form.Item></Col>
              <Col xs={24} sm={12}><Form.Item label="Expiry Date" name="license_expiry_date"><DatePicker className="w-100" format="YYYY-MM-DD" suffixIcon={<CalendarOutlined />} /></Form.Item></Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Front Photo" name="license_front_photo" rules={[{ required: true, message: t('required') }]}>
                  <MediaUpload
                    type="users"
                    imageList={licenseFront}
                    setImageList={setLicenseFront}
                    form={form}
                    multiple={false}
                    onPreview={(file) => openPreview(file, setLicenseFront)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Back Photo" name="license_back_photo" rules={[{ required: true, message: t('required') }]}>
                  <MediaUpload
                    type="users"
                    imageList={licenseBack}
                    setImageList={setLicenseBack}
                    form={form}
                    multiple={false}
                    onPreview={(file) => openPreview(file, setLicenseBack)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left"><GlobalOutlined /> Passport</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}><Form.Item label="Passport Number" name="passport_number"><Input prefix={<IdcardOutlined />} /></Form.Item></Col>
              <Col xs={24} sm={12}><Form.Item label="Expiry Date" name="passport_expiry_date"><DatePicker className="w-100" format="YYYY-MM-DD" suffixIcon={<CalendarOutlined />} /></Form.Item></Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Front Photo" name="passport_front_photo" rules={[{ required: true, message: t('required') }]}>
                  <MediaUpload
                    type="users"
                    imageList={passportFront}
                    setImageList={setPassportFront}
                    form={form}
                    multiple={false}
                    onPreview={(file) => openPreview(file, setPassportFront)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Back Photo" name="passport_back_photo" rules={[{ required: true, message: t('required') }]}>
                  <MediaUpload
                    type="users"
                    imageList={passportBack}
                    setImageList={setPassportBack}
                    form={form}
                    multiple={false}
                    onPreview={(file) => openPreview(file, setPassportBack)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left"><FileProtectOutlined /> Visa Copy</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}><Form.Item label="Visa Copy" name="visa_copy"><Input prefix={<GlobalOutlined />} /></Form.Item></Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Front Photo" name="visa_copy_front_photo" rules={[{ required: true, message: t('required') }]}>
                  <MediaUpload
                    type="users"
                    imageList={visaFront}
                    setImageList={setVisaFront}
                    form={form}
                    multiple={false}
                    onPreview={(file) => openPreview(file, setVisaFront)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Back Photo" name="visa_copy_back_photo" rules={[{ required: true, message: t('required') }]}>
                  <MediaUpload
                    type="users"
                    imageList={visaBack}
                    setImageList={setVisaBack}
                    form={form}
                    multiple={false}
                    onPreview={(file) => openPreview(file, setVisaBack)}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left"><CheckCircleOutlined /> Legal Documents</Divider>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}><Form.Item label="Police Check" name="police_check"><Input prefix={<SafetyCertificateOutlined />} /></Form.Item></Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Police Check Photo" name="police_check_photo" rules={[{ required: true, message: t('required') }]}>
                  <MediaUpload
                    type="users"
                    imageList={policePhoto}
                    setImageList={setPolicePhoto}
                    form={form}
                    multiple={false}
                    onPreview={(file) => openPreview(file, setPolicePhoto)}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}><Form.Item label="Working Right" name="working_right"><Input prefix={<ToolOutlined />} /></Form.Item></Col>
              <Col xs={24} sm={12}>
                <Form.Item label="Working Right Photo" name="working_right_photo" rules={[{ required: true, message: t('required') }]}>
                  <MediaUpload
                    type="users"
                    imageList={workingPhoto}
                    setImageList={setWorkingPhoto}
                    form={form}
                    multiple={false}
                    onPreview={(file) => openPreview(file, setWorkingPhoto)}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Card>

          {/* ONLINE & MAP */}
        <Col span={6}>
            <Form.Item
              label={t('online')}
              name='online'
              // rules={[{ required: true, message: t('required') }]}
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

          <Row>
            <Col span={24}>
              <Button type="primary" htmlType="submit" loading={loadingBtn} style={{ marginTop: 16 }}>
                {t('save')}
              </Button>
            </Col>
          </Row>

          {/* PREVIEW MODAL */}
          <Modal
            open={previewVisible}
            title={previewTitle}
            onCancel={() => setPreviewVisible(false)}
            footer={[
              <Button key="delete" danger onClick={handleDelete}>
                {t('delete')}
              </Button>,
              <Button key="close" onClick={() => setPreviewVisible(false)}>
                {t('close')}
              </Button>,
            ]}
            width={800}
            centered
          >
            <img alt="preview" style={{ width: '100%', borderRadius: 8 }} src={previewImage} />
          </Modal>
        </div>
      )}
    </Form>
  );
};

export default DeliverySettingCreate;
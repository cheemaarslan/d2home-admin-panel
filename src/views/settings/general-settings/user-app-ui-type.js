import { Card, Col, Form, Modal, Row } from 'antd';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { setMenuData } from '../../../redux/slices/menu';
import settingService from '../../../services/settings';
import { fetchSettings as getSettings } from '../../../redux/slices/globalSettings';
import { InputCard } from 'components/user-app-ui-radio-card';
import '../../../assets/scss/components/radio-card.scss';
import { ExclamationCircleFilled } from '@ant-design/icons';

const { confirm } = Modal;
const userAppUiTypes = [
  {
    title: 'View 1',
    value: 1,
    img: '/img/user-app-ui-type-1.png',
  },
  {
    title: 'View 2',
    value: 2,
    img: '/img/user-app-ui-type-2.png',
  },
  {
    title: 'View 3',
    value: 3,
    img: '/img/user-app-ui-type-3.png',
  },
  {
    title: 'View 4',
    value: 4,
    img: '/img/user-app-ui-type-4.png',
  },
];

const UserAppUiType = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const dispatch = useDispatch();
  const [value, setValue] = useState(
    activeMenu.data?.user_app_ui_type || userAppUiTypes[0].value
  );

  const showConfirm = (type) => {
    confirm({
      title: t('do.you.want.to.change.user.app.ui.type'),
      centered: true,
      icon: <ExclamationCircleFilled />,
      onOk() {
        setValue(type);
        updateSettings({user_app_ui_type: type})
      },
    });
  };

  useEffect(() => {
    return () => {
      const data = form.getFieldsValue(true);
      dispatch(setMenuData({ activeMenu, data }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSettings(data) {
    settingService
      .update(data)
      .then(() => {
        toast.success(t('successfully.updated'));
        dispatch(getSettings());
      })
  }

  return (
    <Form
      layout='vertical'
      form={form}
      name='global-settings'
      initialValues={{
        user_app_ui_type: Number(value)
      }}
    >
      <Card title={t('user.app.ui.types')}>
        <Row gutter={12}>
            {userAppUiTypes.map((type) => (
              <Col key={type.value} span={12}>
                <InputCard
                  title={type.title}
                  onClick={() => showConfirm(type.value)} 
                  checked={Number(value) === type.value}
                  imgPath={type.img}
                />
              </Col>
            ))}
        </Row>
      </Card>
    </Form>
  );
};

export default UserAppUiType;

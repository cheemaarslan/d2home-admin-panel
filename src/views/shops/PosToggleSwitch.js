import React, { useState } from 'react';
import { Switch } from 'antd';
import shopService from '../../services/shop';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const PosToggleSwitch = ({ pos_access, disabled, uuid }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(pos_access);

  const handleChange = (checked) => {
    setLoading(true);
    shopService.setPosAccess(uuid, { pos_access: checked })
      .then(() => {
        setChecked(checked);
        toast.success(t('successfully.updated'));
      })
      .catch(() => {
        setChecked(!checked);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Switch
      checked={checked}
      onChange={handleChange}
      disabled={disabled || loading}
      loading={loading}
    />
  );
};

export default PosToggleSwitch;
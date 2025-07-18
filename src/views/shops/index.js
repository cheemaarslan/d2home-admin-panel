import React, { useContext, useEffect, useState } from 'react';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Card, Image, Space, Table, Tabs, Tag, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Context } from '../../context/context';
import CustomModal from '../../components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from '../../redux/slices/menu';
import shopService from '../../services/shop';
import { fetchShops } from '../../redux/slices/shop';
import { useTranslation } from 'react-i18next';
import ShopStatusModal from './shop-status-modal';
import DeleteButton from '../../components/delete-button';
import SearchInput from '../../components/search-input';
import useDidUpdate from '../../helpers/useDidUpdate';
import CustomDrower from '../../components/CustomDrower';
import i18n from '../../configs/i18next';
import { BiFilterAlt } from 'react-icons/bi';
import FilterColumns from '../../components/filter-column';
import { FaTrashRestoreAlt } from 'react-icons/fa';
import ResultModal from '../../components/result-modal';
import formatSortType from '../../helpers/formatSortType';
import { updateShopPosStatus } from '../../redux/slices/shop';

const { TabPane } = Tabs;
const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];
const roles = ['all', 'new', 'approved', 'rejected', 'deleted_at'];

const Shops = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [shopStatus, setShopStatus] = useState(null);
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const [openDrower, setOpenDrower] = useState(false);
  const [text, setText] = useState(null);
  const [restore, setRestore] = useState(null);
  const [role, setRole] = useState('all');
  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const immutable = activeMenu.data?.role || role;
  const { setIsModalVisible } = useContext(Context);
  const [id, setId] = useState(null);
  const [verify, setVerify] = useState(null);

  const [loadingBtn, setLoadingBtn] = useState(false);
  const { shops, meta, loading, params } = useSelector(
    (state) => state.shop,
    shallowEqual,
  );

const PosToggleSwitch = ({ pos_access, disabled, uuid }) => {
  const [isActive, setIsActive] = useState(!!pos_access); // Convert to boolean (handles true/false, 1/0, "1"/"0")
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    console.log('PosToggleSwitch props:', { pos_access, type: typeof pos_access, uuid });
    setIsActive(!!pos_access); // Sync with boolean pos_access
  }, [pos_access]);

  const handleToggle = async () => {
    const newStatus = !isActive;
    setIsActive(newStatus);

    try {
      const response = await shopService.setPosToggle(uuid, newStatus);
      console.log('setPosToggle response:', response);

      if (response && typeof response.pos_access !== 'undefined') {
        dispatch(updateShopPosStatus({ 
          uuid, 
          pos_access: response.pos_access // Expect true/false from API
        }));
        
        if (response.pos_access === newStatus) {
          toast.success(t('successfully.updated'));
        } else {
          setIsActive(!!response.pos_access);
          toast.warning(t('status.not.updated'));
        }
      } else {
        throw new Error(response?.message || 'Invalid server response');
      }
    } catch (error) {
      console.error('Toggle failed:', error);
      setIsActive(!newStatus);
      toast.error(error.message || t('error.occurred'));
      dispatch(fetchShops());
    }
  };

  return (
    <Switch
      checked={isActive}
      disabled={disabled}
      onChange={handleToggle}
      loading={isActive !== !!pos_access}
      aria-label={`Toggle POS access for shop ${uuid}`}
    />
  );
};

  const goToEdit = (row) => {
    dispatch(
      addMenu({
        id: 'edit-shop',
        url: `shop/${row.uuid}`,
        name: t('edit.shop'),
      }),
    );
    navigate(`/shop/${row.uuid}`, { state: 'edit' });
  };

  const goToClone = (row) => {
    dispatch(
      addMenu({
        id: 'shop-clone',
        url: `shop-clone/${row.uuid}`,
        name: t('shop.clone'),
      }),
    );
    navigate(`/shop-clone/${row.uuid}`, { state: 'clone' });
  };

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: true,
      key: 'id',
    },
    {
      title: t('title'),
      dataIndex: 'name',
      is_show: true,
      key: 'title',
    },
    {
      title: t('translations'),
      dataIndex: 'locales',
      is_show: true,
      key: 'locales',
      render: (_, row) => {
        return (
          <Space>
            {row.locales?.map((item, index) => (
              <Tag
                key={`${row.id}-${item}-${index}`} // Added unique key
                className='text-uppercase'
                color={[colors[index]]}
              >
                {item}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: t('logo'),
      dataIndex: 'logo_img',
      is_show: true,
      key: 'logo',
      render: (img, row) => {
        return (
          <Image
            alt={'images background'}
            className='img rounded'
            src={
              row.deleted_at
                ? 'https://via.placeholder.com/150'
                : img
                  ? img
                  : 'https://via.placeholder.com/150'
            }
            effect='blur'
            width={50}
            height={50}
            preview
            placeholder
          />
        );
      },
    },
    {
      title: t('background'),
      dataIndex: 'back',
      is_show: true,
      render: (img, row) => {
        return (
          <Image
            alt={'images background'}
            className='img rounded'
            src={
              row.deleted_at
                ? 'https://via.placeholder.com/150'
                : img
                  ? img
                  : 'https://via.placeholder.com/150'
            }
            effect='blur'
            width={50}
            height={50}
            preview
            placeholder
          />
        );
      },
    },
    {
      title: t('seller'),
      dataIndex: 'seller',
      is_show: true,
      key: 'seller',
    },
    {
      title: t('open.time'),
      dataIndex: 'open',
      is_show: true,
      key: 'open.time',
      render: (_, row) => {
        return row.open ? (
          <Tag color='blue'> {t('open')} </Tag>
        ) : (
          <Tag color='red'> {t('closed')} </Tag>
        );
      },
    },
    {
      title: t('tax'),
      is_show: true,
      dataIndex: 'tax',
      key: 'tax',
      render: (tax) => `${tax} %`,
    },
    {
      title: t('verify'),
      dataIndex: 'verify',
      is_show: true,
      render: (active, row) => {
        return (
          <Switch
            onChange={() => {
              setIsModalVisible(true);
              setId([row.id]);
              setVerify(true);
            }}
            disabled={row.deleted_at}
            checked={active}
          />
        );
      },
    },
 {
  title: t('Pos'),
  dataIndex: 'pos_access',
  is_show: true,
  render: (pos_access, row) => {
    console.log(`Table row ${row.uuid} pos_access:`, pos_access, typeof pos_access);
    return (
      <PosToggleSwitch 
        pos_access={pos_access}
        disabled={!!row.deleted_at}
        uuid={row.uuid}
      />
    );
  },
},
    {
      title: t('status'),
      dataIndex: 'status',
      key: 'status',
      is_show: true,
      render: (status, row) => (
        <div>
          {status === 'new' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'rejected' ? (
            <Tag color='error'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          {!row.deleted_at && (
            <EditOutlined onClick={() => setShopStatus(row)} />
          )}
        </div>
      ),
    },
    {
      title: t('options'),
      dataIndex: 'options',
      key: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              disabled={row?.deleted_at}
              onClick={() => goToEdit(row)}
            />
            <Button
              icon={<CopyOutlined />}
              onClick={() => goToClone(row)}
              disabled={row.deleted_at}
            />
            {user?.role !== 'manager' ? (
              <DeleteButton
                disabled={row.deleted_at}
                icon={<DeleteOutlined />}
                onClick={() => {
                  setId([row.id]);
                  setIsModalVisible(true);
                  setText(true);
                  setVerify(false);
                }}
              />
            ) : (
              ''
            )}
          </Space>
        );
      },
    },
  ]);

  const data = activeMenu?.data;
  const paramsData = {
    search: data?.search,
    lang: data?.filter?.equal === 'equal' ? data?.filter?.lang : i18n.language,
    not_lang: data?.filter?.equal === 'not_equal' ? data?.filter?.lang : null,
    status:
      immutable === 'deleted_at'
        ? undefined
        : immutable === 'all'
          ? undefined
          : immutable,
    deleted_at: immutable === 'deleted_at' ? immutable : undefined,
    page: data?.page,
    perPage: data?.perPage,
    sort: data?.sort,
    column: data?.column,
  };

  const shopDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    shopService
      .delete(params)
      .then(() => {
        toast.success(t('successfully.deleted'));
        setIsModalVisible(false);
        dispatch(fetchShops(paramsData));
        setText(null);
        setVerify(false);

        setId(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  const shopDropAll = () => {
    setLoadingBtn(true);
    shopService
      .dropAll()
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchShops());
        setRestore(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  const shopRestoreAll = () => {
    setLoadingBtn(true);
    shopService
      .restoreAll()
      .then(() => {
        toast.success(t('successfully.restored'));
        dispatch(fetchShops(paramsData));
        setRestore(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleVerify = () => {
    setLoadingBtn(true);
    shopService
      .setVerify(id)
      .then((res) => {
        setIsModalVisible(false);
        toast.success(t('successfully.updated'));
        dispatch(fetchShops(paramsData));
        setVerify(false);
      })
      .finally(() => {
        setLoadingBtn(false);
        setId(null);
      });
  };

  function onChangePagination(pagination, filter, sorter) {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...activeMenu.data, perPage, page, column, sort },
      }),
    );
  }

  useEffect(() => {
    if (activeMenu.refetch) {
      dispatch(fetchShops(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu, dispatch, paramsData, activeMenu.refetch]); // Add dependencies

  useDidUpdate(() => {
    dispatch(fetchShops(paramsData));
  }, [data]);

  const goToAdd = () => {
    dispatch(
      addMenu({
        id: 'add-shop',
        url: `shop/add`,
        name: t('add.shop'),
      }),
    );
    navigate(`/shop/add`);
  };

  const handleFilter = (items) => {
    const data = activeMenu.data;
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...data, ...items },
      }),
    );
  };

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  return (
    <Card
      title={t('shops')}
      extra={
        <Space wrap>
          {immutable !== 'deleted_at' ? (
            <Space wrap>
              <Button
                icon={<PlusCircleOutlined />}
                type='primary'
                onClick={goToAdd}
              >
                {t('add.shop')}
              </Button>
              <DeleteButton size='' onClick={allDelete}>
                {t('delete.selected')}
              </DeleteButton>
              <DeleteButton
                size=''
                onClick={() => setRestore({ delete: true })}
              >
                {t('delete.all')}
              </DeleteButton>
            </Space>
          ) : (
            <DeleteButton
              icon={<FaTrashRestoreAlt className='mr-2' />}
              onClick={() => setRestore({ restore: true })}
            >
              {t('restore.all')}
            </DeleteButton>
          )}
          <Button
            className='settings-button'
            onClick={() => setOpenDrower(true)}
          >
            <BiFilterAlt className='icon' />
          </Button>
          <FilterColumns columns={columns} setColumns={setColumns} />
        </Space>
      }
    >
      {immutable !== 'deleted_at' && (
        <div className='d-flex justify-content-between'>
          <SearchInput
            placeholder={t('search')}
            handleChange={(e) => handleFilter({ search: e })}
            defaultValue={activeMenu.data?.search}
            resetSearch={!activeMenu.data?.search}
            className={'w-25'}
          />
        </div>
      )}
      <Tabs
        className='mt-3'
        activeKey={immutable}
        onChange={(key) => {
          handleFilter({ role: key, page: 1 });
          setRole(key);
        }}
        type='card'
      >
        {roles.map((item) => (
          <TabPane tab={t(item)} key={item} />
        ))}
      </Tabs>

      <Table
        scroll={{ x: true }}
        rowSelection={rowSelection}
        columns={columns?.filter((item) => item.is_show)}
        dataSource={shops}
        loading={loading}
        pagination={{
          pageSize: params.perPage,
          page: activeMenu.data?.page || 1,
          total: meta.total,
          defaultCurrent: activeMenu.data?.page,
          current: activeMenu.data?.page,
        }}
        rowKey={(record) => record.id}
        onChange={onChangePagination}
      />
      {shopStatus && (
        <ShopStatusModal
          data={shopStatus}
          handleCancel={() => setShopStatus(null)}
          paramsData={paramsData}
        />
      )}
      <CustomModal
        click={verify ? handleVerify : shopDelete}
        text={
          verify
            ? t('set.verify.product')
            : text
              ? t('delete')
              : t('all.delete')
        }
        loading={loadingBtn}
        setText={setId}
        setVerify={setVerify}
      />

      {openDrower && (
        <CustomDrower
          handleClose={() => setOpenDrower(false)}
          openDrower={openDrower}
          setMenuData={setMenuData}
        />
      )}

      {restore && (
        <ResultModal
          open={restore}
          handleCancel={() => setRestore(null)}
          click={restore.restore ? shopRestoreAll : shopDropAll}
          text={restore.restore ? t('restore.modal.text') : t('read.carefully')}
          subTitle={restore.restore ? '' : t('confirm.deletion')}
          loading={loadingBtn}
          setText={setId}
          setVerify={setVerify}
        />
      )}
    </Card>
  );
};

export default Shops;

import React, { useContext, useEffect, useState } from 'react';
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusCircleOutlined,
} from '@ant-design/icons';
import { Button, Table, Card, Space, Switch, Tag, Tabs } from 'antd';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { export_url } from 'configs/app-global';
import { Context } from 'context/context';
import CustomModal from 'components/modal';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, disableRefetch, setMenuData } from 'redux/slices/menu';
import productService from 'services/product';
import { fetchProducts } from 'redux/slices/product';
import useDidUpdate from 'helpers/useDidUpdate';
import formatSortType from 'helpers/formatSortType';
import { useTranslation } from 'react-i18next';
import DeleteButton from 'components/delete-button';
import ProductStatusModal from './productStatusModal';
import FilterColumns from 'components/filter-column';
import { FaTrashRestoreAlt } from 'react-icons/fa';
import ResultModal from 'components/result-modal';
import RiveResult from 'components/rive-result';
import { CgExport, CgImport } from 'react-icons/cg';
import { useQueryParams } from 'helpers/useQueryParams';
import ColumnImage from 'components/column-image';
import ProductListFilter from './components/filter';

const colors = ['blue', 'red', 'gold', 'volcano', 'cyan', 'lime'];
const roles = ['all', 'pending', 'published', 'unpublished', 'deleted_at'];
const { TabPane } = Tabs;

const ProductCategories = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const queryParams = useQueryParams();

  const { activeMenu } = useSelector((state) => state.menu, shallowEqual);
  const { products, meta, loading, params } = useSelector(
    (state) => state.product,
    shallowEqual,
  );
  const { setIsModalVisible } = useContext(Context);

  const [productDetails, setProductDetails] = useState(null);
  const [active, setActive] = useState(null);
  const [isBogo, setIsBogo] = useState(null);
  const [text, setText] = useState(null);
  const [restore, setRestore] = useState(null);
  const [id, setId] = useState(null);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [columns, setColumns] = useState([
    {
      title: t('id'),
      dataIndex: 'id',
      is_show: true,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: t('image'),
      dataIndex: 'img',
      is_show: true,
      render: (img, row) => <ColumnImage row={row} image={img} />,
    },
    {
      title: t('name'),
      dataIndex: 'name',
      is_show: true,
    },
    {
      title: t('translations'),
      dataIndex: 'locales',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            {row.locales?.map((item, index) => (
              <Tag className='text-uppercase' color={[colors[index]]}>
                {item}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: t('shop'),
      dataIndex: 'shop',
      key: 'shop',
      is_show: true,
      render: (shop) => shop?.translation?.title || shop?.id || t('N/A'),
    },
    {
      title: t('category'),
      dataIndex: 'category',
      key: 'category',
      is_show: true,
      render: (category) =>
        category?.translation?.title || category?.id || t('N/A'),
    },
    {
      title: t('kitchen'),
      dataIndex: 'kitchen',
      key: 'kitchen',
      is_show: true,
      render: (kitchen) =>
        kitchen?.translation?.title || kitchen?.id || t('N/A'),
    },
    {
      title: t('active'),
      dataIndex: 'active',
      is_show: true,
      render: (active, row) => {
        return (
          <Switch
            onChange={() => {
              setIsModalVisible(true);
              setId(row.uuid);
              setActive(true);
              setIsBogo(null); // Reset isBogo to avoid conflicts
            }}
            disabled={row?.deleted_at}
            checked={!!active}
          />
        );
      },
    },
    {
      title: t('bogo'),
      dataIndex: 'is_bogo',
      key: 'is_bogo',
      width: 100,
      is_show: true, // Ensure column is shown
      render: (is_bogo, record) => {
        console.log('Rendering BOGO for record:', record);
        return (
          <Switch
            checked={is_bogo === 1}
            onChange={(checked) => {
              console.log('Switch toggled:', checked, 'Record:', record);
              setId(record.uuid);
              setIsBogo(checked);
              setActive(null); // Reset active to avoid conflicts
              setIsModalVisible(true);
            }}
            disabled={record?.deleted_at}
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
          {status === 'pending' ? (
            <Tag color='blue'>{t(status)}</Tag>
          ) : status === 'unpublished' ? (
            <Tag color='red'>{t(status)}</Tag>
          ) : (
            <Tag color='cyan'>{t(status)}</Tag>
          )}
          {!row?.deleted_at && (
            <EditOutlined onClick={() => setProductDetails(row)} />
          )}
        </div>
      ),
    },
    {
      title: t('options'),
      dataIndex: 'options',
      is_show: true,
      render: (_, row) => {
        return (
          <Space>
            <Button
              type='primary'
              icon={<EditOutlined />}
              onClick={() => goToEdit(row.uuid)}
              disabled={row.deleted_at}
            />
            <Button
              icon={<CopyOutlined />}
              onClick={() => goToClone(row.uuid)}
              disabled={row.deleted_at}
            />
            <DeleteButton
              icon={<DeleteOutlined />}
              onClick={() => {
                setIsModalVisible(true);
                setId([row.id]);
                setText(true);
                setActive(null);
                setIsBogo(null);
              }}
              disabled={row.deleted_at}
            />
          </Space>
        );
      },
    },
  ]);

  const data = activeMenu.data;
  const status = queryParams.get('status');
  const paramsData = {
    search: queryParams.get('search') || undefined,
    brand_id: queryParams.get('brand') || undefined,
    category_id: queryParams.get('category') || undefined,
    shop_id: queryParams.get('shop') || undefined,
    kitchen_id: queryParams.get('kitchen') || undefined,
    status: status !== 'deleted_at' ? status : undefined,
    deleted_at: status === 'deleted_at' ? 'deleted_at' : undefined,
    sort: data?.sort,
    column: data?.column,
    perPage: data?.perPage || 10,
    page: data?.page || 1,
  };

  useEffect(() => {
    console.log('Fetching products with params:', paramsData);
    dispatch(fetchProducts(paramsData));
  }, [
    paramsData.search,
    paramsData.brand_id,
    paramsData.category_id,
    paramsData.shop_id,
    paramsData.kitchen_id,
    paramsData.status,
    paramsData.sort,
    paramsData.column,
    dispatch,
  ]);

  useDidUpdate(() => {
    if (activeMenu.refetch) {
      dispatch(fetchProducts(paramsData));
      dispatch(disableRefetch(activeMenu));
    }
  }, [activeMenu.refetch]);

  const goToAddProduct = () => {
    dispatch(
      addMenu({
        id: 'product-add',
        url: `product/add`,
        name: t('add.product'),
      }),
    );
    dispatch(setMenuData({ activeMenu, data: null }));
    navigate(`/product/add`);
  };

  const goToEdit = (uuid) => {
    dispatch(
      addMenu({
        id: `product-edit`,
        url: `product/${uuid}`,
        name: t('edit.product'),
      }),
    );
    dispatch(setMenuData({ activeMenu, data: null }));
    navigate(`/product/${uuid}`);
  };

  const goToClone = (uuid) => {
    dispatch(
      addMenu({
        id: `product-clone`,
        url: `product-clone/${uuid}`,
        name: t('clone.product'),
      }),
    );
    dispatch(setMenuData({ activeMenu, data: null }));
    navigate(`/product-clone/${uuid}`);
  };

  const goToImport = () => {
    dispatch(
      addMenu({
        id: 'product-import',
        url: `catalog/product/import`,
        name: t('product.import'),
      }),
    );
    navigate(`/catalog/product/import`);
  };

  const productDelete = () => {
    setLoadingBtn(true);
    const params = {
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item,
        })),
      ),
    };
    productService
      .delete(params)
      .then(() => {
        setIsModalVisible(false);
        toast.success(t('successfully.deleted'));
        dispatch(fetchProducts(paramsData));
        setText(null);
        setActive(null);
        setIsBogo(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  const allDelete = () => {
    if (id === null || id.length === 0) {
      toast.warning(t('select.the.product'));
    } else {
      setIsModalVisible(true);
      setText(false);
    }
  };

  const productDropAll = () => {
    setLoadingBtn(true);
    productService
      .dropAll()
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchProducts({}));
        setRestore(null);
      })
      .finally(() => {
        setId(null);
        setLoadingBtn(false);
      });
  };

  const productRestoreAll = () => {
    setLoadingBtn(true);
    productService
      .restoreAll()
      .then(() => {
        toast.success(t('successfully.deleted'));
        dispatch(fetchProducts(paramsData));
        setRestore(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  const excelExport = () => {
    const params = {
      ...paramsData,
      ...Object.assign(
        {},
        ...id.map((item, index) => ({
          [`ids[${index}]`]: item || undefined,
        })),
      ),
    };
    setDownloading(true);
    productService
      .export(params)
      .then((res) => {
        window.location.href = export_url + res?.data?.file_name;
      })
      .finally(() => setDownloading(false));
  };

  const handleActive = () => {
    setLoadingBtn(true);
    productService
      .setActive(id)
      .then(() => {
        setIsModalVisible(false);
        dispatch(fetchProducts(paramsData));
        toast.success(t('successfully.updated'));
        setActive(null);
        setIsBogo(null);
      })
      .finally(() => setLoadingBtn(false));
  };

  const handleBogo = async (productId, newStatus) => {
    console.log('handleBogo called with productId:', productId, 'newStatus:', newStatus);
    setLoadingBtn(true);
    try {
      const response = await productService.setIsBogo(productId, newStatus);
      console.log('setIsBogo response:', response);
      setIsBogo(null); // Reset after action
      setIsModalVisible(false);
      dispatch(fetchProducts(paramsData));
      toast.success(t('successfully.updated'));
    } catch (error) {
      console.error('Error updating BOGO:', error);
      toast.error(t('error.updating.bogo'));
    } finally {
      setLoadingBtn(false);
    }
  };

  const onChangePagination = (pagination, filter, sorter) => {
    const { pageSize: perPage, current: page } = pagination;
    const { field: column, order } = sorter;
    const sort = formatSortType(order);
    dispatch(
      setMenuData({
        activeMenu,
        data: { ...paramsData, perPage, page, column, sort },
      }),
    );
    dispatch(fetchProducts({ ...paramsData, perPage, page, column, sort }));
  };

  const rowSelection = {
    selectedRowKeys: id,
    onChange: (key) => {
      setId(key);
    },
  };

  return (
    <React.Fragment>
      <ProductListFilter />
      <Card className='p-0'>
        <Space wrap size={[14, 20]}>
          <Button onClick={goToImport}>
            <CgImport className='mr-2' />
            {t('import')}
          </Button>
          {status !== 'deleted_at' && (
            <Button loading={downloading} onClick={excelExport}>
              <CgExport className='mr-2' />
              {t('export')}
            </Button>
          )}
          <FilterColumns columns={columns} setColumns={setColumns} />
          {status !== 'deleted_at' && (
            <DeleteButton size='' onClick={allDelete}>
              {t('delete.selected')}
            </DeleteButton>
          )}
          {status !== 'deleted_at' ? (
            <DeleteButton size='' onClick={() => setRestore({ delete: true })}>
              {t('delete.all')}
            </DeleteButton>
          ) : (
            <DeleteButton
              icon={<FaTrashRestoreAlt className='mr-2' />}
              onClick={() => setRestore({ restore: true })}
            >
              {t('restore.all')}
            </DeleteButton>
          )}
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={goToAddProduct}
          >
            {t('add.product')}
          </Button>
        </Space>
      </Card>

      <Card>
        <Tabs
          className='mt-3'
          activeKey={status || 'all'}
          onChange={(key) => {
            queryParams.set('status', key === 'all' ? '' : key);
          }}
          type='card'
        >
          {roles.map((item) => (
            <TabPane tab={t(item)} key={item} />
          ))}
        </Tabs>
        <Table
          locale={{
            emptyText: <RiveResult />,
          }}
          scroll={{ x: true }}
          rowSelection={rowSelection}
          loading={loading}
          columns={columns.filter((item) => item.is_show)}
          dataSource={products}
          pagination={{
            pageSize: meta?.perPage || 10,
            page: meta?.current_page || 1,
            total: meta?.total || 0,
            defaultCurrent: meta?.current_page || 1,
            current: meta?.current_page,
          }}
          onChange={onChangePagination}
          rowKey={(record) => record.id}
        />
      </Card>
      {productDetails && (
        <ProductStatusModal
          orderDetails={productDetails}
          handleCancel={() => setProductDetails(null)}
          paramsData={paramsData}
        />
      )}
      <CustomModal
        click={
          isBogo !== null
            ? () => handleBogo(id, isBogo)
            : active
              ? handleActive
              : productDelete
        }
        text={
          isBogo !== null
            ? t('Enable/Disable BOGO')
            : active
              ? t('set.active.product')
              : text
                ? t('delete')
                : t('all.delete')
        }
        loading={loadingBtn}
        setText={setText} // Fix: Use setText for text state
        setActive={setActive}
        setIsBogo={setIsBogo}
      />
      {restore && (
        <ResultModal
          open={restore}
          handleCancel={() => setRestore(null)}
          click={restore.restore ? productRestoreAll : productDropAll}
          text={restore.restore ? t('restore.modal.text') : t('read.carefully')}
          subTitle={restore.restore ? '' : t('confirm.deletion')}
          loading={loadingBtn}
          setText={setText}
          setActive={setActive}
          setIsBogo={setIsBogo}
        />
      )}
    </React.Fragment>
  );
};

export default ProductCategories;
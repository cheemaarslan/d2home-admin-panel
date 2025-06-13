import React, { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { Divider, Menu, Space, Layout, Modal, Input } from 'antd';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { addMenu, clearMenu, setMenu } from '../redux/slices/menu';
import { useTranslation } from 'react-i18next';
import LangModal from './lang-modal';
import getSystemIcons from '../helpers/getSystemIcons';
import NotificationBar from './notificationBar';
import { navCollapseTrigger } from '../redux/slices/theme';
import ThemeConfigurator from './theme-configurator';
import i18n from '../configs/i18next';
import { RiArrowDownSFill } from 'react-icons/ri';
import Scrollbars from 'react-custom-scrollbars';
import NavProfile from './nav-profile';
import { batch } from 'react-redux';
import { clearUser } from '../redux/slices/auth';
import { setCurrentChat } from '../redux/slices/chat';
import { getSellerRoutes } from '../configs/menu-config';
import useDidUpdate from 'helpers/useDidUpdate';

const { Sider } = Layout;

const Sidebar = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useSelector((state) => state.auth, shallowEqual);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { system_refund, payment_type, by_subscription } = useSelector(
    (state) => state.globalSettings.settings,
    shallowEqual,
  );
  const { navCollapsed } = useSelector(
    (state) => state.theme.theme,
    shallowEqual,
  );
  const { languages } = useSelector((state) => state.formLang, shallowEqual);
  const dispatch = useDispatch();
  const [langModal, setLangModal] = useState(false);
  const { myShop } = useSelector((state) => state.myShop, shallowEqual);
  const { theme } = useSelector((state) => state.theme, shallowEqual);
  const parcelMode = useMemo(
    () => !!theme.parcelMode && user?.role === 'admin',
    [theme, user],
  );

  const routes = useMemo(() => {
    const isSubscriptionEnabled = by_subscription === '1';
    const excludeRoutes = { routes: [], subRoutes: [] };
    if (!isSubscriptionEnabled) {
      excludeRoutes.subRoutes.push(
        'subscriptions',
        'my.subscriptions',
        'shop.subscriptions',
      );
    }
    const baseRoutes = user?.role === 'admin' ? user.urls : getSellerRoutes(myShop, user?.role);

    return filterUserRoutes(
      baseRoutes
        ?.filter((item) => !excludeRoutes.routes.includes(item.name))
        .map((item) => ({
          ...item,
          submenu: item.submenu?.filter(
            (sub) => !excludeRoutes.subRoutes.includes(sub.name),
          ),
        })),
    );
  }, [user, myShop, by_subscription]);

  const active = routes?.find((item) => pathname.includes(item.url));
  const [searchTerm, setSearchTerm] = useState('');
  const [data, setData] = useState(parcelMode ? (user?.role === 'admin' ? user.urls : getSellerRoutes(myShop, user?.role)) : routes);

  useDidUpdate(() => {
    const newData = parcelMode ? (user?.role === 'admin' ? user.urls : getSellerRoutes(myShop, user?.role)) : routes;
    setData(newData);
  }, [theme, user, myShop]);

  const addNewItem = (item) => {
    if (typeof item.url === 'undefined') return;
    if (item.name === 'logout') {
      setIsModalVisible(true);
      return;
    }
    const data = {
      ...item,
      icon: undefined,
      children: undefined,
      refetch: true,
    };
    dispatch(setMenu(data));
    navigate(`/${item.url}`);
  };

  function filterUserRoutes(routes) {
    let list = routes || [];
    if (myShop?.type === 'shop') {
      list = routes?.filter((item) => item?.name !== 'brands');
    }
    if (payment_type === 'admin') {
      list = routes?.filter((item) => item?.name !== 'payments');
    }
    if (system_refund === '0') {
      list = routes?.filter((item) => item?.name !== 'refunds');
    }
    return list;
  }

  const menuTrigger = (event) => {
    event.stopPropagation();
    dispatch(navCollapseTrigger());
  };

  const addMenuItem = (payload) => {
    const data = { ...payload, icon: undefined };
    dispatch(addMenu(data));
  };

  const handleOk = () => {
    batch(() => {
      dispatch(clearUser());
      dispatch(clearMenu());
      dispatch(setCurrentChat(null));
    });
    setIsModalVisible(false);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleCancel = () => setIsModalVisible(false);

  function getOptionList(routes) {
    const optionTree = [];
    routes?.map((item) => {
      optionTree.push(item);
      item?.submenu?.map((sub) => {
        optionTree.push(sub);
        sub?.children?.map((child) => {
          optionTree.push(child);
        });
      });
    });
    return optionTree;
  }

  const optionList = getOptionList(data);

  const menuList =
    searchTerm.length > 0
      ? optionList.filter((input) =>
          t(input?.name ?? '')
            .toUpperCase()
            .includes(searchTerm.toUpperCase()),
        )
      : data;

  // Transform menuList into items format for antd Menu
  const menuItems = menuList?.map((item, idx) => ({
    key: item.id + '_' + idx,
    label: item.submenu?.length > 0 ? t(item.name) : (
      <Link to={'/' + item.url} onClick={() => addNewItem(item)}>
        {t(item.name)}
      </Link>
    ),
    icon: getSystemIcons(item.icon),
    children: item.submenu?.length > 0 ? item.submenu.map((submenu, idy) => ({
      key: submenu.id + '_' + idy,
      label: submenu.children?.length > 0 ? t(submenu.name) : (
        <Link to={'/' + submenu.url} onClick={() => addNewItem(submenu)}>
          {t(submenu.name)}
        </Link>
      ),
      icon: getSystemIcons(submenu.icon),
      children: submenu.children?.length > 0 ? submenu.children.map((sub, idk) => ({
        key: 'child' + idk + sub.id,
        label: (
          <Link to={'/' + sub.url} onClick={() => addMenuItem(sub)}>
            {t(sub.name)}
          </Link>
        ),
        icon: getSystemIcons(sub.icon),
      })) : undefined,
    })) : undefined,
  }));

  // Handle menu item and submenu title clicks
  const handleMenuClick = ({ key }) => {
    // Find the clicked item in menuList by key
    const findItem = (items, key) => {
      for (const i of items) {
        if (i.id + '_' + items.indexOf(i) === key) return i;
        if (i.submenu) {
          for (const s of i.submenu) {
            if (s.id + '_' + i.submenu.indexOf(s) === key) return s;
            if (s.children) {
              for (const c of s.children) {
                if ('child' + s.children.indexOf(c) + c.id === key) return c;
              }
            }
          }
        }
      }
      return null;
    };

    const clickedItem = findItem(menuList, key);
    if (clickedItem) {
      if (clickedItem.children?.length > 0) {
        // Submenu title clicked
        addNewItem(clickedItem);
      } else {
        // Leaf item clicked
        addMenuItem(clickedItem);
      }
    }
  };

  return (
    <>
      <Sider
        className='navbar-nav side-nav'
        width={250}
        collapsed={navCollapsed}
        style={{ height: '100vh', top: 0 }}
      >
        <NavProfile user={user} />
        <div className='menu-collapse' onClick={menuTrigger}>
          <MenuFoldOutlined />
        </div>
        {navCollapsed && (
          <div className='flex justify-content-center'>
            <ThemeConfigurator />
          </div>
        )}

        {!navCollapsed ? (
          <Space className='mx-4 mt-2 d-flex justify-content-between'>
            <span className='icon-button' onClick={() => setLangModal(true)}>
              <img
                className='globalOutlined'
                src={
                  languages.find((item) => item.locale === i18n.language)?.img
                }
                alt={user.fullName}
              />
              <span className='default-lang'>{i18n.language}</span>
              <RiArrowDownSFill size={15} />
            </span>
            <span className='d-flex'>
              <ThemeConfigurator />
              <NotificationBar />
            </span>
          </Space>
        ) : (
          <div className='menu-unfold' onClick={menuTrigger}>
            <MenuUnfoldOutlined />
          </div>
        )}
        <Divider style={{ margin: '10px 0' }} />

        {!navCollapsed && (
          <span className='mt-2 mb-2 d-flex justify-content-center'>
            <Input
              placeholder='search'
              style={{ width: '90%' }}
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
              }}
              prefix={<SearchOutlined />}
            />
          </span>
        )}

        <Scrollbars
          autoHeight
          autoHeightMin={window.innerHeight > 969 ? '80vh' : '77vh'}
          autoHeightMax={window.innerHeight > 969 ? '80vh' : '77vh'}
          autoHide
        >
          <Menu
            theme='light'
            mode='inline'
            defaultSelectedKeys={[String(active?.id)]}
            defaultOpenKeys={
              !navCollapsed ? data?.map((i, idx) => i.id + '_' + idx) : []
            }
            items={menuItems}
            onClick={handleMenuClick}
          />
        </Scrollbars>
      </Sider>

      {langModal && (
        <LangModal
          visible={langModal}
          handleCancel={() => setLangModal(false)}
        />
      )}

      <Modal
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
      >
        <LogoutOutlined
          style={{ fontSize: '25px', color: '#08c' }}
          theme='primary'
        />
        <span className='ml-2'>{t('leave.site')}</span>
      </Modal>
    </>
  );
};

export default Sidebar;
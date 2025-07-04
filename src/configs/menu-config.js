const adminRoutes = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    url: 'dashboard',
    id: 'dashboard_01',
  },
  {
    name: 'pos.system',
    icon: 'laptop',
    url: 'pos-system',
    id: 'pos.system_01',
  },
    {
    name: 'Seller Finance',
    icon: 'laptop',
    url: 'seller-finance',
    id: 'seller_finance',
  },
  {
    name: 'Deliveryman Finance',
    icon: 'laptop',
    url: 'deliveryman-finance',
    id: 'deliveryman_finance',
  },
  {
    name: 'order',
    id: 'order.management',
    icon: 'fiShoppingCart',
    submenu: [
      {
        name: 'all.orders',
        icon: 'fiShoppingCart',
        url: 'orders-board',
        id: 'orders-board',
        children: [],
      },
      {
        name: 'delivery.orders',
        icon: 'TbTruckDelivery',
        url: 'orders-board/delivery',
        id: 'order-list-delivery',
        children: [],
      },
      {
        name: 'dine.in.orders',
        icon: 'MdOutlineTableBar',
        url: 'orders-board/dine_in',
        id: 'admin-orders-board-dine-in',
        children: [],
      },
      {
        name: 'pickup.orders',
        icon: 'lightning',
        url: 'orders-board/pickup',
        id: 'order-list-pickup',
        children: [],
      },
      {
        name: 'kiosk.orders',
        icon: 'shop',
        url: 'orders-board/kiosk',
        id: 'order-list-kiosk',
        children: [],
      },
      {
        name: 'scheduled.orders',
        icon: 'clock',
        url: 'orders-board/scheduled',
        id: 'order-list-schedule',
        children: [],
      },
      {
        name: 'waiting.payment.orders',
        icon: 'wallet',
        url: 'orders-list/waiting-payment',
        id: 'order-list-waiting-payment',
        children: [],
      },
      {
        name: 'reviews',
        icon: 'star',
        url: 'reviews/order',
        id: 'order-review_01',
        children: [],
      },
      {
        name: 'refunds',
        icon: 'TbReceiptRefund',
        url: 'refunds',
        id: 'refunds_02',
        children: [],
      },
      {
        name: 'order.status',
        icon: 'RiFileSettingsLine',
        url: 'settings/orderStatus',
        id: 'order.status',
        children: [],
      },
    ],
  },
  {
    name: 'shops',
    id: 'shop.management_04',
    icon: 'shop',
    submenu: [
      {
        name: 'shops',
        icon: 'shop',
        url: 'shops',
        id: 'shops',
        children: [],
      },
      {
        name: 'shop.tag',
        icon: 'shop',
        url: 'shop-tag',
        id: 'tag',
        children: [],
      },
      {
        name: 'categories',
        icon: 'appStore',
        url: 'catalog/shop/categories',
        id: 'shop.categories',
        children: [],
      },
      {
        name: 'shop.reviews',
        icon: 'star',
        url: 'shop-reviews',
        id: 'shop-review_01',
        children: [],
      },
    ],
  },
  {
    name: 'product',
    id: 'food.management',
    icon: 'branches',
    submenu: [
      {
        name: 'products',
        icon: 'dropbox',
        url: 'catalog/products',
        id: 'food',
        children: [],
      },
      {
        name: 'recepts',
        icon: 'recept',
        url: 'catalog/recept',
        id: 'recept',
        children: [],
      },
      {
        name: 'addons',
        icon: 'SlPuzzle',
        url: 'catalog/addons',
        id: 'addons',
        children: [],
      },
      {
        name: 'extras',
        icon: 'branches',
        url: 'catalog/extras/list',
        id: 'extras',
        children: [
          {
            name: 'extra.group',
            icon: 'groupOutlined',
            url: 'catalog/extras',
            id: 'extra.group',
          },
          {
            name: 'extra.value',
            icon: 'unGroupOutlined',
            url: 'catalog/extras/value',
            id: 'extra.value',
          },
        ],
      },
      {
        name: 'categories',
        icon: 'appStore',
        url: 'catalog/categories',
        id: 'categories',
        children: [],
      },

      {
        name: 'recipe.categories',
        icon: 'appStore',
        url: 'catalog/recipe-categories',
        id: 'recipe.categories',
        children: [],
      },
      // {
      //   name: 'menu.categories',
      //   icon: 'appStore',
      //   url: 'catalog/menu/categories',
      //   id: 'menu.categories',
      //   children: [],
      // },
      {
        name: 'product.reviews',
        icon: 'skin',
        url: 'reviews/product',
        id: 'product-review',
        children: [],
      },
    ],
  },
  {
    name: 'content',
    id: 'content.management',
    icon: 'appStoreAdd',
    submenu: [
      {
        name: 'brands',
        icon: 'appStoreAdd',
        url: 'catalog/brands',
        id: 'brands',
        children: [],
      },
      {
        name: 'career',
        icon: 'CaretUpOutlined',
        url: 'careers/list',
        id: 'career.list',
        children: [
          {
            name: 'career',
            icon: 'caretUp',
            url: 'catalog/career',
            id: 'catalog.career',
            children: [],
          },
          {
            name: 'career.categories',
            icon: 'careerCategory',
            url: 'catalog/career-categories',
            id: 'career.categories',
            children: [],
          },
        ],
      },
      {
        name: 'units',
        icon: 'disconnect',
        url: 'catalog/units',
        id: 'units',
        children: [],
      },
      {
        name: 'banners',
        icon: 'bsImage',
        url: 'banners',
        id: 'banners',
        children: [],
      },
      {
        name: 'blogs',
        url: 'blogs',
        icon: 'form',
        id: 'blogs_02',
        children: [],
      },
      {
        name: 'stories',
        icon: 'BsClockHistory',
        url: 'stories',
        id: 'stories',
        children: [],
      },
      {
        name: 'gallery',
        url: 'gallery',
        icon: 'fiImage',
        id: 'gallery',
        children: [],
      },
      {
        name: 'notifications',
        icon: 'notificationsActive',
        url: 'notifications',
        id: 'notifications',
        children: [],
      },
    ],
  },
  {
    name: 'deliveryman',
    id: 'deliveryman.management',
    icon: 'CarOutlined',
    submenu: [
      {
        name: 'deliveries.list',
        icon: 'TbTruckDelivery',
        id: 'deliveries_list',
        url: 'deliveries/list',
        children: [],
      },
      {
        name: 'deliveries.map',
        icon: 'TbSitemap',
        id: 'deliveries_map',
        url: 'deliveries/map',
        children: [],
      },
      {
        name: 'delivery.statistics',
        icon: 'ImStatsDots',
        id: 'delivery.statistics',
        url: 'delivery/statistics',
        children: [],
      },
      {
        name: 'deliveryboy.reviews',
        icon: 'TbTruckDelivery',
        url: 'reviews/deliveryboy',
        id: 'deliveryboy-reviews_01',
        children: [],
      },
      {
        name: 'deliveryman.request',
        icon: 'QuestionCircleOutlined',
        url: 'deliveryman/request',
        id: 'deliveryman-request_01',
        children: [],
      },
    ],
  },
  {
    name: 'customer',
    id: 'customer.management_02',
    icon: 'wallet',
    submenu: [
      {
        name: 'wallets',
        icon: 'wallet',
        url: 'wallets',
        id: 'wallets_01',
        children: [],
      },
      {
        name: 'payment.to.sellers',
        icon: 'moneyOut',
        id: 'withdraws',
        url: 'payments/sellers',
        children: [
          {
            name: 'payment.to.sellers',
            icon: 'moneyOut',
            url: 'withdraws/seller',
            id: 'withdraws.seller_uncomplete',
          },
          {
            name: 'completed.payments',
            icon: 'check',
            url: 'completed-withdraws/seller',
            id: 'withdraws.completed_seller_uncomplete',
          },
        ],
      },
      {
        name: 'payment.to.deliverymans',
        icon: 'TbTruckDelivery',
        id: 'withdraw.deliverymans',
        url: 'payments/deliverymans',
        children: [
          {
            name: 'payment.to.deliverymans',
            icon: 'TbTruckDelivery',
            url: 'withdraws/deliveryman',
            id: 'withdraw.deliverymans_uncomplete',
          },
          {
            name: 'completed.payments',
            icon: 'check',
            url: 'completed-withdraws/deliveryman',
            id: 'withdraw.completed_deliverymans_uncomplete',
          },
        ],
      },
      {
        name: 'users',
        icon: 'user',
        url: 'users',
        id: 'user_list',
        children: [
          {
            name: 'clients',
            icon: 'user',
            url: 'users/user',
            id: 'user',
          },
          {
            name: 'users',
            icon: 'userGroupAdd',
            url: 'users/admin',
            id: 'userGroupAdd',
          },
          {
            name: 'roles',
            icon: 'userSwitch',
            url: 'users/role',
            id: 'userSwitch',
          },
        ],
      },
      {
        name: 'email.subscriber',
        icon: 'mail',
        url: 'email/subscriber',
        id: 'email.subscriber_01',
        children: [
          {
            name: 'subscriber',
            icon: 'MdNotificationAdd',
            url: 'subscriber',
            id: 'subscriber',
          },
          {
            name: 'message.subscriber',
            icon: 'MdNotificationAdd',
            url: 'message/subscriber',
            id: 'message.subscriber',
          },
        ],
      },
    ],
  },
  {
    name: 'ads',
    id: 'advert.management',
    icon: 'appStoreAdd',
    submenu: [
      {
        name: 'ads',
        id: 'ads',
        url: 'catalog/advert',
        icon: 'appStore',
      },
      {
        name: 'shop.ads',
        id: 'shop_ads',
        url: 'catalog/shop-ads',
        icon: 'appStore',
      },
    ],
  },
  {
    name: 'transaction',
    id: 'transaction.management',
    icon: 'transaction',
    submenu: [
      {
        name: 'transactions',
        icon: 'transaction',
        url: 'transactions',
        id: 'transactions',
        children: [],
      },
      {
        name: 'payout.requests',
        icon: 'dollar',
        url: 'payout-requests',
        id: 'payout-requests',
        children: [],
      },
      {
        name: 'payouts',
        icon: 'moneyOut',
        url: 'payouts',
        id: 'admin.payouts',
        children: [],
      },
      {
        name: 'subscriptions',
        icon: 'imSubscript',
        url: 'subscriptions',
        id: 13,
        children: [],
      },
    ],
  },
  {
    name: 'marketing',
    id: 'restaurant.management_05',
    icon: 'copyright',
    submenu: [
      {
        name: 'cashback',
        icon: 'copyright',
        url: 'cashback',
        id: 'cashback_01',
        children: [],
      },
      {
        name: 'referral',
        icon: 'referral',
        url: 'settings/referal',
        id: 'referral_02',
        children: [],
      },
      {
        name: 'bonus',
        icon: 'GiftOutlined',
        url: 'bonus/list',
        id: 'bonus_02',
        children: [],
      },
    ],
  },
  {
    name: 'analytics.and.reports',
    id: 'analytics',
    icon: 'products',
    submenu: [
      {
        name: 'products',
        icon: 'products',
        url: 'report/products',
        id: 'report-products',
        children: [],
      },
      {
        name: 'order',
        icon: 'orders',
        url: 'report/orders',
        id: 'report-orders',
        children: [],
      },
      {
        name: 'stock',
        icon: 'stock',
        url: 'report/stock',
        id: 'report-stock',
        children: [],
      },
      {
        name: 'category',
        icon: 'categories',
        url: 'report/categories',
        id: 'report-categories',
        children: [],
      },
      {
        name: 'overview',
        icon: 'overview',
        url: 'report/overview',
        id: 'report-overview',
        children: [],
      },
      {
        name: 'revenue',
        icon: 'revenue',
        url: 'report/revenue',
        id: 'report-revenue',
        children: [],
      },
      {
        name: 'variation',
        icon: 'variation',
        url: 'report/extras',
        id: 'report-variation',
        children: [],
      },
    ],
  },
  {
    name: 'business.settings',
    id: 'business.settings_02',
    icon: 'settings',
    submenu: [
      {
        name: 'settings.general',
        icon: 'settings',
        url: 'settings/general',
        id: 'settings.general_02',
        children: [],
      },
      {
        name: 'currencies',
        icon: 'moneyCollect',
        url: 'currencies',
        id: 'currencies',
        children: [],
      },
      {
        name: 'payments',
        icon: 'wallet',
        url: 'settings/payments',
        id: 'payments',
        children: [],
      },
      {
        name: 'payment.payloads',
        icon: 'payload',
        url: 'payment-payloads',
        id: 'payment.payloads',
        children: [],
      },
      {
        name: 'sms-payload',
        icon: 'message',
        url: 'settings/sms-payload',
        id: 'sms-payload',
        children: [],
      },
      {
        name: 'email.provider',
        icon: 'emailSettings',
        url: 'settings/emailProviders',
        id: 'settings_email.provider_02',
        children: [],
      },
      {
        name: 'notification.settings',
        icon: 'notificationsActive',
        url: 'settings/firebase',
        id: 'notification.settings',
        children: [],
      },
      {
        name: 'social.settings',
        icon: 'instagram',
        url: 'settings/social',
        id: 'instagram_social-settings_01',
        children: [],
      },
      {
        name: 'app.settings',
        icon: 'GrAppleAppStore',
        url: 'settings/app',
        id: 'app-settings',
        children: [],
      },
      {
        name: 'page.setup',
        icon: 'settings',
        url: 'settings',
        id: 'page.setup',
        children: [
          {
            name: 'faq',
            icon: 'questionCircle',
            url: 'settings/faqs',
            id: 'faq',
          },
          {
            name: 'terms',
            icon: 'paperClip',
            url: 'settings/terms',
            id: 'terms',
          },
          {
            name: 'policy',
            icon: 'lock',
            url: 'settings/policy',
            id: 'policy',
          },
          {
            name: 'pages',
            icon: 'RiPageSeparator',
            url: 'pages',
            id: 'pages',
          },
          {
            name: 'landing.page',
            icon: 'FileTextOutlined',
            url: 'settings/landing-page',
            id: 'settings/landing-page',
          },
        ],
      },
    ],
  },
  {
    name: 'system.settings',
    id: 'system.settings_01',
    icon: 'global',
    submenu: [
      {
        name: 'languages',
        icon: 'global',
        url: 'settings/languages',
        id: 'languages_02',
        children: [],
      },
      {
        name: 'translations',
        icon: 'translation',
        url: 'settings/translations',
        id: 'translations_01',
        children: [],
      },
      {
        icon: 'database',
        url: 'settings/backup',
        name: 'backup',
        id: 'backup_01',
        children: [],
      },
      {
        name: 'system.information',
        icon: 'tool',
        url: 'settings/system-information',
        id: 'settings/system-informations_tool_01',
        children: [],
      },
      {
        name: 'update',
        icon: 'cloudUpload',
        url: 'settings/update',
        id: 'update',
        children: [],
      },
      // {
      //   icon: 'cloudUpload',
      //   url: 'settings/bookingUpload',
      //   name: 'bookingUpload',
      //   id: 'bookingUpload',
      //   children: [],
      // },
      {
        icon: 'AiOutlineClear',
        url: 'settings/cashClear',
        name: 'clear.cash',
        id: 'clear_cash_02',
        children: [],
      },
    ],
  },
  {
    name: 'logout',
    icon: 'logout',
    url: '',
    id: 'logout_04',
  },
];

const managerRoutes = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    url: 'dashboard',
    id: 'dashboard_02',
  },
  {
    name: 'pos.system',
    icon: 'laptop',
    url: 'pos-system',
    id: 'pos_system_02',
  },

  {
    name: 'order',
    id: 'order.management',
    icon: 'fiShoppingCart',
    submenu: [
      {
        name: 'all.orders',
        icon: 'fiShoppingCart',
        url: 'orders-board',
        id: 'orders-board',
        children: [],
      },
      {
        name: 'delivery.orders',
        icon: 'TbTruckDelivery',
        url: 'orders-board/delivery',
        id: 'order-list-delivery',
        children: [],
      },
      {
        name: 'pickup.orders',
        icon: 'lightning',
        url: 'orders-board/pickup',
        id: 'order-list-pickup',
        children: [],
      },
      {
        name: 'scheduled.orders',
        icon: 'clock',
        url: 'orders-board/scheduled',
        id: 'order-list-schedule',
        children: [],
      },
      {
        name: 'reviews',
        icon: 'star',
        url: 'reviews/order',
        id: 'order-review_01',
        children: [],
      },
      {
        name: 'refunds',
        icon: 'TbReceiptRefund',
        url: 'refunds',
        id: 'refunds_02',
        children: [],
      },
      {
        icon: 'RiFileSettingsLine',
        url: 'settings/orderStatus',
        name: 'order.status',
        id: 'order.status',
        children: [],
      },
    ],
  },
  {
    name: 'deliveryman',
    id: 'deliveryman.management',
    icon: 'CarOutlined',
    submenu: [
      {
        name: 'deliveries.list',
        icon: 'TbTruckDelivery',
        id: 'deliveries_list',
        url: 'deliveries/list',
        children: [],
      },
      {
        name: 'deliveries.map',
        icon: 'TbSitemap',
        id: 'deliveries_map',
        url: 'deliveries/map',
        children: [],
      },
      {
        name: 'delivery.statistics',
        icon: 'ImStatsDots',
        id: 'delivery.statistics',
        url: 'delivery/statistics',
        children: [],
      },
      {
        name: 'deliveryboy.reviews',
        icon: 'TbTruckDelivery',
        url: 'reviews/deliveryboy',
        id: 'deliveryboy-reviews_01',
        children: [],
      },
    ],
  },
  {
    name: 'restaurant',
    id: 'restaurant.management_01',
    icon: 'shop',
    submenu: [
      {
        name: 'restaurants',
        icon: 'shop',
        url: 'restaurants',
        id: 'restaurants',
        children: [],
      },
      {
        name: 'shops',
        icon: 'shop',
        url: 'shops',
        id: 'shops',
        children: [],
      },
      {
        name: 'shop.tag',
        icon: 'shop',
        url: 'shop-tag',
        id: 'tag',
        children: [],
      },
      {
        name: 'categories',
        icon: 'appStore',
        url: 'catalog/shop/categories',
        id: 'shop_categories',
        children: [],
      },
    ],
  },
  {
    name: 'product',
    id: 'food_management',
    icon: 'branches',
    submenu: [
      {
        name: 'products',
        icon: 'dropbox',
        url: 'catalog/products',
        id: 'food',
        children: [],
      },
      {
        name: 'addons',
        icon: 'SlPuzzle',
        url: 'catalog/addons',
        id: 'addons',
        children: [],
      },
      {
        name: 'extras',
        icon: 'branches',
        url: 'catalog/extras/list',
        id: 'extras',
        children: [
          {
            name: 'extra.group',
            icon: 'groupOutlined',
            url: 'catalog/extras',
            id: 'extra_group',
          },
          {
            name: 'extra.value',
            icon: 'unGroupOutlined',
            url: 'catalog/extras/value',
            id: 'extra_value',
          },
        ],
      },
      {
        name: 'categories',
        icon: 'appStore',
        url: 'catalog/categories',
        id: 'categories',
        children: [],
      },
      {
        name: 'product.reviews',
        icon: 'skin',
        url: 'reviews/product',
        id: 'product-review',
        children: [],
      },
    ],
  },
  {
    name: 'content',
    id: 'content.management',
    icon: 'appStoreAdd',
    submenu: [
      {
        name: 'brands',
        icon: 'appStoreAdd',
        url: 'catalog/brands',
        id: 'brands',
        children: [],
      },
      {
        name: 'units',
        icon: 'disconnect',
        url: 'catalog/units',
        id: 'units',
        children: [],
      },
      {
        name: 'banners',
        icon: 'bsImage',
        url: 'banners',
        id: 'banners_01',
        children: [],
      },
      {
        name: 'blogs',
        url: 'blogs',
        icon: 'form',
        id: 'blogs_01',
        children: [],
      },
      {
        name: 'stories',
        icon: 'BsClockHistory',
        url: 'stories',
        id: 'stories',
        children: [],
      },
      {
        name: 'gallery',
        url: 'gallery',
        icon: 'fiImage',
        id: 17,
        children: [],
      },
      {
        name: 'notifications',
        icon: 'notificationsActive',
        url: 'notifications',
        id: 11,
        children: [],
      },
    ],
  },
  {
    name: 'customer',
    id: 'customer.management_01',
    icon: 'wallet',
    submenu: [
      {
        name: 'wallets',
        icon: 'wallet',
        url: 'wallets',
        id: 'wallets_02',
        children: [],
      },
      {
        name: 'users',
        id: 'user',
        icon: 'user',
        url: 'users',
        children: [
          {
            icon: 'user',
            url: 'users/user',
            name: 'clients',
            id: 'users',
          },
          {
            icon: 'userGroupAdd',
            url: 'users/admin',
            name: 'users',
            id: 'userGroupAdd',
          },
          {
            icon: 'userSwitch',
            url: 'users/role',
            name: 'roles',
            id: 'userSwitch',
          },
        ],
      },
      {
        name: 'email.subscriber',
        icon: 'mail',
        url: 'email/subscriber',
        id: 'email_subscriber_02',
        children: [
          {
            icon: 'MdNotificationAdd',
            url: 'subscriber',
            name: 'subscriber',
            id: 'subscriber',
          },
          {
            icon: 'MdNotificationAdd',
            url: 'message/subscriber',
            name: 'message.subscriber',
            id: 'message_subscriber',
          },
        ],
      },
    ],
  },
  {
    name: 'transaction',
    id: 'transaction.management',
    icon: 'transaction',
    submenu: [
      {
        name: 'transactions',
        icon: 'transaction',
        url: 'transactions',
        id: 'transactions',
        children: [],
      },
      {
        name: 'payout.requests',
        icon: 'dollar',
        url: 'payout-requests',
        id: 'payout-requests',
        children: [],
      },
      {
        name: 'payouts',
        icon: 'moneyOut',
        url: 'payouts',
        id: 'admin_payouts',
        children: [],
      },
      {
        name: 'subscriptions',
        icon: 'imSubscript',
        url: 'subscriptions',
        id: 'subscriptions',
        children: [],
      },
    ],
  },
  {
    name: 'marketing',
    id: 'management_02',
    icon: 'copyright',
    submenu: [
      {
        name: 'cashback',
        icon: 'copyright',
        url: 'cashback',
        id: 'cashback_02',
        children: [],
      },
      {
        icon: 'referral',
        url: 'settings/referal',
        name: 'referral',
        id: 'referral_01',
        children: [],
      },
      {
        icon: 'GiftOutlined',
        name: 'bonus',
        url: 'bonus/list',
        id: 'bonus_01',
        children: [],
      },
    ],
  },
  {
    name: 'ANALYTICS.ADN.REPORTS',
    id: 'analytics',
    icon: 'products',
    submenu: [
      {
        name: 'food',
        icon: 'products',
        url: 'report/products',
        id: 'report-products',
        children: [],
      },
      {
        name: 'order',
        icon: 'orders',
        url: 'report/orders',
        id: 'report-orders',
        children: [],
      },
      {
        name: 'stock',
        icon: 'stock',
        url: 'report/stock',
        id: 'report-stock',
        children: [],
      },
      {
        name: 'category',
        icon: 'categories',
        url: 'report/categories',
        id: 'report-categories',
        children: [],
      },
      {
        name: 'overview',
        icon: 'overview',
        url: 'report/overview',
        id: 'report-overview',
        children: [],
      },
      {
        name: 'revenue',
        icon: 'revenue',
        url: 'report/revenue',
        id: 'report-revenue',
        children: [],
      },
      {
        name: 'variation',
        icon: 'variation',
        url: 'report/extras',
        id: 'report-variation',
        children: [],
      },
    ],
  },
  {
    name: 'business.settings',
    id: 'business_settings_01',
    icon: 'settings',
    submenu: [
      {
        icon: 'settings',
        url: 'settings/general',
        name: 'settings.general',
        id: 'settings_general_01',
        children: [],
      },
      {
        icon: 'moneyCollect',
        url: 'currencies',
        name: 'currencies',
        id: 'currencies',
        children: [],
      },
      {
        icon: 'wallet',
        url: 'settings/payments',
        name: 'payments',
        id: 'payments',
        children: [],
      },
      {
        icon: 'message',
        url: 'settings/sms-gateways',
        name: 'sms-gateways',
        id: 'sms-gateways',
        children: [],
      },
      {
        icon: 'emailSettings',
        url: 'settings/emailProviders',
        name: 'email.provider',
        id: 'email_provider_01',
        children: [],
      },
      {
        icon: 'notificationsActive',
        url: 'settings/firebase',
        name: 'notification.settings',
        id: 'notification_settings',
        children: [],
      },
      {
        icon: 'instagram',
        url: 'settings/social',
        name: 'social.settings',
        id: 'social_settings_id',
        children: [],
      },
      {
        icon: 'settings',
        url: 'settings',
        name: 'page.setup',
        id: 'page_setup',
        children: [
          {
            icon: 'questionCircle',
            url: 'settings/faqs',
            name: 'FAQ',
            id: 'faq',
          },
          {
            icon: 'paperClip',
            url: 'settings/terms',
            name: 'terms',
            id: 'terms',
          },
          {
            icon: 'lock',
            url: 'settings/policy',
            name: 'policy',
            id: 'policy',
          },
        ],
      },
    ],
  },
  {
    name: 'system.settings',
    id: 'system_settings_02',
    icon: 'global',
    submenu: [
      {
        icon: 'global',
        url: 'settings/languages',
        name: 'languages',
        id: 'languages_01',
        children: [],
      },
      {
        icon: 'translation',
        url: 'settings/translations',
        name: 'translations',
        id: 'translations_02',
        children: [],
      },
      {
        icon: 'database',
        url: 'settings/backup',
        name: 'backup',
        id: 'backup_02',
        children: [],
      },
      {
        icon: 'tool',
        url: 'settings/system-information',
        name: 'system.information',
        id: 'system_informations',
        children: [],
      },
      {
        icon: 'cloudUpload',
        url: 'settings/update',
        name: 'update',
        id: 'update',
        children: [],
      },
      {
        icon: 'AiOutlineClear',
        url: 'settings/cashClear',
        name: 'clear.cash',
        id: 'clear_cash_02',
        children: [],
      },
    ],
  },
  {
    name: 'logout',
    icon: 'logout',
    url: '',
    id: 'logout_05',
  },
];

const sellerRoutes = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    url: 'dashboard',
    id: 'dashboard_03',
    role: 'admin',
  },
  {
    name: 'pos.system',
    icon: 'laptop',
    url: 'seller/pos-system',
    id: 'pos-system',
  },
  {
    name: 'wallet',
    id: 'wallet',
    icon: 'wallet',
    url: 'seller/wallet',
  },
  {
    name: 'reservation',
    id: 'order_management',
    icon: 'BookOutlined',
    submenu: [
      {
        name: 'reservation.list',
        icon: 'BsCalendarCheck',
        url: 'seller/bookingList',
        id: 'seller/BookingList',
        children: [],
      },
      {
        name: 'reservation',
        icon: 'BsCalendarCheck',
        url: 'seller/booking',
        id: 'seller/booking',
        children: [],
      },
      {
        name: 'reservation.zone',
        icon: 'BiMapPin',
        url: 'seller/booking/zone',
        id: 'seller-reservation-zone',
        children: [],
      },
      {
        name: 'tables.and.qrcode',
        icon: 'QrcodeOutlined',
        url: 'seller/booking/tables',
        id: 'reservation-tables',
        children: [],
      },
      {
        name: 'reservation.time',
        icon: 'AiOutlineFieldTime',
        url: 'seller/booking/time',
        id: 'reservation-time',
        children: [],
      },
    ],
  },
  {
    name: 'order',
    id: 'order_management',
    icon: 'fiShoppingCart',
    submenu: [
      {
        name: 'all.orders',
        icon: 'fiShoppingCart',
        url: 'seller/orders-board',
        id: 'orders-board',
        children: [],
      },
      {
        name: 'dine.in.orders',
        icon: 'MdOutlineTableBar',
        url: 'seller/orders-board/dine_in',
        id: 'orders-board-dine-in',
        children: [],
      },
      {
        name: 'kiosk.orders',
        icon: 'shop',
        url: 'seller/orders-board/kiosk',
        id: 'seller-order-list-kiosk',
        children: [],
      },
      {
        name: 'waiting.payment.orders',
        icon: 'wallet',
        url: 'seller/orders-list/waiting-payment',
        id: 'order-list-waiting-payment',
        children: [],
      },
      {
        name: 'reviews',
        icon: 'star',
        url: 'seller/reviews/order',
        id: 'order-review_01',
        children: [],
      },
      {
        name: 'refunds',
        icon: 'TbReceiptRefund',
        url: 'seller/refunds',
        id: 'refunds_01',
        children: [],
      },
    ],
  },
  {
    name: 'restaurant',
    id: 'restaurants_management',
    icon: 'shop',
    submenu: [
      {
        name: 'my.shop',
        icon: 'shop',
        url: 'my-shop',
        id: 'my-shop',
      },
      {
        name: 'shop.review',
        icon: 'star',
        url: 'seller/shop-reviews',
        id: 'shop-reviews',
      },
      {
        name: 'branch',
        icon: 'branchesOutlined',
        url: 'seller/branch',
        id: 'branch',
        children: [],
      },
      {
        name: 'kitchen',
        icon: 'knife',
        url: 'seller/kitchen',
        id: 'kitchen',
        children: [],
      },
      {
        name: 'users',
        icon: 'user',
        url: 'seller/shop-users',
        id: 'users',
        children: [],
      },
    ],
  },
  {
    name: 'product',
    id: 'food_management',
    icon: 'branches',
    submenu: [
      {
        icon: 'SlPuzzle',
        url: 'seller/addons',
        name: 'addons',
        id: 'addons',
        children: [],
      },
      {
        name: 'recepts',
        icon: 'recept',
        url: 'seller/recept',
        id: 'recept',
        children: [],
      },
      {
        name: 'discounts',
        icon: 'euroCircle',
        url: 'seller/discounts',
        id: 'discounts',
        children: [],
      },
      {
        icon: 'dropbox',
        url: 'seller/products',
        name: 'product',
        id: 'dropbox',
        children: [],
      },
      {
        name: 'product.categories',
        icon: 'appStore',
        url: 'seller/categories',
        id: 'categories',
        children: [],
      },
      {
        name: 'recipe.categories',
        icon: 'appStore',
        url: 'seller/recipe-categories',
        id: 'recipe.categories',
        children: [],
      },
      {
        icon: 'branches',
        url: 'extras',
        name: 'extra.group',
        id: 'branches',
        children: [],
      },
      {
        icon: 'branches',
        url: 'extras/value',
        name: 'extra.value',
        id: 'extra_value',
        children: [],
      },
      {
        name: 'product.reviews',
        icon: 'skin',
        url: 'seller/reviews/product',
        id: 'product-review',
        children: [],
      },
    ],
  },
  {
    name: 'marketing',
    id: 'restaurant_management_03',
    icon: 'calendar',
    submenu: [
      {
        name: 'coupons',
        icon: 'calendar',
        url: 'coupons',
        id: 'coupons',
        children: [],
      },
      {
        icon: 'GiftOutlined',
        name: 'shop.bonus',
        url: 'seller/bonus/shop',
        id: 'bonus_shop',
        children: [],
      },
      {
        icon: 'GiftOutlined',
        name: 'product.bonus',
        url: 'seller/bonus/product',
        id: 'bonus_product',
      },
    ],
  },
  {
    name: 'analytics.and.reports',
    id: 'analytics',
    icon: 'products',
    submenu: [
      {
        name: 'order',
        icon: 'orders',
        url: 'seller/report/orders',
        id: 'report-orders',
        children: [],
      },
    ],
  },
  {
    name: 'transaction',
    id: 'transaction_management',
    icon: 'wallet',
    submenu: [
      {
        name: 'payments',
        icon: 'wallet',
        url: 'seller/payments',
        id: 'payments',
        children: [],
      },
      {
        name: 'transactions',
        icon: 'transaction',
        url: 'seller/transactions',
        id: 'transactions',
        children: [],
      },
      {
        name: 'payment.from.admin',
        icon: 'moneyOut',
        url: 'seller/withdraws',
        id: 'withdraws',
        children: [],
      },
      {
        name: 'payouts',
        icon: 'dollar',
        url: 'seller/payouts',
        id: 'payouts',
        children: [],
      },
    ],
  },
  {
    name: 'business',
    id: 'business_management',
    icon: 'trophy',
    submenu: [
      {
        name: 'subscriptions',
        icon: 'trophy',
        url: 'seller/subscriptions',
        id: 'subscription',
        children: [],
      },
      {
        name: 'ad.packages',
        id: 'ad_packages',
        url: 'seller/advert',
        icon: 'MdOutlineTableBar',
      },
      {
        name: 'ads',
        id: 'shop_ads',
        url: 'seller/shop-ads',
        icon: 'appStore',
      },
    ],
  },
  {
    name: 'content',
    id: 'content_management',
    icon: 'appStoreAdd',
    submenu: [
      {
        name: 'stories',
        icon: 'BsClockHistory',
        url: 'seller/stories',
        id: 'seller_stories',
        children: [],
      },
      {
        name: 'brands',
        icon: 'appStoreAdd',
        url: 'seller/brands',
        id: 'brands',
        children: [],
      },
    ],
  },
  {
    name: 'logout',
    icon: 'logout',
    url: '',
    id: 'logout_01',
  },
];

const moderatorRoutes = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    url: 'dashboard',
    id: 'dashboard_04',
  },
  {
    name: 'pos.system',
    icon: 'laptop',
    url: 'seller/pos-system',
    id: 'pos-system',
  },
  {
    icon: 'dropbox',
    url: 'seller/products',
    name: 'Products',
    id: 'dropbox',
  },
  {
    name: 'categories',
    icon: 'appStore',
    url: 'seller/categories',
    id: 'categories',
  },
  {
    name: 'brands',
    icon: 'appStoreAdd',
    url: 'seller/brands',
    id: 'brands',
  },
  {
    name: 'my.shop',
    icon: 'shop',
    url: 'my-shop',
    id: 'my-shop',
  },
  {
    name: 'orders',
    icon: 'fiShoppingCart',
    url: 'seller/orders',
    id: 'orders',
  },
  {
    name: 'discounts',
    icon: 'euroCircle',
    url: 'seller/discounts',
    id: 'discounts',
  },
  {
    name: 'logout',
    icon: 'logout',
    url: '',
    id: 'logout_02',
  },
];

const deliverymanRoutes = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    url: 'dashboard',
    id: 'dashboard_05',
  },
  {
    name: 'orders',
    icon: 'fiShoppingCart',
    url: 'deliveryman/orders',
    id: 'orders',
  },
  {
    name: 'payment.from.admin',
    icon: 'moneyOut',
    url: 'deliveryman/withdraws',
    id: 'withdraws',
    children: [],
  },
  {
    name: 'logout',
    icon: 'logout',
    url: '',
    id: 'logout_03',
  },
];

const waiterRoutes = [
  {
    name: 'my.orders',
    id: 'orders-board',
    icon: 'user',
    url: 'waiter/orders-board',
  },
  {
    name: 'all.orders',
    icon: 'fiShoppingCart',
    id: 'order_management',
    url: 'waiter/orders',
  },
  {
    name: 'logout',
    icon: 'logout',
    url: '',
    id: 'logout_06',
  },
];

const parcelRoutes = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    url: 'dashboard',
    id: 'dashboard_01',
  },
  {
    name: 'parcel.order',
    id: 'parcel.order',
    icon: 'fiShoppingCart',
    submenu: [
      {
        name: 'all.orders',
        icon: 'fiShoppingCart',
        url: 'parcel-orders',
        id: 'parcel-orders',
        children: [],
      },
      {
        name: 'parcel.types',
        icon: 'star',
        url: 'parcel-types',
        id: 'parcel-types',
        children: [],
      },
      {
        name: 'options',
        icon: 'branches',
        url: 'options',
        id: 'options',
        children: [],
      },
      {
        name: 'order.status',
        icon: 'RiFileSettingsLine',
        url: 'settings/orderStatus',
        id: 'order.status',
        children: [],
      },
      {
        name: 'reviews',
        icon: 'star',
        url: 'reviews/parcel',
        id: 'order-review_01',
        children: [],
      },
    ],
  },
  {
    name: 'deliveryman',
    id: 'deliveryman.management',
    icon: 'CarOutlined',
    submenu: [
      {
        name: 'deliveries.list',
        icon: 'TbTruckDelivery',
        id: 'deliveries_list',
        url: 'deliveries/list',
        children: [],
      },
      {
        name: 'deliveries.map',
        icon: 'TbSitemap',
        id: 'deliveries_map',
        url: 'deliveries/map',
        children: [],
      },
      {
        name: 'delivery.statistics',
        icon: 'ImStatsDots',
        id: 'delivery.statistics',
        url: 'delivery/statistics',
        children: [],
      },
      {
        name: 'deliveryboy.reviews',
        icon: 'TbTruckDelivery',
        url: 'reviews/deliveryboy',
        id: 'deliveryboy-reviews_01',
        children: [],
      },
    ],
  },
  {
    name: 'logout',
    icon: 'logout',
    url: '',
    id: 'logout_04',
  },
];

export const data = {
  admin: adminRoutes,
  manager: managerRoutes,
  seller: sellerRoutes,
  moderator: moderatorRoutes,
  deliveryman: deliverymanRoutes,
  waiter: waiterRoutes,
  parcel: parcelRoutes,
};


export const getSellerRoutes = (myShop, userRole) => {
 

  // If user is admin, return all routes without filtering
  if (userRole === 'admin') {
   
    return sellerRoutes;
  }

  // For non-admin users (sellers), check myShop
  if (!myShop || typeof myShop !== 'object') {
   
    return sellerRoutes;
  }


  return sellerRoutes.filter((route) => {
    if (route.name === 'pos.system' && (myShop.pos_access === 0 || myShop.pos_access === false)) {
    
      return false; // Exclude pos.system
    }
    return true; // Include all other routes
  });
};

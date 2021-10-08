export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/article',
    name: 'article',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: 'list',
        name: 'list',
        icon: 'smile',
        component: '@/pages/article/list/index',
      },
      {
        path: 'add',
        name: 'add',
        icon: 'smile',
        component: '@/pages/article/edit',
      },
      {
        path: 'edit/:id',
        hideInMenu:true,
        keepAlive: true,
        name: 'edit',
        icon: 'smile',
        component: '@/pages/article/edit',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];

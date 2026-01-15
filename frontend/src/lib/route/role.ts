export const routeRoles = [
  {
    url: '/admin/*',
    role: ['SUPER_ADMIN'],
    needAuth: true,
    redirect: '/forbidden',
  },
  {
    url: '/tournament/*',
    role: ['PLAYER', 'ADMIN', 'SUPER_ADMIN'],
    needAuth: true,
    redirect: '/auth',
  },
  {
    url: '/settings/*',
    role: ['PLAYER', 'ADMIN', 'SUPER_ADMIN'],
    needAuth: true,
    redirect: '/auth',
  },
];

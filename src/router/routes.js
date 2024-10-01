const routes = [
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      { path: '', component: () => import('pages/LoginPage.vue') }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: '/PaginaRegistroCampania', // Aquí agregamos la ruta para las campañas
        component: () => import('pages/PaginaRegistroCampania.vue')
      },
      {
        path: '/PaginaRegistros', // Corregimos la ruta de registros
        component: () => import('pages/PaginaRegistros.vue')
      },
      {
        path: '/PaginaRegistroJefeZona',
        component: () => import('pages/PaginaRegistroJefeZona.vue')
      },
      {
        path: '/PaginaRegistroZona', // Corregimos la ruta de zonas
        component: () => import('pages/PaginaRegistroZona.vue')
      },
      {
        path: '/PaginaRegistroMiembros', // Corregimos la ruta de zonas
        component: () => import('pages/PaginaRegistroMiembros.vue')
      },
    ]
  },
  // Siempre deja esta ruta como última para manejar errores 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
]

export default routes;

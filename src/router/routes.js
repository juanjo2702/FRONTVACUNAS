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
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { roles: [2, 3] } }, // Solo Jefe de Zona y Administrador
      { path: '/PaginaRegistros', component: () => import('pages/PaginaRegistros.vue'), meta: { roles: [1, 2, 3] } }, // Todos los roles
      { path: '/PaginaRegistroJefeZona', component: () => import('pages/PaginaRegistroJefeZona.vue'), meta: { roles: [3] } }, // Solo Administrador
      { path: '/PaginaRegistroZona', component: () => import('pages/PaginaRegistroZona.vue'), meta: { roles: [3] } }, // Solo Administrador
      { path: '/PaginaRegistroCampania', component: () => import('pages/PaginaRegistroCampania.vue'), meta: { roles: [2, 3] } }, // Solo Administrador
      { path: '/PaginaRegistroMiembros', component: () => import('pages/PaginaRegistroMiembros.vue'), meta: { roles: [1, 3] } }, // Brigada y Administrador
      { path: '/PaginaConsultaVacunas', component: () => import('pages/PaginaConsultaVacunas.vue'), meta: { roles: [1, 2, 3] } }, // Todos los roles
      { path: '/PaginaCorrecciones', component: () => import('pages/PaginaCorrecciones.vue'), meta: { roles: [1, 2, 3] } }, // Todos los roles
    ]
  },
  {
    path: '/PreRegistro',
    component: () => import('pages/PaginaRegistrosPublicos.vue') // Página pública
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue') // Página 404
  },
];

export default routes;

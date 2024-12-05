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
      {
        path: '',
        component: () => import('pages/IndexPage.vue'),
        beforeEnter: (to, from, next) => {
          const roleId = parseInt(localStorage.getItem('userRoleId'));
          if (roleId === 3 || roleId === 2) {
            next(); // Admin y Jefe de Zona tienen acceso
          } else {
            next('/login'); // Redirige si no tiene el rol adecuado
          }
        }
      },
      {
        path: '/PaginaRegistros',
        component: () => import('pages/PaginaRegistros.vue'),
        beforeEnter: (to, from, next) => {
          const roleId = parseInt(localStorage.getItem('userRoleId'));
          if (roleId === 3 || roleId === 2 || roleId === 1) {
            next(); // Todos los roles tienen acceso
          } else {
            next('/login');
          }
        }
      },
      {
        path: '/PaginaRegistroJefeZona',
        component: () => import('pages/PaginaRegistroJefeZona.vue'),
        beforeEnter: (to, from, next) => {
          const roleId = parseInt(localStorage.getItem('userRoleId'));
          if (roleId === 3) { // Solo Administrador
            next();
          } else {
            next('/login');
          }
        }
      },
      {
        path: '/PaginaRegistroZona',
        component: () => import('pages/PaginaRegistroZona.vue'),
        beforeEnter: (to, from, next) => {
          const roleId = parseInt(localStorage.getItem('userRoleId'));
          if (roleId === 3) { // Solo Administrador
            next();
          } else {
            next('/login');
          }
        }
      },
      {
        path: '/PaginaRegistroCampania',
        component: () => import('pages/PaginaRegistroCampania.vue'),
        beforeEnter: (to, from, next) => {
          const roleId = parseInt(localStorage.getItem('userRoleId'));
          if (roleId === 3) { // Solo Administrador tiene acceso
            next();
          } else {
            next('/login');
          }
        }
      },
      {
        path: '/PaginaRegistroMiembros',
        component: () => import('pages/PaginaRegistroMiembros.vue'),
        beforeEnter: (to, from, next) => {
          const roleId = parseInt(localStorage.getItem('userRoleId'));
          if (roleId === 3 || roleId === 1) { // Administrador y Brigada tienen acceso
            next();
          } else {
            next('/login');
          }
        }
      },
      {
        path: '/PaginaConsultaVacunas',
        component: () => import('src/pages/PaginaConsultaVacunas.vue'),
        beforeEnter: (to, from, next) => {
          const roleId = parseInt(localStorage.getItem('userRoleId'));
          if (roleId === 3 || roleId === 2 || roleId === 1) {
            next(); // Todos los roles tienen acceso
          } else {
            next('/login');
          }
        }
      },
      {
        path: '/PaginaCorrecciones',
        component: () => import('src/pages/PaginaCorrecciones.vue'),
        beforeEnter: (to, from, next) => {
          const roleId = parseInt(localStorage.getItem('userRoleId'));
          if (roleId === 3 || roleId === 2 || roleId === 1) {
            next(); // Todos los roles tienen acceso
          } else {
            next('/login');
          }
        }
      },
    ]
  },
  {
    path: '/PreRegistro',
    component: () => import('pages/PaginaRegistrosPublicos.vue') // Esta página es accesible para todos
  },
  // Siempre deja esta ruta como última para manejar errores 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  },
];

export default routes;

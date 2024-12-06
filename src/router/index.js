import { route } from 'quasar/wrappers';
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router';
import routes from './routes';

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory);

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  // Función para verificar si el usuario está autenticado
  function isAuthenticated() {
    return !!localStorage.getItem('authToken');
  }

  // Función para obtener el rol del usuario
  function getUserRole() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.role : null;
  }

  // Guard global del router
  Router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('authToken'); // Verifica si está autenticado
    const userRoleId = parseInt(localStorage.getItem('userRoleId')); // Obtiene el rol del usuario

    // Rutas públicas (sin restricción de autenticación)
    if (to.path === '/PreRegistro' || to.path === '/login') {
      next();
      return;
    }

    // Redirige al login si no está autenticado
    /* if (!isAuthenticated) {
      next('/login');
      return;
    } */

    // Verifica si la ruta requiere roles específicos
    const allowedRoles = to.meta.roles;
    if (allowedRoles && !allowedRoles.includes(userRoleId)) {
      // Redirige a la página principal según el rol del usuario
      if (userRoleId === 1) {
        next('/PaginaRegistroMiembros'); // Brigada
      } else if (userRoleId === 2 || userRoleId === 3) {
        next('/'); // Jefe de Zona y Administrador
      } else {
        next('/login'); // Redirige al login si el rol no es válido
      }
      return;

    }
    // Permite la navegación
    next();
  });

  return Router;
});

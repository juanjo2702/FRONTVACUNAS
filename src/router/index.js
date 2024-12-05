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

    // Usa la configuración de quasar.conf.js para el modo de historial
    history: createHistory(process.env.VUE_ROUTER_BASE)
  });

  // Función de autenticación para verificar si hay un token
  function isAuthenticated() {
    return !!localStorage.getItem('authToken'); // Verifica el token de autenticación
  }

  // Función para verificar permisos (si tienes lógica de permisos)
  function hasPermission(requiredPermission) {
    const user = JSON.parse(localStorage.getItem('user'));
    return user && user.permissions && user.permissions.includes(requiredPermission);
  }

  // Guard global para manejar la autenticación y permisos
  Router.beforeEach((to, from, next) => {
    // Excepción para la ruta /PreRegistro
    if (to.path === '/PreRegistro') {
      next(); // Permitir el acceso sin autenticación
    } else if (!isAuthenticated() && to.path !== '/login') {
      next('/login');
    } else if (to.meta.permiso && !hasPermission(to.meta.permiso)) {
      next('/PaginaNoAcceso');
    } else {
      next(); // Permitir la navegación
    }
  });

  return Router;
});

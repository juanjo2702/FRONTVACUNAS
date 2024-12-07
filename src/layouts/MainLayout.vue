<template>
  <q-layout view="lHh Lpr lFf" class="bg-yellow-7">
    <q-header elevated style="background-color: #1e534c;" class="text-brown">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="text-white" />
        <q-toolbar-title
          style="color: white; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif ; font-size: 22px; text-transform: uppercase;">
          {{ userName }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="drawer-bg">
      <div class="logo-container">
        <img src="/perros.png" alt="Logo" class="logo" />
      </div>
      <div class="divider"></div>
      <q-list>
        <!-- Generar menú dinámico según los permisos -->
        <router-link v-for="route in filteredRoutes" :key="route.path" :to="route.path"
          exact-active-class="q-item-active-selected" class="q-item q-item-type row no-wrap custom-link"
          style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <q-icon :name="route.icon" size="md" color="white" />
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">{{ route.label }}</span>
            </div>
          </q-item-section>
        </router-link>
      </q-list>
      <div class="logout-container">
        <q-btn flat dense class="logout-btn" @click="logout" icon="exit_to_app" label="Cerrar Sesión" />
      </div>
    </q-drawer>

    <q-page-container class="bg-white">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref, computed } from "vue";

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const userName = ref(localStorage.getItem("userName") || "Usuario");
    const userRoleId = parseInt(localStorage.getItem("userRoleId") || "0"); // Obtener el rol del usuario

    // Lista de rutas para el menú con iconos y etiquetas
    const menuRoutes = [
      { path: "/", label: "INICIO", icon: "dashboard", roles: [2, 3] },
      { path: "/PaginaRegistroJefeZona", label: "JEFE DE ZONA", icon: "supervisor_account", roles: [3] },
      { path: "/PaginaRegistroCampania", label: "CAMPAÑAS", icon: "campaign", roles: [2, 3] },
      { path: "/PaginaRegistroZona", label: "ZONAS", icon: "place", roles: [3] },
      { path: "/PaginaRegistroMiembros", label: "MIEMBROS", icon: "group", roles: [1, 3] },
      { path: "/PaginaRegistros", label: "REGISTROS", icon: "folder", roles: [1, 2, 3] },
      { path: "/PaginaConsultaVacunas", label: "CONSULTA VACUNAS", icon: "search", roles: [1, 2, 3] },
      /* { path: "/PaginaCorrecciones", label: "CORRECCIONES", icon: "edit", roles: [1, 2, 3] }, */
    ];

    // Filtrar rutas según el rol del usuario
    const filteredRoutes = computed(() =>
      menuRoutes.filter((route) => route.roles.includes(userRoleId))
    );

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const logout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userName");
      localStorage.removeItem("userRoleId");
      localStorage.removeItem("firstLogin");
      window.location.href = "/";
    };

    return {
      leftDrawerOpen,
      userName,
      toggleLeftDrawer,
      logout,
      filteredRoutes,
    };
  },
};
</script>

<style>
.header-bg {
  background-color: #205b53;
  /* Fondo más oscuro */
  color: rgb(6, 104, 55);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  /* Sombra para separar la barra */
}

.text-white {
  color: rgb(255, 255, 255);
}

.bg-yellow-7 {
  background-color: #6A9C89;
  /* Color de fondo */
}

.drawer-bg {
  background-color: #205b53;
  /* Color del drawer */
}

.bg-white {
  background-color: #E9EFEC;
}

.q-toolbar-title {
  font-weight: bold;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.logo {
  width: 220px;
  height: auto;
}

.user-info {
  margin-top: 10px;
  text-align: center;
  color: #E9EFEC;
  font-family: Arial, Helvetica, sans-serif;
}

.header-bg {
  background-color: var(--primary);
}

.bg-yellow-7 {
  background-color: var(--primary);
}

.text {
  color: #E9EFEC;
}

.drawer-bg {
  background-color: #205b53;
}

.bg-white {
  background-color: #E9EFEC;
}

.divider {
  height: 5px;
  background-color: #6A9C89;
  margin: 15px 0;
}

.q-item-active-selected {
  background-color: #6A9C89;
  color: #ffffff;
}

.logout-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.logout-btn {
  font-weight: bold;
  color: #E9EFEC;
  background-color: #6A9C89;
  font-family: Arial, Helvetica, sans-serif;
}
</style>

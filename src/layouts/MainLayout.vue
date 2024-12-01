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

        <router-link v-if="canAccess(['3', '2'])" to="/" exact-active-class="q-item-active-selected"
          class="q-item q-item-type row no-wrap custom-link" style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <q-icon name="home" size="md" color="white" />
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">INICIO</span>
            </div>
          </q-item-section>
        </router-link>

        <router-link v-if="canAccess(['3'])" to="/PaginaRegistroJefeZona" exact-active-class="q-item-active-selected"
          class="q-item q-item-type row no-wrap custom-link" style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <q-icon name="supervisor_account" size="md" color="white" />
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">JEFE DE ZONA</span>
            </div>
          </q-item-section>
        </router-link>

        <router-link v-if="canAccess(['3'])" to="/PaginaRegistroCampania" exact-active-class="q-item-active-selected"
          class="q-item q-item-type row no-wrap custom-link" style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <q-icon name="public" size="md" color="white" />
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">CAMPAÑAS</span>
            </div>
          </q-item-section>
        </router-link>

        <router-link v-if="canAccess(['3'])" to="/PaginaRegistroZona" exact-active-class="q-item-active-selected"
          class="q-item q-item-type row no-wrap custom-link" style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <q-icon name="place" size="md" color="white" />
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">ZONAS</span>
            </div>
          </q-item-section>
        </router-link>

        <router-link v-if="canAccess(['3', '2', '1'])" to="/PaginaRegistros" exact-active-class="q-item-active-selected"
          class="q-item q-item-type row no-wrap custom-link" style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <q-icon name="book" size="md" color="white" />
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">REGISTROS</span>
            </div>
          </q-item-section>
        </router-link>

        <router-link v-if="canAccess(['3', '2', '1'])" to="/PaginaConsultaVacunas"
          exact-active-class="q-item-active-selected" class="q-item q-item-type row no-wrap custom-link"
          style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <q-icon name="search" size="md" color="white" />
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">CONSULTA VACUNAS</span>
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
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  setup() {
    const leftDrawerOpen = ref(false);
    const userName = ref(localStorage.getItem('userName') || ''); // Suponiendo que el nombre de usuario está almacenado en localStorage
    const userRoleId = localStorage.getItem('userRoleId');
    const router = useRouter();

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    const logout = () => {
      localStorage.removeItem('authToken'); // Elimina el token de autenticación
      localStorage.removeItem('userName'); // Elimina el nombre de usuario
      localStorage.removeItem('userRoleId'); // Elimina el rol del usuario
      window.location.href = '/login';      // Redirige a la página de login
    };

    const canAccess = (roles) => {
      return roles.includes(userRoleId);
    };

    // Redirección después del login según el rol
    const redirectToHome = () => {
      switch (userRoleId) {
        case '3': // Administrador
        case '2': // Jefe de Zona
          router.push('/'); // Redirige al inicio
          break;
        case '1': // Brigada
          router.push('/PaginaRegistroMiembros'); // Redirige a Registro de Miembros
          break;
        default:
          router.push('/login'); // Redirige al login si no se reconoce el rol
      }
    };

    return {
      leftDrawerOpen,
      userName,
      toggleLeftDrawer,
      logout,
      canAccess,
      redirectToHome
    };
  },
  mounted() {
    this.redirectToHome(); // Ejecuta la redirección al montar el componente
  }
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

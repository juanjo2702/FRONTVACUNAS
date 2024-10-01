<template>
  <q-layout view="lHh Lpr lFf" class="bg-yellow-7">
    <q-header elevated class="header-bg text-brown">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" class="text" />
        <q-toolbar-title style="color: #E9EFEC;font-family: Arial, Helvetica, sans-serif;">
          Animales Vacunados App
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="drawer-bg">
      <div class="logo-container">
        <img src="src/img/perros.png" alt="Logo" class="logo" />
      </div>
      <div class="divider"></div>

      <q-list>
        <router-link to="/" exact-active-class="q-item-active-selected"
          class="q-item q-item-type row no-wrap custom-link" style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-home" width="40" height="40"
                viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M5 12l-2 0l9 -9l9 9l-2 0" />
                <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
              </svg>
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">INICIO</span>
            </div>
          </q-item-section>
        </router-link>

        <router-link to="/PaginaRegistroJefeZona" exact-active-class="q-item-active-selected"
          class="q-item q-item-type row no-wrap custom-link" style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-user" width="40" height="40"
                viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">JEFE DE ZONA</span>
            </div>
          </q-item-section>
        </router-link>

        <router-link to="/PaginaRegistroCampania" exact-active-class="q-item-active-selected"
          class="q-item q-item-type row no-wrap custom-link" style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-world-heart" width="40"
                height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M21 12a9 9 0 1 0 -9.679 8.974" />
                <path d="M3.6 9h16.8" />
                <path d="M3.6 15h6.9" />
                <path d="M11.5 3a17 17 0 0 0 0 18" />
                <path d="M12.5 3a16.983 16.983 0 0 1 2.556 8.136" />
              </svg>
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">CAMPAÑAS</span>
            </div>
          </q-item-section>
        </router-link>

        <router-link to="/PaginaRegistroZona" exact-active-class="q-item-active-selected"
          class="q-item q-item-type row no-wrap custom-link" style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-map-pin" width="40"
                height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
              </svg>
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">ZONAS</span>
            </div>
          </q-item-section>
        </router-link>

        <router-link to="/PaginaRegistros" exact-active-class="q-item-active-selected"
          class="q-item q-item-type row no-wrap custom-link" style="text-decoration: none;">
          <q-item-section style="font-size: 15px; font-weight: bold; color: #E9EFEC">
            <div class="flex-row" style="display: flex; align-items: center;">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-address-book" width="40"
                height="40" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round"
                stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2z" />
                <path d="M10 16h6" />
                <path d="M13 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
              </svg>
              <span style="margin-left: 10px;font-family: Arial, Helvetica, sans-serif;">REGISTROS</span>
            </div>
          </q-item-section>
        </router-link>
      </q-list>
    </q-drawer>

    <q-page-container class="bg-white">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return {
      leftDrawerOpen,
      toggleLeftDrawer,
    };
  },
};
</script>

<style>
.logo-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.logo {
  width: 220px;
  height: auto;
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
</style>

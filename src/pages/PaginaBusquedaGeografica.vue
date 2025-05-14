<template>
  <div class="pagina-busqueda">
    <div id="map" class="mapa"></div>

    <div class="filtros q-gutter-md q-pa-md row justify-center items-center">
      <q-input v-model.number="radio" label="Radio (km)" type="number" :min="1" outlined dense style="width: 120px;" />

      <q-select v-model="especie" :options="['Ambos', 'Perro', 'Gato']" label="Especie" outlined dense
        style="width: 150px;" />

      <q-select v-model="raza" :options="razasDisponibles" label="Raza" outlined dense clearable
        :disable="especie === 'Ambos'" style="width: 180px;" />

      <q-select v-model="genero" :options="['Macho', 'Hembra']" label="Género" outlined dense clearable
        style="width: 150px;" />

      <q-btn label="Buscar" color="primary" icon="search" @click="buscarMascotas" />
    </div>

    <div class="resultados" v-if="mascotas.length > 0">
      <q-card v-for="m in mascotas" :key="m.id" class="q-mb-md">
        <q-img :src="getFotoUrl(m.fotoFrontal)" style="max-height: 200px; cursor: zoom-in;" spinner-color="primary"
          @click="verFotoCompleta(m.fotoFrontal)" />
        <q-card-section>
          <div><strong>Mascota:</strong> {{ m.nombre_mascota }}</div>
          <div><strong>Raza:</strong> {{ m.raza }}</div>
          <div><strong>Especie:</strong> {{ m.especie }}</div>
          <div><strong>Género:</strong> {{ m.genero }}</div>
          <div><strong>Dueño:</strong> {{ m.nombres }} {{ m.apellidos }}</div>
          <div><strong>Teléfono:</strong> {{ m.telefono }}</div>
          <div><strong>Ubicación:</strong><q-btn flat dense icon="place" label="Ver en Google Maps" color="blue" class="q-ml-sm"
            @click="abrirEnGoogleMaps(m.latitud, m.longitud)" /></div>
          <div><strong>Vacunación última campaña:</strong>
            <q-badge :color="m.estado_vacunacion === 'Vacunado' ? 'green' : 'red'" text-color="white">
              {{ m.estado_vacunacion }}
            </q-badge>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="no-result" v-else-if="busquedaHecha">
      <q-banner class="bg-grey-3 text-grey-8">
        No se encontraron mascotas en el área seleccionada.
      </q-banner>
    </div>

    <!-- Dialog para ver imagen completa -->
    <q-dialog v-model="fotoVisible">
      <q-card class="bg-black text-white q-pa-none" style="width: 80vw; max-width: 900px;">
        <q-img :src="fotoAmpliada" style="max-height: 80vh; object-fit: contain;" spinner-color="white" />
        <q-card-actions align="center">
          <q-btn flat label="Cerrar" color="white" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, watch } from 'vue'
import L from 'leaflet'

const { appContext } = getCurrentInstance()
const $api = appContext.config.globalProperties.$api
const $storage = appContext.config.globalProperties.$storage

const mascotas = ref([])
const busquedaHecha = ref(false)

const puntoSeleccionado = ref(null)
let marker = null

const radio = ref(1)
const especie = ref('Ambos')
const raza = ref(null)
const genero = ref(null)

const razasDisponibles = ref([])

// Dialog de imagen
const fotoVisible = ref(false)
const fotoAmpliada = ref('')

const verFotoCompleta = (path) => {
  fotoAmpliada.value = getFotoUrl(path)
  fotoVisible.value = true
}

onMounted(() => {
  const map = L.map('map').setView([-17.3935, -66.1570], 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  map.on('click', function (e) {
    puntoSeleccionado.value = e.latlng
    if (marker) marker.remove()
    marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map)
  })
})

// Cargar razas según especie
watch(especie, async (nuevoValor) => {
  if (nuevoValor === 'Perro') {
    const { data } = await $api.get('/getRazas', { params: { tipo: 0 } })
    razasDisponibles.value = data.map(r => r.nombre)
  } else if (nuevoValor === 'Gato') {
    const { data } = await $api.get('/getRazas', { params: { tipo: 1 } })
    razasDisponibles.value = data.map(r => r.nombre)
  } else {
    razasDisponibles.value = []
  }

  raza.value = null
})

const buscarMascotas = async () => {
  if (!puntoSeleccionado.value || radio.value < 1) return

  try {
    const { data } = await $api.get('/mascotas-cercanas', {
      params: {
        latitud: puntoSeleccionado.value.lat,
        longitud: puntoSeleccionado.value.lng,
        radio: radio.value,
        especie: especie.value === 'Ambos' ? null : especie.value,
        raza: raza.value,
        genero: genero.value
      }
    })
    mascotas.value = data
    busquedaHecha.value = true
  } catch (error) {
    console.error("Error al buscar mascotas:", error)
  }
}

const getFotoUrl = (path) => {
  return path ? `${$storage.defaults.baseURL}/${path}` : '/no-image.png'
}

const abrirEnGoogleMaps = (lat, lng) => {
  const url = `https://www.google.com/maps?q=${lat},${lng}`
  window.open(url, '_blank')
}
</script>

<style>
@import "leaflet/dist/leaflet.css";

.pagina-busqueda {
  background-color: white;
  padding: 10px;
  min-height: 100vh;
}

.mapa {
  height: 500px;
  width: 100%;
  margin-bottom: 20px;
}

.filtros {
  flex-wrap: wrap;
}

.resultados {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 0 20px;
}

.no-result {
  text-align: center;
  margin-top: 30px;
}
</style>

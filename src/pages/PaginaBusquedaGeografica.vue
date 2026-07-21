<template>
  <div class="pagina-busqueda q-pa-md bg-grey-1">
    <!-- Encabezado con título e instrucciones -->
    <div class="header-container q-mb-md">
      <div class="text-h4 text-primary q-mb-xs">Buscador de Mascotas por Ubicación</div>
      <p class="text-body1 text-grey-8 q-mb-md">
        Haga clic en el mapa para seleccionar un punto, configure los filtros y presione "Buscar" para encontrar
        mascotas cercanas.
      </p>
    </div>

    <!-- Contenedor del mapa sin superposiciones que bloqueen la interactividad -->
    <q-card class="map-card q-mb-md">
      <q-card-section class="q-pa-none relative-position">
        <!-- El mapa debe estar en primer plano para capturar clics -->
        <div id="map" class="mapa"></div>

        <!-- Indicador flotante que no interfiere con los clics -->
        <div v-if="!puntoSeleccionado" class="map-hint">
          Haga clic en el mapa para seleccionar un punto
        </div>

        <!-- Información del punto seleccionado -->
        <div v-if="puntoSeleccionado" class="punto-info">
          <div class="text-weight-medium">Punto seleccionado</div>
          <div class="text-caption">
            Lat: {{ puntoSeleccionado.lat.toFixed(6) }},
            Lng: {{ puntoSeleccionado.lng.toFixed(6) }}
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Panel de filtros -->
    <q-card class="filtros-card q-mb-md">
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-6 col-md-3">
            <q-input v-model.number="radio" label="Radio de búsqueda (km)" type="number" :min="0.5" :max="10"
              :step="0.5" outlined dense @update:model-value="actualizarCirculo">
              <template v-slot:append>
                <q-icon name="radius" />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select v-model="especie" :options="['Ambos', 'Perro', 'Gato']" label="Especie" outlined dense emit-value
              map-options>
              <template v-slot:prepend>
                <q-icon name="pets" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select v-model="raza" :options="razasDisponibles" label="Raza" outlined dense clearable
              :disable="especie === 'Ambos'" hint="Primero seleccione una especie">
              <template v-slot:prepend>
                <q-icon name="category" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <q-select v-model="genero" :options="['Macho', 'Hembra']" label="Género" outlined dense clearable>
              <template v-slot:prepend>
                <q-icon name="wc" />
              </template>
            </q-select>
          </div>

          <div class="col-12 text-center q-mt-md">
            <q-btn label="Buscar Mascotas" color="primary" icon="search" :loading="buscando"
              :disable="!puntoSeleccionado || radio < 0.5" @click="buscarMascotas" unelevated rounded
              class="full-width-sm" style="max-width: 300px" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Estado de la búsqueda - Cargando -->
    <div v-if="buscando" class="text-center q-pa-lg">
      <q-spinner-dots color="primary" size="40px" />
      <div class="text-body1 q-mt-sm">Buscando mascotas cercanas...</div>
    </div>

    <!-- Resultados de la búsqueda -->
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="mascotas.length > 0 && !buscando" class="q-mt-md">
        <div class="text-h6 text-primary q-mb-md">
          Se encontraron {{ mascotas.length }} mascotas en el área seleccionada
        </div>

        <div class="resultados">
          <q-card v-for="mascota in mascotas" :key="mascota.id" class="mascota-card">
            <q-img :src="getFotoUrl(mascota.fotoFrontal)" :ratio="1" spinner-color="primary" class="mascota-imagen"
              @click="verFotoCompleta(mascota.fotoFrontal)">
              <div class="absolute-top-right q-pa-xs">
                <q-badge :color="mascota.estado_vacunacion === 'Vacunado' ? 'green' : 'red'"
                  :label="mascota.estado_vacunacion" class="q-px-sm q-py-xs" />
              </div>

              <div class="absolute-bottom text-subtitle1 text-center bg-dark text-white q-pa-sm">
                {{ mascota.nombre_mascota }}
              </div>
            </q-img>

            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <div class="text-caption text-grey-7">Especie</div>
                  <div class="text-body2">{{ mascota.especie }}</div>
                </div>

                <div class="col-6">
                  <div class="text-caption text-grey-7">Raza</div>
                  <div class="text-body2">{{ mascota.raza || 'No especificada' }}</div>
                </div>

                <div class="col-6 q-mt-sm">
                  <div class="text-caption text-grey-7">Género</div>
                  <div class="text-body2">{{ mascota.genero }}</div>
                </div>

                <div class="col-6 q-mt-sm">
                  <div class="text-caption text-grey-7">Dueño</div>
                  <div class="text-body2">{{ mascota.nombres }} {{ mascota.apellidos }}</div>
                </div>

                <div class="col-12 q-mt-sm">
                  <div class="text-caption text-grey-7">Teléfono</div>
                  <div class="text-body2">{{ mascota.telefono }}</div>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="center" class="q-pb-md">
              <q-btn icon="place" label="Ver en Google Maps" color="primary" outline
                @click="abrirEnGoogleMaps(mascota.latitud, mascota.longitud)" class="full-width" />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </transition>

    <!-- Mensaje de no resultados -->
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="busquedaHecha && mascotas.length === 0 && !buscando" class="text-center q-pa-xl no-result">
        <q-icon name="search_off" size="64px" color="grey-6" />
        <div class="text-h6 q-mt-md text-grey-8">No se encontraron mascotas</div>
        <p class="text-grey-7">
          No hay mascotas registradas en el área seleccionada con los filtros aplicados.
          Intente ampliar el radio de búsqueda o modificar los filtros.
        </p>
      </div>
    </transition>

    <!-- Dialog para ver imagen completa -->
    <q-dialog v-model="fotoVisible" maximized transition-show="slide-up" transition-hide="slide-down">
      <q-card class="fullscreen bg-black text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Cerrar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section class="column items-center justify-center full-height">
          <q-img :src="fotoAmpliada" spinner-color="white" style="max-width: 90vw; max-height: 80vh;" fit="contain" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de depuración (solo visible durante el desarrollo) -->
    <q-dialog v-model="debugModalVisible">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Información de Depuración</div>
        </q-card-section>
        <q-card-section>
          <pre>{{ debugInfo }}</pre>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, getCurrentInstance, watch, onBeforeUnmount } from 'vue';
import L from 'leaflet';
import { useQuasar } from 'quasar';

const $q = useQuasar();
const { appContext } = getCurrentInstance();
const $api = appContext.config.globalProperties.$api;
const $storage = appContext.config.globalProperties.$storage;

// Referencias y estados
const mascotas = ref([]);
const busquedaHecha = ref(false);
const buscando = ref(false);
const puntoSeleccionado = ref(null);
const radio = ref(1);
const especie = ref('Ambos');
const raza = ref(null);
const genero = ref(null);
const razasDisponibles = ref([]);

// Dialog de imagen
const fotoVisible = ref(false);
const fotoAmpliada = ref('');

// Depuración
const debugModalVisible = ref(false);
const debugInfo = ref('');

// Referencias para Leaflet
let map = null;
let marker = null;
let radiusCircle = null;
let mapInitialized = false;

// Ver foto a tamaño completo
const verFotoCompleta = (path) => {
  fotoAmpliada.value = getFotoUrl(path);
  fotoVisible.value = true;
};

// Función para registrar información de depuración
const logDebug = (info) => {
  console.log(info);
  debugInfo.value += info + '\n';
};

// Mostrar modal de depuración
const mostrarDebugModal = () => {
  debugModalVisible.value = true;
};

// Inicializar el mapa
onMounted(() => {
  // Limpiar información de depuración
  debugInfo.value = '';

  // Intentar inicializar el mapa después de un pequeño retraso para asegurar que el DOM esté listo
  setTimeout(() => {
    inicializarMapa();
  }, 100);
});

// Limpiar recursos al desmontar el componente
onBeforeUnmount(() => {
  if (map) {
    map.off();
    map.remove();
    map = null;
  }
});

// Función para inicializar el mapa
function inicializarMapa() {
  try {
    logDebug('Inicializando mapa...');

    // Verificar si el elemento del mapa existe
    const mapElement = document.getElementById('map');
    if (!mapElement) {
      logDebug('Error: Elemento #map no encontrado en el DOM');
      return;
    }

    // Inicializar el mapa
    map = L.map('map', {
      center: [-17.3935, -66.1570],
      zoom: 13,
      attributionControl: true,
      zoomControl: true,
      doubleClickZoom: true,
      scrollWheelZoom: true,
      dragging: true,
      tap: false // Deshabilitar tap para evitar problemas en dispositivos táctiles
    });

    // Añadir capa de mapa
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    // Añadir controles de zoom de manera explícita
    L.control.zoom({
      position: 'topleft'
    }).addTo(map);

    // Configurar manejador de clics de manera explícita
    map.on('click', handleMapClick);

    // Marcar como inicializado
    mapInitialized = true;

    logDebug('Mapa inicializado correctamente');

    // Forzar una revalidación del tamaño del mapa
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

  } catch (error) {
    logDebug(`Error al inicializar el mapa: ${error.message}`);
    mostrarDebugModal();
  }
}

// Manejador dedicado para clics en el mapa
function handleMapClick(e) {
  logDebug(`Clic detectado en el mapa en: ${e.latlng.lat.toFixed(6)}, ${e.latlng.lng.toFixed(6)}`);
  seleccionarPunto(e.latlng);
}

// Función para asegurar que el mapa sea interactivo
function corregirInteractividadMapa() {
  try {
    logDebug('Aplicando correcciones de interactividad al mapa...');

    // Verificar si el mapa está inicializado
    if (!map) {
      logDebug('Error: El mapa no está inicializado');
      return;
    }

    // Eliminar y volver a añadir el manejador de clics
    map.off('click');
    map.on('click', handleMapClick);

    // Asegurar que el elemento del mapa sea clickeable
    const mapElement = document.getElementById('map');
    if (mapElement) {
      mapElement.style.pointerEvents = 'auto';
      mapElement.style.zIndex = '1';
    }

    // Verificar superposiciones que puedan estar bloqueando los clics
    const overlays = document.querySelectorAll('.map-hint');
    overlays.forEach(overlay => {
      overlay.style.pointerEvents = 'none';
    });

    // Forzar revalidación del tamaño del mapa
    map.invalidateSize();

    logDebug('Correcciones de interactividad aplicadas');

  } catch (error) {
    logDebug(`Error al corregir la interactividad: ${error.message}`);
  }
}

// Función para seleccionar un punto en el mapa
function seleccionarPunto(latlng) {
  puntoSeleccionado.value = latlng;

  try {
    // Eliminar marcador anterior si existe
    if (marker) {
      map.removeLayer(marker);
      marker = null;
    }

    // Crear nuevo marcador
    marker = L.marker([latlng.lat, latlng.lng], {
      draggable: true // Hacer el marcador arrastrable para mejor usabilidad
    }).addTo(map);

    // Permitir actualizar la posición al arrastrar el marcador
    marker.on('dragend', function (event) {
      const position = event.target.getLatLng();
      puntoSeleccionado.value = position;
      actualizarCirculo();

      logDebug(`Marcador movido a: ${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);
    });

    // Actualizar círculo de radio
    actualizarCirculo();

    // Notificar al usuario
    $q.notify({
      message: 'Punto seleccionado. Ahora puede realizar la búsqueda.',
      color: 'positive',
      position: 'bottom',
      timeout: 2000
    });

    logDebug(`Punto seleccionado: ${latlng.lat.toFixed(6)}, ${latlng.lng.toFixed(6)}`);

  } catch (error) {
    logDebug(`Error al seleccionar punto: ${error.message}`);
  }
}

// Función para actualizar el círculo de radio en el mapa
function actualizarCirculo() {
  if (!puntoSeleccionado.value || !map) return;

  try {
    // Eliminar círculo anterior si existe
    if (radiusCircle) {
      map.removeLayer(radiusCircle);
      radiusCircle = null;
    }

    // Crear nuevo círculo
    radiusCircle = L.circle([puntoSeleccionado.value.lat, puntoSeleccionado.value.lng], {
      color: '#1976D2',
      fillColor: '#2196F3',
      fillOpacity: 0.2,
      weight: 2,
      radius: radio.value * 1000 // Convertir km a metros
    }).addTo(map);

    // Ajustar el zoom para mostrar todo el círculo
    const bounds = radiusCircle.getBounds();
    map.fitBounds(bounds, { padding: [50, 50] });

    logDebug(`Círculo actualizado con radio: ${radio.value} km`);

  } catch (error) {
    logDebug(`Error al actualizar círculo: ${error.message}`);
  }
}

// Cargar razas según especie seleccionada
watch(especie, async (nuevoValor) => {
  logDebug(`Especie seleccionada: ${nuevoValor}`);

  if (nuevoValor === 'Perro') {
    try {
      const { data } = await $api.get('/getRazas', { params: { tipo: 0 } });
      razasDisponibles.value = data.map(r => r.nombre);
      logDebug(`Cargadas ${razasDisponibles.value.length} razas de perros`);
    } catch (error) {
      logDebug(`Error al cargar razas de perros: ${error.message}`);
      razasDisponibles.value = [];
    }
  } else if (nuevoValor === 'Gato') {
    try {
      const { data } = await $api.get('/getRazas', { params: { tipo: 1 } });
      razasDisponibles.value = data.map(r => r.nombre);
      logDebug(`Cargadas ${razasDisponibles.value.length} razas de gatos`);
    } catch (error) {
      logDebug(`Error al cargar razas de gatos: ${error.message}`);
      razasDisponibles.value = [];
    }
  } else {
    razasDisponibles.value = [];
  }

  // Reset de selección de raza
  raza.value = null;
});

// Función para realizar la búsqueda
const buscarMascotas = async () => {
  if (!puntoSeleccionado.value || radio.value < 0.5) {
    $q.notify({
      message: 'Seleccione un punto en el mapa y configure un radio de búsqueda.',
      color: 'warning',
      position: 'top',
      timeout: 3000
    });
    return;
  }

  buscando.value = true;
  logDebug('Iniciando búsqueda de mascotas...');

  try {
    const params = {
      latitud: puntoSeleccionado.value.lat,
      longitud: puntoSeleccionado.value.lng,
      radio: radio.value,
      especie: especie.value === 'Ambos' ? null : especie.value,
      raza: raza.value,
      genero: genero.value
    };

    logDebug(`Parámetros de búsqueda: ${JSON.stringify(params)}`);

    const { data } = await $api.get('/mascotas-cercanas', { params });

    mascotas.value = data;
    busquedaHecha.value = true;

    logDebug(`Búsqueda completada: ${data.length} mascotas encontradas`);

    // Marcar las mascotas en el mapa
    marcarMascotasEnMapa(data);

    if (data.length > 0) {
      $q.notify({
        message: `Se encontraron ${data.length} mascotas en el área.`,
        color: 'positive',
        position: 'top',
        timeout: 3000
      });
    } else {
      $q.notify({
        message: 'No se encontraron mascotas en el área seleccionada.',
        color: 'info',
        position: 'top',
        timeout: 3000
      });
    }
  } catch (error) {
    logDebug(`Error al buscar mascotas: ${error.message}`);

    $q.notify({
      message: 'Error al buscar mascotas. Intente nuevamente.',
      color: 'negative',
      position: 'top',
      timeout: 3000
    });

    mascotas.value = [];
  } finally {
    buscando.value = false;
  }
};

// Función para marcar las mascotas en el mapa
function marcarMascotasEnMapa(mascotasData) {
  if (!map) return;

  try {
    // Limpiar marcadores anteriores excepto el marcador principal y el círculo
    map.eachLayer(function (layer) {
      if (layer !== marker && layer !== radiusCircle && layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    logDebug(`Marcando ${mascotasData.length} mascotas en el mapa`);

    // Crear un icono personalizado para las mascotas
    const petIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="pet-marker-pin"></div><i class="material-icons">pets</i>`,
      iconSize: [30, 42],
      iconAnchor: [15, 42]
    });

    // Añadir marcadores para cada mascota
    mascotasData.forEach(mascota => {
      if (mascota.latitud && mascota.longitud) {
        const mascotaMarker = L.marker([mascota.latitud, mascota.longitud], {
          icon: petIcon
        }).addTo(map);

        // Crear popup con información de la mascota
        const popupContent = `
          <div class="mascota-popup">
            <h4>${mascota.nombre_mascota}</h4>
            <div class="popup-info">
              <strong>Especie:</strong> ${mascota.especie}<br>
              <strong>Raza:</strong> ${mascota.raza || 'No especificada'}<br>
              <strong>Género:</strong> ${mascota.genero}<br>
              <strong>Dueño:</strong> ${mascota.nombres} ${mascota.apellidos}<br>
              <strong>Teléfono:</strong> ${mascota.telefono}<br>
              <strong>Estado:</strong> <span class="${mascota.estado_vacunacion === 'Vacunado' ? 'estado-vacunado' : 'estado-no-vacunado'}">${mascota.estado_vacunacion}</span>
            </div>
          </div>
        `;

        mascotaMarker.bindPopup(popupContent);
      }
    });

  } catch (error) {
    logDebug(`Error al marcar mascotas en el mapa: ${error.message}`);
  }
}

// Función para obtener URL de la foto
const getFotoUrl = (path) => {
  return path ? `${$storage.defaults.baseURL}/${path}` : '/no-image.png';
};

// Función para abrir ubicación en Google Maps
const abrirEnGoogleMaps = (lat, lng) => {
  const url = `https://www.google.com/maps?q=${lat},${lng}`;
  window.open(url, '_blank');
};

// Aplicar correcciones de interactividad después de la carga
onMounted(() => {
  // Añadir tecla de acceso rápido para depuración (solo en desarrollo)
  window.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'D') {
      mostrarDebugModal();
    }
  });

  // Asegurarse de que el mapa sea interactivo después de la carga
  setTimeout(() => {
    corregirInteractividadMapa();
  }, 500);

  // Añadir estilos para los marcadores y popups
  const style = document.createElement('style');
  style.textContent = `
    .pet-marker-pin {
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      background: #e91e63;
      position: absolute;
      transform: rotate(-45deg);
      left: 50%;
      top: 50%;
      margin: -15px 0 0 -15px;
    }
    .pet-marker-pin::after {
      content: '';
      width: 24px;
      height: 24px;
      margin: 3px 0 0 3px;
      background: #fff;
      position: absolute;
      border-radius: 50%;
    }
    .custom-div-icon i {
      position: absolute;
      width: 22px;
      font-size: 22px;
      left: 0;
      right: 0;
      margin: 10px auto;
      text-align: center;
      color: #e91e63;
      z-index: 1;
    }
    .mascota-popup {
      padding: 5px;
      max-width: 250px;
    }
    .mascota-popup h4 {
      margin: 0 0 8px 0;
      color: #1976D2;
      text-align: center;
    }
    .popup-info {
      font-size: 0.9em;
      line-height: 1.4;
    }
    .estado-vacunado {
      color: green;
      font-weight: bold;
    }
    .estado-no-vacunado {
      color: red;
      font-weight: bold;
    }
    /* Asegurar que el mapa sea interactivo */
    #map {
      z-index: 1 !important;
      pointer-events: auto !important;
    }
    /* Evitar que las superposiciones bloqueen los clics */
    .map-hint {
      pointer-events: none !important;
      user-select: none !important;
    }
  `;
  document.head.appendChild(style);
});
</script>

<style>
@import "leaflet/dist/leaflet.css";
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.pagina-busqueda {
  min-height: 100vh;
}

.header-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.map-card,
.filtros-card,
.mascota-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.map-card:hover,
.filtros-card:hover,
.mascota-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

/* Mapa interactivo - asegurando que capture clics */
.mapa {
  height: 500px;
  width: 100%;
  z-index: 1 !important;
  pointer-events: auto !important;
  position: relative;
}

/* Mensaje flotante que no interfiere con los clics */
.map-hint {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.8);
  padding: 10px 15px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  pointer-events: none;
  user-select: none;
  z-index: 2;
}

.punto-info {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background-color: white;
  padding: 8px 12px;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 2;
  pointer-events: none;
}

.resultados {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.mascota-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mascota-imagen {
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.mascota-card:hover .mascota-imagen {
  transform: scale(1.03);
}

.no-result {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

/* Animaciones */
.animated {
  animation-duration: 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

.fadeIn {
  animation-name: fadeIn;
}

.fadeOut {
  animation-name: fadeOut;
}

/* Asegurar que los controles del mapa sean interactivos */
.leaflet-control-container {
  z-index: 800 !important;
  pointer-events: auto !important;
}

/* Responsive */
@media (max-width: 599px) {
  .mapa {
    height: 350px;
  }

  .full-width-sm {
    width: 100% !important;
    max-width: none !important;
  }
}
</style>

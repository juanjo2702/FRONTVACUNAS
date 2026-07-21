<template>
  <div class="pagina-no-vacunados q-pa-md">
    <!-- Encabezado con título y descripción -->
    <div class="header-container q-mb-md">
      <div class="row items-center justify-between q-col-gutter-md">
        <div class="col-12 col-md-8">
          <div class="text-h4 text-primary q-mb-xs">Mapa de Propietarios con Mascotas Sin Vacunar</div>
          <p class="text-body1 text-grey-8 q-ma-none">
            Este mapa muestra la ubicación de propietarios que tienen mascotas pendientes de vacunación.
            Haga clic en los marcadores para ver más detalles.
          </p>
        </div>
        <div class="col-12 col-md-4 text-right">
          <div class="row justify-end q-gutter-sm">
            <q-btn label="Descargar PDF" color="primary" icon="download" @click="generarPDF" :loading="generandoPDF"
              unelevated class="q-px-md" />
            <q-btn label="Actualizar Datos" color="secondary" icon="refresh" @click="cargarDatos"
              :loading="cargandoDatos" outline />
          </div>
        </div>
      </div>
    </div>

    <!-- Panel de estadísticas -->
    <div class="stats-container q-mb-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-4">
          <q-card class="stats-card bg-blue-1">
            <q-card-section class="text-center">
              <div class="text-h5 text-blue-9">{{ propietarios.length }}</div>
              <div class="text-subtitle1 text-blue-8">Propietarios</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-4">
          <q-card class="stats-card bg-orange-1">
            <q-card-section class="text-center">
              <div class="text-h5 text-orange-9">{{ totalMascotas }}</div>
              <div class="text-subtitle1 text-orange-8">Mascotas sin vacunar</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-sm-4">
          <q-card class="stats-card bg-green-1">
            <q-card-section class="text-center">
              <div class="text-h5 text-green-9">{{ propietariosConUbicacion }}</div>
              <div class="text-subtitle1 text-green-8">Ubicaciones mapeadas</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Contenedor del mapa con panel de información -->
    <div class="map-container row q-col-gutter-md">
      <div class="col-12 col-lg-9">
        <!-- Tarjeta contenedora del mapa -->
        <q-card class="map-card">
          <q-card-section class="q-pa-none">
            <!-- Indicador de carga -->
            <div v-if="cargandoDatos" class="map-loading flex flex-center">
              <div class="column items-center">
                <q-spinner color="primary" size="3em" />
                <div class="q-mt-sm text-primary">Cargando datos del mapa...</div>
              </div>
            </div>

            <!-- El mapa -->
            <div id="map" class="mapa"></div>

            <!-- Leyenda del mapa -->
            <div class="map-legend q-pa-sm">
              <div class="text-caption text-weight-medium q-mb-xs">Leyenda</div>
              <div class="row items-center q-gutter-x-sm">
                <q-icon name="room" color="red" size="sm" />
                <span class="text-caption">Propietarios con mascotas sin vacunar</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-3">
        <!-- Panel de información lateral -->
        <q-card class="info-card">
          <q-card-section>
            <div class="text-h6 q-mb-md">Información</div>

            <q-list separator>
              <q-item v-for="(item, index) in infoItems" :key="index">
                <q-item-section avatar>
                  <q-avatar :color="item.color" text-color="white" icon="info" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ item.label }}</q-item-label>
                  <q-item-label caption>{{ item.value }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="q-mt-lg">
              <div class="text-subtitle2 q-mb-sm">Información adicional</div>
              <p class="text-caption q-ma-none">
                Para más detalles sobre campañas de vacunación, contacte a la oficina de Zoonosis.
              </p>
            </div>
          </q-card-section>
        </q-card>

        <!-- Tabla de propietarios (versión compacta) -->
        <q-card class="list-card q-mt-md">
          <q-card-section class="q-pa-none">
            <q-table title="Propietarios" :rows="propietarios" :columns="columns" row-key="id" dense
              :pagination="{ rowsPerPage: 5 }" :loading="cargandoDatos">
              <template v-slot:body="props">
                <q-tr :props="props" @click="centrarEnMapa(props.row)" class="cursor-pointer hover-highlight">
                  <q-td key="nombre" :props="props">
                    {{ getNombreCompleto(props.row) }}
                  </q-td>
                  <q-td key="mascotas" :props="props">
                    {{ props.row.mascotas ? props.row.mascotas.length : 0 }}
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref, computed } from 'vue'
import L from 'leaflet'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const { appContext } = getCurrentInstance()
const $api = appContext.config.globalProperties.$api

// Referencias y estados
const propietarios = ref([])
const cargandoDatos = ref(true)
const generandoPDF = ref(false)
const zonaSeleccionada = ref(null)
const zonas = ref([
  { label: 'Todas las zonas', value: null },
  { label: 'Norte', value: 'norte' },
  { label: 'Sur', value: 'sur' },
  { label: 'Este', value: 'este' },
  { label: 'Oeste', value: 'oeste' },
  { label: 'Centro', value: 'centro' }
])
let map = null
let markers = []

// Columnas para la tabla
const columns = [
  { name: 'nombre', label: 'Propietario', field: row => getNombreCompleto(row), sortable: true },
  { name: 'mascotas', label: 'Mascotas', field: row => row.mascotas ? row.mascotas.length : 0, sortable: true }
]

// Propiedades computadas
const totalMascotas = computed(() => {
  return propietarios.value.reduce((total, p) => total + (p.mascotas ? p.mascotas.length : 0), 0)
})

const propietariosConUbicacion = computed(() => {
  return propietarios.value.filter(p => p.latitud && p.longitud).length
})

const infoItems = computed(() => [
  {
    label: 'Últimos datos',
    value: new Date().toLocaleDateString(),
    color: 'primary'
  },
  {
    label: 'Cobertura',
    value: propietariosConUbicacion.value > 0
      ? `${Math.round((propietariosConUbicacion.value / propietarios.value.length) * 100)}% de propietarios mapeados`
      : 'No hay datos de ubicación',
    color: 'orange'
  },
  {
    label: 'Promedio',
    value: propietarios.value.length > 0
      ? `${(totalMascotas.value / propietarios.value.length).toFixed(1)} mascotas por propietario`
      : 'No hay datos',
    color: 'teal'
  }
])

// Funciones
function getNombreCompleto(propietario) {
  return `${propietario.persona?.nombres || ''} ${propietario.persona?.apellidos || ''}`.trim() || 'Sin nombre'
}

function inicializarMapa() {
  // Eliminamos el mapa anterior si existe
  if (map) {
    map.remove()
  }

  // Inicializamos el mapa
  map = L.map('map').setView([-17.3935, -66.1570], 12)

  // Añadimos el tile layer con un diseño más moderno
  L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">HOT</a>',
    maxZoom: 19
  }).addTo(map)

  // Añadimos controles adicionales
  L.control.scale({ imperial: false }).addTo(map)
}

function limpiarMarcadores() {
  // Limpiamos los marcadores anteriores
  if (markers.length) {
    markers.forEach(marker => map.removeLayer(marker))
    markers = []
  }
}

function mostrarMarcadores(datos) {
  limpiarMarcadores()

  // Creamos un array para almacenar las coordenadas y hacer zoom
  const bounds = []

  datos.forEach(p => {
    if (p.latitud && p.longitud) {
      const nombre = getNombreCompleto(p)

      // Información de mascotas para el popup
      const mascotas = p.mascotas
        ? p.mascotas.map(m => `
            <div class="popup-mascota">
              <div class="popup-mascota-nombre">${m.nombre}</div>
              <div class="popup-mascota-info">${m.especie} - ${m.raza || 'Raza no especificada'}</div>
            </div>
          `).join('')
        : '<div>No hay información de mascotas</div>'

      // Creamos un icono personalizado para el marcador
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div class="marker-pin"></div><i class="material-icons">pets</i>`,
        iconSize: [30, 42],
        iconAnchor: [15, 42]
      })

      // Creamos el contenido del popup con mejor formato
      const popupContent = `
        <div class="custom-popup">
          <h4>${nombre}</h4>
          <p class="popup-subtitle">Mascotas sin vacunar:</p>
          <div class="popup-mascotas-container">
            ${mascotas}
          </div>
          <div class="popup-footer">
            <div class="popup-contacto">
              ${p.persona?.telefono ? `<div><i class="material-icons popup-icon">phone</i> ${p.persona.telefono}</div>` : ''}
              ${p.persona?.ci ? `<div><i class="material-icons popup-icon">badge</i> CI: ${p.persona.ci}</div>` : ''}
            </div>
          </div>
        </div>
      `

      // Creamos el marcador y lo añadimos al mapa
      const marker = L.marker([p.latitud, p.longitud], { icon: customIcon })
        .addTo(map)
        .bindPopup(popupContent)

      markers.push(marker)
      bounds.push([p.latitud, p.longitud])
    }
  })

  // Si hay marcadores, ajustamos el zoom para mostrarlos todos
  if (bounds.length > 0) {
    map.fitBounds(bounds, { padding: [50, 50] })
  }
}

async function cargarDatos() {
  cargandoDatos.value = true

  try {
    const { data } = await $api.get('/propietarios-no-vacunados')
    propietarios.value = data

    // Inicializar el mapa y mostrar los marcadores
    if (!map) {
      inicializarMapa()
    }

    mostrarMarcadores(data)

    $q.notify({
      type: 'positive',
      message: 'Datos actualizados correctamente',
      position: 'bottom-right',
      timeout: 2000
    })
  } catch (error) {
    console.error("Error al obtener datos del backend:", error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar los datos. Intente nuevamente.',
      position: 'bottom-right'
    })
    propietarios.value = []
  } finally {
    cargandoDatos.value = false
  }
}

// Eliminamos la función filtrarPorZona ya que no la necesitamos

function centrarEnMapa(propietario) {
  if (propietario.latitud && propietario.longitud) {
    map.setView([propietario.latitud, propietario.longitud], 15)

    // Buscamos el marcador correspondiente y abrimos su popup
    markers.forEach(marker => {
      const markerLatLng = marker.getLatLng()
      if (markerLatLng.lat === propietario.latitud && markerLatLng.lng === propietario.longitud) {
        marker.openPopup()
      }
    })
  } else {
    $q.notify({
      type: 'warning',
      message: 'Este propietario no tiene ubicación registrada',
      position: 'bottom-right'
    })
  }
}

function generarPDF() {
  generandoPDF.value = true

  setTimeout(() => {
    try {
      const doc = new jsPDF()

      // Título y fecha
      doc.setFontSize(18)
      doc.setTextColor(0, 51, 153)
      doc.text("Propietarios con Mascotas Sin Vacunar", 14, 15)

      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 22)

      // Estadísticas generales
      doc.setFontSize(12)
      doc.setTextColor(0, 0, 0)
      doc.text(`Total de propietarios: ${propietarios.value.length}`, 14, 30)
      doc.text(`Total de mascotas sin vacunar: ${totalMascotas.value}`, 14, 36)
      doc.text(`Propietarios mapeados: ${propietariosConUbicacion.value}`, 14, 42)

      // Tabla de propietarios
      const rows = propietarios.value.map(p => {
        const nombre = getNombreCompleto(p)
        const cantidadMascotas = p.mascotas ? p.mascotas.length : 0
        const nombresMascotas = p.mascotas ? p.mascotas.map(m => m.nombre).join(", ") : "-"
        return [nombre, cantidadMascotas, nombresMascotas, p.latitud || "-", p.longitud || "-"]
      })

      autoTable(doc, {
        head: [['Propietario', 'Cant. Mascotas', 'Nombres Mascotas', 'Latitud', 'Longitud']],
        body: rows,
        startY: 50,
        theme: 'grid',
        headStyles: { fillColor: [0, 102, 204] },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      doc.save('PropietariosNoVacunados.pdf')

      $q.notify({
        type: 'positive',
        message: 'PDF generado correctamente',
        position: 'bottom-right',
        timeout: 2000
      })
    } catch (error) {
      console.error("Error al generar PDF:", error)

      $q.notify({
        type: 'negative',
        message: 'Error al generar el PDF',
        position: 'bottom-right'
      })
    } finally {
      generandoPDF.value = false
    }
  }, 500)
}

// Ciclo de vida
onMounted(() => {
  cargarDatos()

  // Añadimos estilos personalizados para los popups
  const style = document.createElement('style')
  style.textContent = `
    .custom-popup {
      max-width: 250px;
      padding: 5px;
    }
    .custom-popup h4 {
      margin: 0 0 5px 0;
      color: #2c3e50;
    }
    .popup-subtitle {
      font-weight: bold;
      margin: 5px 0;
      color: #34495e;
    }
    .popup-mascotas-container {
      margin-bottom: 10px;
    }
    .popup-mascota {
      padding: 5px 0;
      border-bottom: 1px dashed #eee;
    }
    .popup-mascota:last-child {
      border-bottom: none;
    }
    .popup-mascota-nombre {
      font-weight: bold;
      color: #1976D2;
    }
    .popup-mascota-info {
      font-size: 0.9em;
      color: #555;
    }
    .popup-footer {
      margin-top: 10px;
      font-size: 0.9em;
      color: #666;
    }
    .popup-contacto {
      display: flex;
      flex-direction: column;
      gap: 3px;
    }
    .popup-icon {
      font-size: 14px;
      vertical-align: middle;
      margin-right: 3px;
    }
    .marker-pin {
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      background: #c30b82;
      position: absolute;
      transform: rotate(-45deg);
      left: 50%;
      top: 50%;
      margin: -15px 0 0 -15px;
    }
    .marker-pin::after {
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
      color: #c30b82;
      z-index: 1;
    }
  `
  document.head.appendChild(style)
})
</script>

<style>
@import "leaflet/dist/leaflet.css";
@import url('https://fonts.googleapis.com/icon?family=Material+Icons');

.pagina-no-vacunados {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.header-container {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.map-container {
  position: relative;
}

.map-card,
.info-card,
.list-card,
.stats-card {
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
}

.map-card:hover,
.info-card:hover,
.list-card:hover,
.stats-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.mapa {
  height: 600px;
  width: 100%;
  border-radius: 0;
  z-index: 0;
}

.map-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
}

.map-legend {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.hover-highlight:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

/* Estilos responsivos */
@media (max-width: 1023px) {
  .mapa {
    height: 450px;
  }
}

@media (max-width: 599px) {
  .mapa {
    height: 350px;
  }

  .header-container {
    padding: 15px;
  }
}
</style>

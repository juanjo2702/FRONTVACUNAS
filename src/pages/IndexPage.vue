<template>
  <q-page class="dashboard-container">
    <!-- Encabezado del Dashboard -->
    <div class="dashboard-header q-mb-md">
      <div class="row items-center justify-between">
        <div class="col-12 col-md-auto">
          <h1 class="text-h4 text-white q-my-none">Dashboard de Control de Mascotas</h1>
          <p class="text-grey-4 q-mt-xs">Monitoreo y análisis de registros de mascotas y vacunación</p>
        </div>
        <div class="col-12 col-md-auto q-mt-sm q-mt-md-none">
          <q-badge outline color="white" class="q-py-sm q-px-md">
            <q-icon name="update" class="q-mr-xs" />
            Última actualización: {{ ultimaActualizacion }}
          </q-badge>
          <q-btn flat round color="white" icon="refresh" class="q-ml-sm" @click="recargarDatos"
            :loading="cargandoDatos">
            <q-tooltip>Actualizar datos</q-tooltip>
          </q-btn>
        </div>
      </div>
    </div>

    <!-- Tarjetas principales con animación de carga -->
    <div class="row justify-center q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-4 col-lg stats-card">
        <q-card class="dashboard-card primary-card full-height" :class="{ 'pulse-animation': cargandoDatos }">
          <q-card-section class="q-pb-none">
            <div class="row items-center no-wrap">
              <div class="col-auto">
                <q-icon name="pets" size="3.5rem" color="white" class="dashboard-icon" />
              </div>
              <div class="col">
                <div class="text-subtitle1 text-grey-4">Mascotas Registradas</div>
                <div class="row items-center">
                  <div class="text-h3 text-white">{{ totalMascotas }}</div>
                  <q-chip outline color="green" text-color="white" class="q-ml-sm" size="sm"
                    v-if="tendenciaMascotas > 0">
                    <q-icon name="arrow_upward" left size="xs" />
                    {{ tendenciaMascotas }}%
                  </q-chip>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator dark class="q-my-md" />

          <q-card-section class="q-pt-none">
            <div class="row items-center justify-between">
              <div class="col-6 text-center">
                <div class="text-grey-4 text-caption">Perros</div>
                <div class="text-white text-subtitle1">{{ totalPerros }}</div>
              </div>
              <div class="col-6 text-center">
                <div class="text-grey-4 text-caption">Gatos</div>
                <div class="text-white text-subtitle1">{{ totalGatos }}</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg stats-card">
        <q-card class="dashboard-card vaccine-card full-height" :class="{ 'pulse-animation': cargandoDatos }">
          <q-card-section class="q-pb-none">
            <div class="row items-center no-wrap">
              <div class="col-auto">
                <q-icon name="vaccines" size="3.5rem" color="white" class="dashboard-icon" />
              </div>
              <div class="col">
                <div class="text-subtitle1 text-grey-4">Estado de Vacunación</div>
                <div class="row items-center">
                  <div class="text-h3 text-white">{{ totalVacunadas }}</div>
                  <div class="text-subtitle1 text-grey-4 q-ml-md">de {{ totalMascotas }}</div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator dark class="q-my-md" />

          <q-card-section class="q-pt-none">
            <div class="row items-center justify-between">
              <div class="col-6">
                <div class="text-grey-4 text-caption">Vacunadas</div>
                <div class="row items-center">
                  <div class="text-white text-subtitle1">{{ totalVacunadas }}</div>
                  <div class="text-positive text-caption q-ml-sm">{{ porcentajeVacunadas }}%</div>
                </div>
              </div>
              <div class="col-6">
                <div class="text-grey-4 text-caption">No Vacunadas</div>
                <div class="row items-center">
                  <div class="text-white text-subtitle1">{{ totalNoVacunadas }}</div>
                  <div class="text-negative text-caption q-ml-sm">{{ porcentajeNoVacunadas }}%</div>
                </div>
              </div>
            </div>
            <q-linear-progress size="md" :value="porcentajeVacunadas / 100" color="positive" track-color="negative"
              class="q-mt-sm" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-6 col-md-4 col-lg stats-card">
        <q-card class="dashboard-card tertiary-card full-height" :class="{ 'pulse-animation': cargandoDatos }">
          <q-card-section class="q-pb-none">
            <div class="row items-center no-wrap">
              <div class="col-auto">
                <q-icon name="people" size="3.5rem" color="white" class="dashboard-icon" />
              </div>
              <div class="col">
                <div class="text-subtitle1 text-grey-4">Propietarios Registrados</div>
                <div class="row items-center">
                  <div class="text-h3 text-white">{{ totalPropietarios }}</div>
                  <q-chip outline color="green" text-color="white" class="q-ml-sm" size="sm"
                    v-if="tendenciaPropietarios > 0">
                    <q-icon name="arrow_upward" left size="xs" />
                    {{ tendenciaPropietarios }}%
                  </q-chip>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator dark class="q-my-md" />

          <q-card-section class="q-pt-none">
            <div class="row items-center justify-between">
              <div class="col">
                <div class="text-grey-4 text-caption">Campañas Activas</div>
                <div class="row items-center">
                  <div class="text-white text-subtitle1">{{ totalCampanas }}</div>
                  <q-btn flat round color="white" size="sm" icon="info" class="q-ml-xs">
                    <q-tooltip>{{ campañasTooltip }}</q-tooltip>
                  </q-btn>
                </div>
              </div>
              <div class="col text-right">
                <div class="text-grey-4 text-caption">Promedio de mascotas</div>
                <div class="text-white text-subtitle1">{{ promedioMascotasPorPropietario }} por propietario</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Sección de distribución por razas -->
    <div class="section-title q-mb-md">
      <div class="row items-center">
        <div class="col">
          <h2 class="text-h5 text-white q-my-none">Distribución por Razas</h2>
          <p class="text-grey-4 q-mt-xs q-mb-none">Clasificación de mascotas registradas por raza</p>
        </div>
        <div class="col-auto">
          <q-btn-toggle v-model="vistaRazas" toggle-color="primary" flat text-color="white" :options="[
            { label: 'TreeMap', value: 'treemap' },
            { label: 'Gráfico de Barras', value: 'bar' }
          ]" />
        </div>
      </div>
    </div>

    <div class="row justify-center q-col-gutter-md q-mb-lg">
      <!-- Perros Registrados por Raza -->
      <div class="col-12 col-md-6">
        <q-card class="dashboard-card chart-card" :class="{ 'pulse-animation': cargandoDatos }">
          <q-card-section class="q-pb-xs">
            <div class="row items-center justify-between">
              <div>
                <div class="row items-center">
                  <q-icon name="pets" size="1.8rem" color="white" class="q-mr-sm" />
                  <div class="text-h6 text-white">Perros Registrados por Raza</div>
                </div>
                <p class="text-grey-4 q-mt-xs q-mb-none text-caption">Top {{ perrosPorRazaChartSeries.length }} razas
                  más comunes</p>
              </div>
              <q-btn-dropdown color="primary" flat icon="more_vert" class="q-pa-none">
                <q-list>
                  <q-item clickable v-close-popup @click="descargarDatosDogs">
                    <q-item-section avatar><q-icon name="download" /></q-item-section>
                    <q-item-section>Exportar datos</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="verDetalleRazas('perros')">
                    <q-item-section avatar><q-icon name="list" /></q-item-section>
                    <q-item-section>Ver listado completo</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </q-card-section>

          <q-card-section>
            <div v-if="vistaRazas === 'treemap'" class="chart-container">
              <ApexChartComponent type="treemap" :options="perrosPorRazaChartOptions"
                :series="[{ data: perrosPorRazaChartSeries }]" class="chart-height" />
            </div>
            <div v-else class="chart-container">
              <ApexChartComponent type="bar" :options="perrosPorRazaBarOptions"
                :series="[{ name: 'Cantidad', data: perrosPorRazaBarSeries.map(item => item.y) }]"
                class="chart-height" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Gatos Registrados por Raza -->
      <div class="col-12 col-md-6">
        <q-card class="dashboard-card chart-card" :class="{ 'pulse-animation': cargandoDatos }">
          <q-card-section class="q-pb-xs">
            <div class="row items-center justify-between">
              <div>
                <div class="row items-center">
                  <q-icon name="pets" size="1.8rem" color="white" class="q-mr-sm" />
                  <div class="text-h6 text-white">Gatos Registrados por Raza</div>
                </div>
                <p class="text-grey-4 q-mt-xs q-mb-none text-caption">Top {{ gatosPorRazaChartSeries.length }} razas más
                  comunes</p>
              </div>
              <q-btn-dropdown color="primary" flat icon="more_vert" class="q-pa-none">
                <q-list>
                  <q-item clickable v-close-popup @click="descargarDatosCats">
                    <q-item-section avatar><q-icon name="download" /></q-item-section>
                    <q-item-section>Exportar datos</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="verDetalleRazas('gatos')">
                    <q-item-section avatar><q-icon name="list" /></q-item-section>
                    <q-item-section>Ver listado completo</q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </q-card-section>

          <q-card-section>
            <div v-if="vistaRazas === 'treemap'" class="chart-container">
              <ApexChartComponent type="treemap" :options="gatosPorRazaChartOptions"
                :series="[{ data: gatosPorRazaChartSeries }]" class="chart-height" />
            </div>
            <div v-else class="chart-container">
              <ApexChartComponent type="bar" :options="gatosPorRazaBarOptions"
                :series="[{ name: 'Cantidad', data: gatosPorRazaBarSeries.map(item => item.y) }]"
                class="chart-height" />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Sección de estadísticas de vacunación -->
    <div class="section-title q-mb-md">
      <div class="row items-center">
        <div class="col">
          <h2 class="text-h5 text-white q-my-none">Estadísticas de Vacunación</h2>
          <p class="text-grey-4 q-mt-xs q-mb-none">Análisis de cobertura de vacunación por tipo de mascota</p>
        </div>

        <!-- Reemplazamos el selector por un chip para mantener consistencia visual -->
        <div class="col-auto">
          <q-chip outline class="q-py-sm" icon="date_range" color="primary" text-color="white" clickable
            @click="mostrarSelectorPeriodo = true">
            {{ obtenerLabelPeriodo }}
          </q-chip>
        </div>
      </div>
    </div>

    <!-- Gráficos de estadísticas de vacunación -->
    <div class="row justify-center q-col-gutter-md q-mb-lg">
      <!-- Distribución de Mascotas por Especie -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card chart-card" :class="{ 'pulse-animation': cargandoDatos }">
          <q-card-section class="q-pb-xs">
            <div class="row items-center">
              <q-icon name="pets" size="1.8rem" color="white" class="q-mr-sm" />
              <div class="text-h6 text-white">Distribución por Especie</div>
            </div>
          </q-card-section>

          <q-card-section>
            <ApexChartComponent type="donut" :options="mascotasPorEspecieChartOptions"
              :series="mascotasPorEspecieChartSeries" height="250" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Control de Mascotas Vacunadas y No Vacunadas -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card chart-card" :class="{ 'pulse-animation': cargandoDatos }">
          <q-card-section class="q-pb-xs">
            <div class="row items-center">
              <q-icon name="vaccines" size="1.8rem" color="white" class="q-mr-sm" />
              <div class="text-h6 text-white">Control de Vacunación</div>
            </div>
          </q-card-section>

          <q-card-section>
            <ApexChartComponent type="pie" :options="mascotasVacunadasChartOptions"
              :series="mascotasVacunadasChartSeries" height="250" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Perros Vacunados y No Vacunados -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card chart-card" :class="{ 'pulse-animation': cargandoDatos }">
          <q-card-section class="q-pb-xs">
            <div class="row items-center">
              <q-icon name="pets" size="1.8rem" color="white" class="q-mr-sm" />
              <div class="text-h6 text-white">Perros - Estado Vacunación</div>
            </div>
          </q-card-section>

          <q-card-section>
            <ApexChartComponent type="pie" :options="perrosVacunadosChartOptions" :series="perrosVacunadosChartSeries"
              height="250" />
          </q-card-section>
        </q-card>
      </div>

      <!-- Gatos Vacunados y No Vacunados -->
      <div class="col-12 col-sm-6 col-md-3">
        <q-card class="dashboard-card chart-card" :class="{ 'pulse-animation': cargandoDatos }">
          <q-card-section class="q-pb-xs">
            <div class="row items-center">
              <q-icon name="pets" size="1.8rem" color="white" class="q-mr-sm" />
              <div class="text-h6 text-white">Gatos - Estado Vacunación</div>
            </div>
          </q-card-section>

          <q-card-section>
            <ApexChartComponent type="pie" :options="gatosVacunadosChartOptions" :series="gatosVacunadosChartSeries"
              height="250" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- Diálogo para ver detalle de razas - Usando theme-dark para mantener estilo oscuro -->
    <q-dialog v-model="verDetalle" persistent class="detail-dialog">
      <q-card dark class="dashboard-dialog-card">
        <q-card-section class="row items-center q-pb-none bg-primary text-white">
          <div class="text-h6">{{ tituloDetalle }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-none">
          <q-table dark :rows="datosDetalle" :columns="columnasDetalle" row-key="raza"
            :rows-per-page-options="[10, 20, 50, 0]" :pagination="{ rowsPerPage: 10 }" flat bordered separator="cell"
            class="detail-table">
            <template v-slot:header="props">
              <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props"
                  class="bg-primary text-white text-weight-bold">
                  {{ col.label }}
                </q-th>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>

        <q-card-actions align="right" class="bg-dark text-white">
          <q-btn icon="file_download" label="Exportar a CSV" color="primary" flat @click="exportarCSV" />
          <q-btn label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog para seleccionar período - Usando theme-dark para mantener estilo oscuro -->
    <q-dialog v-model="mostrarSelectorPeriodo" position="top">
      <q-card dark style="width: 300px" class="dashboard-dialog-card">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Seleccionar período</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-list dark>
            <q-item v-for="opcion in periodoOpciones" :key="opcion.value" clickable v-close-popup
              @click="periodoSeleccionado = opcion.value" :active="periodoSeleccionado === opcion.value"
              active-class="text-primary">
              <q-item-section>
                <q-item-label>{{ opcion.label }}</q-item-label>
              </q-item-section>
              <q-item-section avatar v-if="periodoSeleccionado === opcion.value">
                <q-icon color="primary" name="check" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>


<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';

const $q = useQuasar();

// Variables para almacenar los datos de las tarjetas
const totalMascotas = ref(0);
const totalVacunadas = ref(0);
const totalNoVacunadas = ref(0);
const totalCampanas = ref(0);
const totalPropietarios = ref(0);
const totalPerros = ref(0);
const totalGatos = ref(0);
const cargandoDatos = ref(false);
const ultimaActualizacion = ref(new Date().toLocaleString());
const periodoSeleccionado = ref('ultimo-mes');
const vistaRazas = ref('treemap');
const mostrarSelectorPeriodo = ref(false);

// Variables para ver detalle de razas
const verDetalle = ref(false);
const tituloDetalle = ref('');
const datosDetalle = ref([]);
const columnasDetalle = ref([
  { name: 'raza', label: 'Raza', field: 'raza', align: 'left', sortable: true },
  { name: 'cantidad', label: 'Cantidad', field: 'cantidad', align: 'center', sortable: true }
]);

// Tendencias (datos de ejemplo - en una implementación real vendrían del backend)
const tendenciaMascotas = ref(5.2);
const tendenciaPropietarios = ref(3.8);
const campañasTooltip = ref('Campaña de Vacunación Antirrábica (Fecha: 15/07), Campaña de Esterilización (Fecha: 01/08)');

// Opciones para el selector de período
const periodoOpciones = [
  { label: 'Último mes', value: 'ultimo-mes' },
  { label: 'Último trimestre', value: 'ultimo-trimestre' },
  { label: 'Último año', value: 'ultimo-anio' },
  { label: 'Todo el tiempo', value: 'todo' }
];

// Obtener label del período seleccionado
const obtenerLabelPeriodo = computed(() => {
  const opcion = periodoOpciones.find(op => op.value === periodoSeleccionado.value);
  return opcion ? opcion.label : 'Período seleccionado';
});

// Variables para las series de datos de los gráficos
const mascotasPorEspecieChartSeries = ref([]);
const perrosPorRazaChartSeries = ref([]);
const gatosPorRazaChartSeries = ref([]);
const perrosPorRazaBarSeries = ref([]);
const gatosPorRazaBarSeries = ref([]);
const mascotasVacunadasChartSeries = ref([]);
const perrosVacunadosChartSeries = ref([]);
const gatosVacunadosChartSeries = ref([]);

// Propiedades computadas
const porcentajeVacunadas = computed(() => {
  if (totalMascotas.value === 0) return 0;
  return Math.round((totalVacunadas.value / totalMascotas.value) * 100);
});

const porcentajeNoVacunadas = computed(() => {
  if (totalMascotas.value === 0) return 0;
  return Math.round((totalNoVacunadas.value / totalMascotas.value) * 100);
});

const promedioMascotasPorPropietario = computed(() => {
  if (totalPropietarios.value === 0) return 0;
  return (totalMascotas.value / totalPropietarios.value).toFixed(1);
});

// Helper para manejar errores de imágenes
const getFallbackImageUrl = (path) => {
  // Asegurarse de que las URLs de las imágenes siempre tengan una ruta válida
  if (!path || path.includes('/9000/no-image.png')) {
    // Usar una imagen base64 como respaldo
    return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlLCBzYW5zLXNlcmlmIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZW48L3RleHQ+PC9zdmc+';
  }
  return path;
};

// Opciones de los gráficos
const mascotasPorEspecieChartOptions = ref({
  chart: {
    type: 'donut',
    foreColor: '#fff',
    fontFamily: 'inherit',
    animations: {
      enabled: true,
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350
      }
    },
    toolbar: {
      show: false
    }
  },
  labels: [],
  colors: ['#3CD4A0', '#FF9F43', '#269FA8', '#9C88FF'],
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    labels: { colors: ['#fff'] },
    markers: {
      width: 12,
      height: 12,
      radius: 12
    },
    itemMargin: {
      horizontal: 10,
      vertical: 5
    }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%',
        background: 'transparent',
        labels: {
          show: true,
          name: {
            show: true,
            fontSize: '14px',
            color: '#fff'
          },
          value: {
            show: true,
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#fff',
            formatter: (val) => `${val}`
          },
          total: {
            show: true,
            label: 'Total',
            color: '#fff',
            formatter: (w) => {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
            }
          }
        }
      }
    }
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    width: 0
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val) => `${val} mascotas`
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      chart: {
        height: 250
      },
      legend: {
        position: 'bottom',
        itemMargin: {
          horizontal: 5,
          vertical: 2
        }
      }
    }
  }]
});

const treemapBaseOptions = {
  chart: {
    type: 'treemap',
    foreColor: '#fff',
    fontFamily: 'inherit',
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      speed: 800
    }
  },
  legend: {
    show: false
  },
  dataLabels: {
    enabled: true,
    style: {
      fontSize: '12px',
      fontWeight: 'bold',
      colors: ['#fff']
    },
    formatter: function (text, op) {
      return [text, op.value];
    },
    offsetY: -4
  },
  plotOptions: {
    treemap: {
      distributed: true,
      enableShades: true,
      shadeIntensity: 0.5,
      reverseNegativeShade: true
    }
  },
  tooltip: {
    theme: 'dark',
    x: {
      show: true
    },
    y: {
      formatter: (val) => `${val} mascotas`
    }
  },
  colors: ['#3CD4A0', '#FF9F43', '#269FA8', '#9C88FF', '#6C7A89', '#FC5C7D', '#6A82FB', '#38EF7D']
};

const perrosPorRazaChartOptions = ref({
  ...treemapBaseOptions,
  title: {
    text: 'Distribución de Perros por Raza',
    align: 'left',
    style: {
      fontSize: '16px',
      color: '#fff'
    },
    offsetY: 20
  }
});

const gatosPorRazaChartOptions = ref({
  ...treemapBaseOptions,
  title: {
    text: 'Distribución de Gatos por Raza',
    align: 'left',
    style: {
      fontSize: '16px',
      color: '#fff'
    },
    offsetY: 20
  }
});

const barBaseOptions = {
  chart: {
    type: 'bar',
    foreColor: '#fff',
    fontFamily: 'inherit',
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      speed: 800
    }
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 4,
      dataLabels: {
        position: 'top'
      }
    }
  },
  dataLabels: {
    enabled: true,
    offsetX: 30,
    style: {
      fontSize: '12px',
      colors: ['#fff']
    }
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  colors: ['#3CD4A0'],
  xaxis: {
    categories: [],
    labels: {
      style: {
        colors: '#fff'
      }
    }
  },
  yaxis: {
    labels: {
      style: {
        colors: '#fff'
      }
    }
  },
  grid: {
    borderColor: 'rgba(255,255,255,0.1)',
    row: {
      colors: ['transparent']
    }
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val) => `${val} mascotas`
    }
  }
};

const perrosPorRazaBarOptions = ref({
  ...barBaseOptions,
  title: {
    text: 'Razas de Perros',
    align: 'left',
    style: {
      fontSize: '16px',
      color: '#fff'
    },
    offsetY: 20
  }
});

const gatosPorRazaBarOptions = ref({
  ...barBaseOptions,
  title: {
    text: 'Razas de Gatos',
    align: 'left',
    style: {
      fontSize: '16px',
      color: '#fff'
    },
    offsetY: 20
  }
});

const pieBaseOptions = {
  chart: {
    type: 'pie',
    foreColor: '#fff',
    fontFamily: 'inherit',
    toolbar: {
      show: false
    },
    animations: {
      enabled: true,
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150
      }
    }
  },
  legend: {
    position: 'bottom',
    horizontalAlign: 'center',
    labels: { colors: ['#fff'] },
    markers: {
      width: 12,
      height: 12,
      radius: 12
    },
    itemMargin: {
      horizontal: 5,
      vertical: 0
    }
  },
  dataLabels: {
    enabled: true,
    formatter: function (val) {
      return val.toFixed(1) + "%";
    },
    style: {
      fontSize: '12px',
      colors: ['#fff']
    },
    background: {
      enabled: true,
      foreColor: '#000',
      opacity: 0.5,
      borderWidth: 0
    }
  },
  stroke: {
    width: 0
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter: (val, opt) => {
        const total = opt.globals.seriesTotals.reduce((a, b) => a + b, 0);
        const percent = ((val / total) * 100).toFixed(1);
        return `${val} (${percent}%)`;
      }
    }
  }
};

const mascotasVacunadasChartOptions = ref({
  ...pieBaseOptions,
  labels: ['Vacunadas', 'No Vacunadas'],
  colors: ['#3CD4A0', '#FF9F43']
});

const perrosVacunadosChartOptions = ref({
  ...pieBaseOptions,
  labels: ['Vacunados', 'No Vacunados'],
  colors: ['#3CD4A0', '#FF9F43']
});

const gatosVacunadosChartOptions = ref({
  ...pieBaseOptions,
  labels: ['Vacunados', 'No Vacunados'],
  colors: ['#3CD4A0', '#FF9F43']
});

// Función para ver detalle de razas en tabla
function verDetalleRazas(tipo) {
  if (tipo === 'perros') {
    tituloDetalle.value = 'Detalle de Perros por Raza';
    datosDetalle.value = perrosPorRazaChartSeries.value.map(item => ({
      raza: item.x,
      cantidad: item.y
    })).sort((a, b) => b.cantidad - a.cantidad);
  } else if (tipo === 'gatos') {
    tituloDetalle.value = 'Detalle de Gatos por Raza';
    datosDetalle.value = gatosPorRazaChartSeries.value.map(item => ({
      raza: item.x,
      cantidad: item.y
    })).sort((a, b) => b.cantidad - a.cantidad);
  }
  verDetalle.value = true;
}

// Función para exportar a CSV
function exportarCSV() {
  try {
    // Crear contenido CSV
    let csvContent = "data:text/csv;charset=utf-8,Raza,Cantidad\n";

    datosDetalle.value.forEach(item => {
      csvContent += `${item.raza},${item.cantidad}\n`;
    });

    // Crear enlace de descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${tituloDetalle.value.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);

    // Descargar archivo
    link.click();
    document.body.removeChild(link);

    $q.notify({
      message: 'Datos exportados correctamente',
      color: 'positive',
      position: 'bottom-right',
      timeout: 2000,
      icon: 'file_download'
    });
  } catch (error) {
    console.error('Error al exportar CSV:', error);
    $q.notify({
      message: 'Error al exportar datos',
      color: 'negative',
      position: 'bottom-right',
      timeout: 3000,
      icon: 'error'
    });
  }
}

// Funciones para descargar datos
function descargarDatosDogs() {
  exportarDatos(perrosPorRazaChartSeries.value, 'Perros_por_Raza');
}

function descargarDatosCats() {
  exportarDatos(gatosPorRazaChartSeries.value, 'Gatos_por_Raza');
}

function exportarDatos(datos, nombre) {
  try {
    // Crear contenido CSV
    let csvContent = "data:text/csv;charset=utf-8,Raza,Cantidad\n";

    datos.forEach(item => {
      csvContent += `${item.x},${item.y}\n`;
    });

    // Crear enlace de descarga
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${nombre}.csv`);
    document.body.appendChild(link);

    // Descargar archivo
    link.click();
    document.body.removeChild(link);

    $q.notify({
      message: 'Datos exportados correctamente',
      color: 'positive',
      position: 'bottom-right',
      timeout: 2000,
      icon: 'file_download'
    });
  } catch (error) {
    console.error('Error al exportar datos:', error);
    $q.notify({
      message: 'Error al exportar datos',
      color: 'negative',
      position: 'bottom-right',
      timeout: 3000,
      icon: 'error'
    });
  }
}

// Función para recargar los datos
function recargarDatos() {
  fetchDashboardData();

  $q.notify({
    message: 'Datos actualizados correctamente',
    color: 'positive',
    position: 'top-right',
    timeout: 2000,
    icon: 'update'
  });
}

// Observar cambios en el período seleccionado
watch(periodoSeleccionado, (newValue) => {
  fetchDashboardData();
});

// Manejador global de errores para componentes
function setupErrorHandlers() {
  // Manejar errores solo dentro del componente dashboard
  window.addEventListener('error', function (event) {
    // Verificar si el error proviene del dashboard
    if (event.target && (event.target.closest('.dashboard-container') ||
      event.target.closest('.dashboard-dialog-card'))) {
      console.error('Error capturado en el dashboard:', event.error);
      // Evitar que el error se propague
      event.preventDefault();
    }
  });
}

// Función para obtener los datos del backend - Con manejo mejorado de errores
const fetchDashboardData = async () => {
  cargandoDatos.value = true;

  try {
    // En una implementación real, pasaríamos el período seleccionado como parámetro
    const response = await api.get('/dashboard-data', {
      params: { periodo: periodoSeleccionado.value },
      // Aumentar el timeout para evitar errores de conexión
      timeout: 15000
    });

    // Verificar que la respuesta sea válida
    if (!response || !response.data) {
      throw new Error('Respuesta inválida del servidor');
    }

    const data = response.data;

    // Actualizar tarjetas de resumen
    totalMascotas.value = data.totalMascotas || 0;
    totalVacunadas.value = data.totalVacunadas || 0;
    totalNoVacunadas.value = data.totalNoVacunadas || 0;
    totalCampanas.value = data.totalCampanas || 0;
    totalPropietarios.value = data.totalPropietarios || 0;

    // Actualizar totales por especie - Con valores por defecto en caso de datos faltantes
    totalPerros.value = data.mascotasPorEspecie?.Perro || 0;
    totalGatos.value = data.mascotasPorEspecie?.Gato || 0;

    // Actualizar gráfico de Donut: "Distribución de Mascotas por Especie"
    // Asegurarse de que existan datos válidos
    if (data.mascotasPorEspecie && Object.keys(data.mascotasPorEspecie).length > 0) {
      mascotasPorEspecieChartSeries.value = Object.values(data.mascotasPorEspecie);
      mascotasPorEspecieChartOptions.value = {
        ...mascotasPorEspecieChartOptions.value,
        labels: Object.keys(data.mascotasPorEspecie)
      };
    } else {
      // Valores por defecto si no hay datos
      mascotasPorEspecieChartSeries.value = [0, 0];
      mascotasPorEspecieChartOptions.value = {
        ...mascotasPorEspecieChartOptions.value,
        labels: ['Perro', 'Gato']
      };
    }

    // Configuración para el gráfico TreeMap: "Perros Registrados por Raza"
    if (data.perrosPorRaza && Object.keys(data.perrosPorRaza).length > 0) {
      perrosPorRazaChartSeries.value = Object.keys(data.perrosPorRaza).map((raza) => ({
        x: raza,
        y: data.perrosPorRaza[raza]
      }));

      // Ordenar por cantidad para el gráfico de barras
      perrosPorRazaBarSeries.value = [...perrosPorRazaChartSeries.value].sort((a, b) => b.y - a.y);
      perrosPorRazaBarOptions.value.xaxis.categories = perrosPorRazaBarSeries.value.map(item => item.x);
    } else {
      // Valores por defecto si no hay datos
      perrosPorRazaChartSeries.value = [{ x: 'Sin datos', y: 0 }];
      perrosPorRazaBarSeries.value = [{ x: 'Sin datos', y: 0 }];
      perrosPorRazaBarOptions.value.xaxis.categories = ['Sin datos'];
    }

    // Configuración para el gráfico TreeMap: "Gatos Registrados por Raza"
    if (data.gatosPorRaza && Object.keys(data.gatosPorRaza).length > 0) {
      gatosPorRazaChartSeries.value = Object.keys(data.gatosPorRaza).map((raza) => ({
        x: raza,
        y: data.gatosPorRaza[raza]
      }));

      // Ordenar por cantidad para el gráfico de barras
      gatosPorRazaBarSeries.value = [...gatosPorRazaChartSeries.value].sort((a, b) => b.y - a.y);
      gatosPorRazaBarOptions.value.xaxis.categories = gatosPorRazaBarSeries.value.map(item => item.x);
    } else {
      // Valores por defecto si no hay datos
      gatosPorRazaChartSeries.value = [{ x: 'Sin datos', y: 0 }];
      gatosPorRazaBarSeries.value = [{ x: 'Sin datos', y: 0 }];
      gatosPorRazaBarOptions.value.xaxis.categories = ['Sin datos'];
    }

    // Actualizar gráfico de Pie: "Mascotas Vacunadas y No Vacunadas"
    if (data.mascotasVacunadasYNo) {
      mascotasVacunadasChartSeries.value = [
        data.mascotasVacunadasYNo.vacunadas || 0,
        data.mascotasVacunadasYNo.no_vacunadas || 0
      ];
    } else {
      mascotasVacunadasChartSeries.value = [0, 0];
    }

    // Actualizar gráfico de Pie: "Perros Vacunados y No Vacunados"
    if (data.perrosVacunadosYNo) {
      perrosVacunadosChartSeries.value = [
        data.perrosVacunadosYNo.vacunados || 0,
        data.perrosVacunadosYNo.no_vacunados || 0
      ];
    } else {
      perrosVacunadosChartSeries.value = [0, 0];
    }

    // Actualizar gráfico de Pie: "Gatos Vacunados y No Vacunados"
    if (data.gatosVacunadosYNo) {
      gatosVacunadosChartSeries.value = [
        data.gatosVacunadosYNo.vacunados || 0,
        data.gatosVacunadosYNo.no_vacunados || 0
      ];
    } else {
      gatosVacunadosChartSeries.value = [0, 0];
    }

    // Actualizar fecha de última actualización
    ultimaActualizacion.value = new Date().toLocaleString();
  } catch (error) {
    console.error('Error obteniendo los datos del dashboard:', error);

    // Manejar diferentes tipos de errores
    if (error.response) {
      // Error de respuesta del servidor
      $q.notify({
        message: `Error del servidor: ${error.response.status} - ${error.response.statusText}`,
        color: 'negative',
        position: 'top-right',
        timeout: 3000,
        icon: 'error'
      });
    } else if (error.request) {
      // Error de red (no se recibió respuesta)
      $q.notify({
        message: 'Error de conexión con el servidor. Verifique su conexión a internet.',
        color: 'negative',
        position: 'top-right',
        timeout: 3000,
        icon: 'wifi_off'
      });
    } else {
      // Otro tipo de error
      $q.notify({
        message: 'Error al cargar los datos del dashboard: ' + error.message,
        color: 'negative',
        position: 'top-right',
        timeout: 3000,
        icon: 'error'
      });
    }

    // Establecer valores por defecto para no romper la interfaz
    configurarValoresPorDefecto();
  } finally {
    // Simular un breve retraso para la animación de carga
    setTimeout(() => {
      cargandoDatos.value = false;
    }, 600);
  }
};

// Función para establecer valores por defecto si hay errores
function configurarValoresPorDefecto() {
  // Valores por defecto para las tarjetas
  totalMascotas.value = 0;
  totalVacunadas.value = 0;
  totalNoVacunadas.value = 0;
  totalCampanas.value = 0;
  totalPropietarios.value = 0;
  totalPerros.value = 0;
  totalGatos.value = 0;

  // Valores por defecto para los gráficos
  mascotasPorEspecieChartSeries.value = [0, 0];
  mascotasPorEspecieChartOptions.value = {
    ...mascotasPorEspecieChartOptions.value,
    labels: ['Perro', 'Gato']
  };

  perrosPorRazaChartSeries.value = [{ x: 'Sin datos', y: 0 }];
  perrosPorRazaBarSeries.value = [{ x: 'Sin datos', y: 0 }];
  perrosPorRazaBarOptions.value.xaxis.categories = ['Sin datos'];

  gatosPorRazaChartSeries.value = [{ x: 'Sin datos', y: 0 }];
  gatosPorRazaBarSeries.value = [{ x: 'Sin datos', y: 0 }];
  gatosPorRazaBarOptions.value.xaxis.categories = ['Sin datos'];

  mascotasVacunadasChartSeries.value = [0, 0];
  perrosVacunadosChartSeries.value = [0, 0];
  gatosVacunadosChartSeries.value = [0, 0];
}

// Función para precargar imágenes y evitar errores 404
function precargarImagenes() {
  // Crear una imagen de respaldo en base64
  const imgFallback = new Image();
  imgFallback.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCIgeT0iNTAiIGZvbnQtc2l6ZT0iMTQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlLCBzYW5zLXNlcmlmIiBmaWxsPSIjOTk5Ij5ObyBJbWFnZW48L3RleHQ+PC9zdmc+';

  // Agregar al DOM para cachear
  document.body.appendChild(imgFallback);
  document.body.removeChild(imgFallback);
}

// Configurar manejador de errores para OpenStreetMap
function configurarMapaAlternativo() {
  // Este código debe ejecutarse si estás usando OpenStreetMap
  window.handleMapTileError = function (event) {
    // Reemplazar con otro proveedor de tiles si hay error
    console.warn('Error al cargar tile de mapa, intentando con proveedor alternativo');
    event.target.src = event.target.src.replace(
      'tile.openstreetmap.org',
      'a.basemaps.cartocdn.com/light_all'
    );

    // Si también falla, usar un tile en blanco
    event.target.onerror = function () {
      event.target.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAAA1BMVEXm5+i1+56pAAAAH0lEQVRoge3BAQ0AAADCIPuntscHAwAAAAAAAAAAIOQmFgABzF5AAQAAADt0RVh0Y29tbWVudABGaWxlIHNvdXJjZTogaHR0cHM6Ly9jb21tb25zLndpa2ltZWRpYS5vcmcvd2lraS9GaWxlOkJsYW5rX21hcF90aWxlLnBuZ+3qgZsAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjQtMDUtMjJUMTU6NDI6MTErMDA6MDAKGz5yAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDI0LTA1LTIyVDE1OjQyOjExKzAwOjAwe0aGjgAAACh0RVh0ZGF0ZTp0aW1lc3RhbXAAMjAyNC0wNS0yMlQxNTo0MjoxMSswMDowMCwTp1EAAAAASUVORK5CYII=';
    };
  };
}

// Lifecycle hooks
onMounted(() => {
  try {
    // Configurar manejadores de error sólo para el dashboard
    setupErrorHandlers();

    // Precargar imágenes
    precargarImagenes();

    // Configurar manejo de errores para el mapa
    configurarMapaAlternativo();

    // Cargar datos iniciales
    fetchDashboardData();
  } catch (error) {
    console.error('Error en onMounted:', error);
    $q.notify({
      message: 'Error al inicializar el dashboard',
      color: 'negative',
      position: 'top-right',
      timeout: 3000,
      icon: 'error'
    });
  }
});

// Limpieza al desmontar
onBeforeUnmount(() => {
  try {
    // Limpiar cualquier suscripción o recurso
    // Limpiar solo los manejadores específicos del dashboard
    const dashboardContainer = document.querySelector('.dashboard-container');
    if (dashboardContainer) {
      // Aquí limpiamos solo los manejadores de eventos específicos del dashboard
    }
  } catch (error) {
    console.error('Error en onBeforeUnmount:', error);
  }
});
</script>

<style>
/* Corregir problemas con las tablas en el diálogo */
.dashboard-dialog-card .q-table th {
  color: white !important;
}

.dashboard-dialog-card .q-table td {
  color: white !important;
}

/* Estilos para componentes dentro de los diálogos del dashboard */
.dashboard-dialog-card .q-item {
  color: white !important;
}

/* Estilos para corregir tiles de mapa */
.leaflet-tile-container img {
  onerror: "window.handleMapTileError && window.handleMapTileError(event)";
}
</style>

<style scoped>
/* Dashboard container principal - contenedor raíz */
.dashboard-container {
  background-color: #19224F;
  padding: 20px;
  min-height: 100vh;
  box-sizing: border-box;
  display: block;
  width: 100%;
  position: relative;
  z-index: 1;
}

/* Estilos específicos para este componente */
.dashboard-header {
  background-color: rgba(36, 57, 93, 0.5);
  border-radius: 8px;
  padding: 20px;
  border-left: 4px solid #3CD4A0;
}

.section-title {
  background-color: rgba(36, 57, 93, 0.3);
  border-radius: 8px;
  padding: 15px 20px;
  border-left: 4px solid #269FA8;
}

.dashboard-card {
  background-color: #24395D;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  height: 100%;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
}

.primary-card {
  background: linear-gradient(135deg, #269FA8 0%, #1A7F8C 100%);
}

.vaccine-card {
  background: linear-gradient(135deg, #3CD4A0 0%, #1E9A6A 100%);
}

.tertiary-card {
  background: linear-gradient(135deg, #9C88FF 0%, #6C5CE7 100%);
}

.chart-card {
  background-color: #24395D;
}

.dashboard-icon {
  background-color: rgba(255, 255, 255, 0.15);
  padding: 10px;
  border-radius: 50%;
}

.q-card-section {
  padding: 20px;
}

.chart-container {
  margin-top: 10px;
  position: relative;
  z-index: 1;
}

.chart-height {
  height: 300px;
}

/* Estilos para el detalle de razas */
.detail-dialog .q-card {
  width: 700px;
  max-width: 90vw;
}

.detail-table {
  max-height: 500px;
}

.dashboard-dialog-card {
  background-color: #24395D !important;
  color: white !important;
}

/* Animación de pulso para la carga */
@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }

  100% {
    opacity: 1;
  }
}

.pulse-animation {
  animation: pulse 1.5s infinite ease-in-out;
}

@media (max-width: 599px) {
  .dashboard-container {
    padding: 10px;
  }

  .dashboard-header {
    padding: 15px;
  }

  .q-card-section {
    padding: 15px;
  }

  .chart-height {
    height: 250px;
  }

  .stats-card {
    margin-bottom: 15px;
  }
}
</style>

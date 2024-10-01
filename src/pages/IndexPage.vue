<template>
  <q-page class="q-pa-md" style="background-color: #19224F; padding-left: 20px;">
    <!-- Fila de tarjetas principales con iconos -->
    <div class="row justify-center q-col-gutter-md q-mt-md q-mb-md">
      <q-card class="col-12 col-md-2 text-center bg-teal text-white q-pa-sm shadow-2 q-mx-md"
        style="background-color: #269FA8;">
        <q-card-section>
          <q-icon name="pets" size="40px" class="q-mb-sm" />
          <div class="text-h6 text-white">Mascotas Registradas</div>
          <div class="text-h5 text-white">{{ totalMascotas }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-2 text-center text-white q-pa-sm shadow-2 q-mx-md"
        style="background-color: #3CD4A0;">
        <q-card-section>
          <q-icon name="vaccines" size="40px" class="q-mb-sm" />
          <div class="text-h6 text-white">Vacunadas</div>
          <div class="text-h5 text-white">{{ totalVacunadas }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-2 text-center text-white q-pa-sm shadow-2 q-mx-md"
        style="background-color: #FF9F43;">
        <q-card-section>
          <q-icon name="block" size="40px" class="q-mb-sm" />
          <div class="text-h6 text-white">No Vacunadas</div>
          <div class="text-h5 text-white">{{ totalNoVacunadas }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-2 text-center text-white q-pa-sm shadow-2 q-mx-md"
        style="background-color: #6C7A89;">
        <q-card-section>
          <q-icon name="campaign" size="40px" class="q-mb-sm" />
          <div class="text-h6 text-white">Campañas Activas</div>
          <div class="text-h5 text-white">{{ totalCampanas }}</div>
        </q-card-section>
      </q-card>

      <q-card class="col-12 col-md-2 text-center text-white q-pa-sm shadow-2 q-mx-md"
        style="background-color: #9C88FF;">
        <q-card-section>
          <q-icon name="people" size="40px" class="q-mb-sm" />
          <div class="text-h6 text-white">Propietarios Registrados</div>
          <div class="text-h5 text-white">{{ totalPropietarios }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Fila de gráficos principales (Primera fila de gráficos) -->
    <div class="row justify-center q-col-gutter-md q-mb-md q-mt-md">
      <!-- Gráfico 1: Distribución de Vacunación por Zona (tipo donut) -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="place" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Distribución de Vacunación por Zona</div>
          <apexchart type="donut" :options="vacunasPorZonaChartOptions" :series="vacunasPorZonaChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Gráfico 2: Progreso de Vacunación -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="pets" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Progreso de Vacunación</div>
          <apexchart type="donut" :options="vacunasProgresoChartOptions" :series="vacunasProgresoChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Gráfico 3: Vacunación por Mes -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="bar_chart" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Vacunación por Mes</div>
          <apexchart type="bar" :options="vacunasMesChartOptions" :series="vacunasMesChartSeries" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Segunda fila de gráficos -->
    <div class="row justify-center q-col-gutter-md q-mb-md q-mt-md">
      <!-- Gráfico 4: Evolución de la Vacunación -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="trending_up" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Evolución de la Vacunación</div>
          <apexchart type="line" :options="vacunasEvolucionChartOptions" :series="vacunasEvolucionChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Gráfico 5: Participación en Campañas -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="group" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Participación en Campañas</div>
          <apexchart type="bar" :options="participacionCampanasChartOptions"
            :series="participacionCampanasChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Gráfico 6: Efectividad de las Vacunas -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="favorite" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Efectividad de las Vacunas</div>
          <apexchart type="line" :options="efectividadVacunasChartOptions" :series="efectividadVacunasChartSeries" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import VueApexCharts from 'vue3-apexcharts';
import { api } from "boot/axios";

// Registrar ApexCharts como componente
const ApexCharts = VueApexCharts;

// Variables para almacenar los datos de las tarjetas
const totalMascotas = ref(0);
const totalVacunadas = ref(0);
const totalNoVacunadas = ref(0);
const totalCampanas = ref(0);
const totalPropietarios = ref(0);

// Variables para las series de datos de los gráficos
const vacunasPorZonaChartSeries = ref([]);
const vacunasProgresoChartSeries = ref([]);
const vacunasMesChartSeries = ref([]);
const vacunasEvolucionChartSeries = ref([]);
const participacionCampanasChartSeries = ref([]);
const efectividadVacunasChartSeries = ref([]);

// Opciones iniciales de ApexCharts para cada gráfico
const vacunasPorZonaChartOptions = ref({
  chart: { type: 'donut', foreColor: '#fff' },
  labels: ['Zona Norte', 'Zona Sur', 'Zona Este', 'Zona Oeste'],
  colors: ['#FF4560', '#00E396', '#008FFB', '#FEB019'],
  legend: { position: 'bottom', labels: { colors: ['#fff'] } }
});

const vacunasProgresoChartOptions = ref({
  chart: { type: 'donut', foreColor: '#fff' },
  labels: ['Completado', 'Pendiente'],
  colors: ['#00E396', '#FF4560'],
  legend: { position: 'bottom', labels: { colors: ['#fff'] } }
});

const vacunasMesChartOptions = ref({
  chart: { type: 'bar', foreColor: '#fff' },
  xaxis: { categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'], labels: { style: { colors: ['#fff'] } } },
  yaxis: { labels: { style: { colors: ['#fff'] } } },
  colors: ['#008FFB'],
  legend: { labels: { colors: ['#fff'] } }
});

const vacunasEvolucionChartOptions = ref({
  chart: { type: 'line', foreColor: '#fff' },
  xaxis: { categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'], labels: { style: { colors: ['#fff'] } } },
  yaxis: { labels: { style: { colors: ['#fff'] } } },
  colors: ['#00E396'],
  legend: { labels: { colors: ['#fff'] } }
});

const participacionCampanasChartOptions = ref({
  chart: { type: 'bar', foreColor: '#fff' },
  xaxis: { categories: ['Campaña 1', 'Campaña 2', 'Campaña 3'], labels: { style: { colors: ['#fff'] } } },
  yaxis: { labels: { style: { colors: ['#fff'] } } },
  colors: ['#FEB019'],
  legend: { labels: { colors: ['#fff'] } }
});

const efectividadVacunasChartOptions = ref({
  chart: { type: 'line', foreColor: '#fff' },
  xaxis: { categories: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio'], labels: { style: { colors: ['#fff'] } } },
  yaxis: { labels: { style: { colors: ['#fff'] } } },
  colors: ['#FF4560'],
  legend: { labels: { colors: ['#fff'] } }
});

// Función para obtener los datos del backend
const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard-data');  // Cambia la URL si es necesario
    const data = response.data;
    /* const participacionResponse = await api.post('/participacions', participacionData); */
    // Actualizar datos de las tarjetas
    totalMascotas.value = data.totalMascotas;
    totalVacunadas.value = data.totalVacunadas;
    totalNoVacunadas.value = data.totalNoVacunadas;
    totalCampanas.value = data.totalCampanas;
    totalPropietarios.value = data.totalPropietarios;

    // Actualizar datos de los gráficos
    vacunasPorZonaChartSeries.value = data.vacunasPorZona;
    vacunasProgresoChartSeries.value = data.vacunasProgreso;
    vacunasMesChartSeries.value = [{ name: 'Vacunaciones', data: data.vacunacionesPorMes }];
    vacunasEvolucionChartSeries.value = [{ name: 'Vacunaciones Totales', data: data.evolucionVacunacion }];
    participacionCampanasChartSeries.value = [{ name: 'Participación', data: data.participacionCampanas }];
    efectividadVacunasChartSeries.value = [{ name: 'Efectividad', data: data.efectividadVacunas }];
  } catch (error) {
    console.error('Error obteniendo los datos del dashboard:', error);
  }
};

// Ejecutar la función cuando el componente se monte
onMounted(fetchDashboardData);
</script>

<style scoped>
.q-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.q-page {
  background-color: #19224F;
  padding-left: 20px;
}

.q-icon {
  color: white;
}

.q-card-section {
  padding: 20px;
}

.text-white {
  color: white;
}

.q-mx-md {
  margin-left: 10px;
  margin-right: 10px;
}
</style>

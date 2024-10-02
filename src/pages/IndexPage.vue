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
      <!-- Gráfico 1: Distribución de Mascotas por Especie -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="pets" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Distribución de Mascotas por Especie</div>
          <ApexChartComponent type="donut" :options="mascotasPorEspecieChartOptions"
            :series="mascotasPorEspecieChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Gráfico 2: Perros por Raza -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="pets" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Perros Registrados por Raza</div>
          <ApexChartComponent type="bar" :options="perrosPorRazaChartOptions" :series="perrosPorRazaChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Gráfico 3: Gatos por Raza (Rosquilla) -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="bar_chart" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Gatos Registrados por Raza</div>
          <ApexChartComponent type="donut" :options="gatosPorRazaChartOptions" :series="gatosPorRazaChartSeries" />
        </q-card-section>
      </q-card>
      <!-- Gráfico 6: Control de Mascotas Vacunadas y No Vacunadas -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="vaccines" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Control de Mascotas Vacunadas y No Vacunadas</div>
          <ApexChartComponent type="pie" :options="mascotasVacunadasChartOptions"
            :series="mascotasVacunadasChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Gráfico 7: Perros Vacunados y No Vacunados -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="pets" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Perros Vacunados y No Vacunados</div>
          <ApexChartComponent type="pie" :options="perrosVacunadosChartOptions" :series="perrosVacunadosChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Gráfico 8: Gatos Vacunados y No Vacunados -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="pets" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Gatos Vacunados y No Vacunados</div>
          <ApexChartComponent type="pie" :options="gatosVacunadosChartOptions" :series="gatosVacunadosChartSeries" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Segunda fila de gráficos -->
    <div class="row justify-center q-col-gutter-md q-mb-md q-mt-md">
      <!-- Gráfico 4: Brigadas Asignadas por Zona -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="trending_up" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Brigadas Asignadas por Zona</div>
          <ApexChartComponent type="bar" :options="brigadasPorZonaChartOptions" :series="brigadasPorZonaChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Gráfico 5: Relación entre Mascotas y Propietarios -->
      <q-card class="col-12 col-md-3 q-mb-md q-mx-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="group" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Relación Mascotas y Propietarios</div>
          <ApexChartComponent type="bar" :options="mascotasPropietariosChartOptions"
            :series="mascotasPropietariosChartSeries" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from 'boot/axios';


// Variables para almacenar los datos de las tarjetas
const totalMascotas = ref(0);
const totalVacunadas = ref(0);
const totalNoVacunadas = ref(0);
const totalCampanas = ref(0);
const totalPropietarios = ref(0);

// Variables para las series de datos de los gráficos
const mascotasPorEspecieChartSeries = ref([]);
const perrosPorRazaChartSeries = ref([]);
const gatosPorRazaChartSeries = ref([]);
const brigadasPorZonaChartSeries = ref([]);
const mascotasPropietariosChartSeries = ref([]);

// Opciones de los gráficos
const mascotasPorEspecieChartOptions = ref({
  chart: { type: 'donut', foreColor: '#fff' },
  labels: [],
  colors: ['#FF4560', '#00E396', '#008FFB', '#FEB019'],
  legend: { position: 'bottom', labels: { colors: ['#fff'] } }
});

const perrosPorRazaChartOptions = ref({
  chart: { type: 'bar', foreColor: '#fff' },
  xaxis: { categories: [], labels: { style: { colors: ['#fff'] } } },
  yaxis: { labels: { style: { colors: ['#fff'] } } }
});

const gatosPorRazaChartOptions = ref({
  chart: { type: 'donut', foreColor: '#fff' },
  labels: [],
  legend: { position: 'bottom', labels: { colors: ['#fff'] } }
});

const mascotasPropietariosChartOptions = ref({
  chart: { type: 'bar', foreColor: '#fff' },
  xaxis: { categories: ['Mascotas Registradas', 'Propietarios Registrados'], labels: { style: { colors: ['#fff'] } } },
  yaxis: { labels: { style: { colors: ['#fff'] } } }
});
const mascotasVacunadasChartSeries = ref([]);
const mascotasVacunadasChartOptions = ref({
  chart: { type: 'pie', foreColor: '#fff' },
  labels: ['Vacunadas', 'No Vacunadas'],
  legend: { position: 'bottom', labels: { colors: ['#fff'] } }
});

const perrosVacunadosChartSeries = ref([]);
const perrosVacunadosChartOptions = ref({
  chart: { type: 'pie', foreColor: '#fff' },
  labels: ['Vacunados', 'No Vacunados'],
  legend: { position: 'bottom', labels: { colors: ['#fff'] } }
});
const brigadasPorZonaChartOptions = ref({
  chart: {
    type: 'bar',
    foreColor: '#fff'
  },
  plotOptions: {
    bar: {
      horizontal: true // Cambiar el gráfico a orientación horizontal
    }
  },
  xaxis: {
    categories: [],  // Las categorías (zonas) se agregarán aquí
    labels: { style: { colors: ['#fff'] } }
  },
  yaxis: {
    labels: { style: { colors: ['#fff'] } }
  }
});
const gatosVacunadosChartSeries = ref([]);
const gatosVacunadosChartOptions = ref({
  chart: { type: 'pie', foreColor: '#fff' },
  labels: ['Vacunados', 'No Vacunados'],
  legend: { position: 'bottom', labels: { colors: ['#fff'] } }
});
// Función para obtener los datos del backend
const fetchDashboardData = async () => {
  try {
    const response = await api.get('/dashboard-data');
    const data = response.data;

    // Actualizar datos de las tarjetas
    totalMascotas.value = data.totalMascotas;
    totalVacunadas.value = data.totalVacunadas;
    totalNoVacunadas.value = data.totalNoVacunadas;
    totalCampanas.value = data.totalCampanas;
    totalPropietarios.value = data.totalPropietarios;
    totalMascotas.value = data.mascotasRegistradas;
    totalVacunadas.value = data.mascotasVacunadasYNo.vacunadas;
    totalNoVacunadas.value = data.mascotasVacunadasYNo.no_vacunadas;
    // Actualizar gráficos
    mascotasPorEspecieChartSeries.value = Object.values(data.mascotasPorEspecie);
    mascotasPorEspecieChartOptions.value.labels = Object.keys(data.mascotasPorEspecie);
    mascotasPorEspecieChartSeries.value = Object.values(data.mascotasPorEspecie);
    mascotasPorEspecieChartOptions.value.labels = Object.keys(data.mascotasPorEspecie);
    perrosPorRazaChartSeries.value = [
      {
        name: 'Perros',
        data: Object.values(data.perrosPorRaza)
      }
    ];
    perrosPorRazaChartOptions.value.xaxis.categories = Object.keys(data.perrosPorRaza);

    gatosPorRazaChartSeries.value = Object.values(data.gatosPorRaza);
    gatosPorRazaChartOptions.value.labels = Object.keys(data.gatosPorRaza);

    brigadasPorZonaChartSeries.value = [{ name: 'Brigadas', data: Object.values(data.brigadasPorZona) }];
    brigadasPorZonaChartOptions.value.xaxis.categories = Object.keys(data.brigadasPorZona);
    mascotasVacunadasChartSeries.value = [data.mascotasVacunadasYNo.vacunadas, data.mascotasVacunadasYNo.no_vacunadas];
    perrosVacunadosChartSeries.value = [data.perrosVacunadosYNo.vacunados, data.perrosVacunadosYNo.no_vacunados];
    gatosVacunadosChartSeries.value = [data.gatosVacunadosYNo.vacunados, data.gatosVacunadosYNo.no_vacunados];
    mascotasPropietariosChartSeries.value = [{ name: 'Relación', data: [data.mascotasRegistradas, data.propietariosRegistrados] }];

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

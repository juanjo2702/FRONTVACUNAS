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


    <!-- Fila para Perros por Raza y Gatos por Raza -->
    <div class="row justify-center q-col-gutter-sm q-mb-md" style="margin-bottom: 1.5rem;">
      <!-- Perros Registrados por Raza -->
      <q-card class="col-12 col-md-5 q-mb-md" style="background-color: #24395D; margin-right: 0.5rem;">
        <q-card-section>
          <q-icon name="pets" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Perros Registrados por Raza</div>
          <ApexChartComponent type="treemap" :options="perrosPorRazaChartOptions"
            :series="[{ data: perrosPorRazaChartSeries }]" />
        </q-card-section>
      </q-card>

      <!-- Gatos Registrados por Raza -->
      <q-card class="col-12 col-md-5 q-mb-md" style="background-color: #24395D; margin-left: 0.5rem;">
        <q-card-section>
          <q-icon name="bar_chart" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Gatos Registrados por Raza</div>
          <ApexChartComponent type="treemap" :options="gatosPorRazaChartOptions"
            :series="[{ data: gatosPorRazaChartSeries }]" />
        </q-card-section>
      </q-card>
    </div>

    <!-- Fila de gráficos (Distribución y Control de Vacunación) -->
    <div class="row justify-center q-col-gutter-md q-mb-md q-mt-md">
      <!-- Distribución de Mascotas por Especie -->
      <q-card class="col-12 col-md-3 q-mb-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="pets" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Distribución de Mascotas por Especie</div>
          <ApexChartComponent type="donut" :options="mascotasPorEspecieChartOptions"
            :series="mascotasPorEspecieChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Control de Mascotas Vacunadas y No Vacunadas -->
      <q-card class="col-12 col-md-3 q-mb-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="vaccines" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Control de Mascotas Vacunadas y No Vacunadas</div>
          <ApexChartComponent type="pie" :options="mascotasVacunadasChartOptions"
            :series="mascotasVacunadasChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Perros Vacunados y No Vacunados -->
      <q-card class="col-12 col-md-3 q-mb-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="pets" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Perros Vacunados y No Vacunados</div>
          <ApexChartComponent type="pie" :options="perrosVacunadosChartOptions" :series="perrosVacunadosChartSeries" />
        </q-card-section>
      </q-card>

      <!-- Gatos Vacunados y No Vacunados -->
      <q-card class="col-12 col-md-3 q-mb-md" style="background-color: #24395D;">
        <q-card-section>
          <q-icon name="pets" size="30px" class="q-mb-md" style="color: white;" />
          <div class="text-h6 text-white q-mb-md">Gatos Vacunados y No Vacunados</div>
          <ApexChartComponent type="pie" :options="gatosVacunadosChartOptions" :series="gatosVacunadosChartSeries" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { api, storage, customAxios } from 'boot/axios';


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
  chart: {
    type: 'donut',
    foreColor: '#fff',
    height: 300 // Limita la altura del gráfico a 300px
  },
  labels: [],
  colors: ['#FF4560', '#00E396', '#008FFB', '#FEB019'],
  legend: {
    position: 'bottom',
    labels: { colors: ['#fff'] }
  },
  plotOptions: {
    pie: {
      donut: {
        size: '65%' // Ajusta el tamaño interno del anillo para que sea más pequeño
      }
    }
  },
  responsive: [{
    breakpoint: 768,
    options: {
      chart: {
        height: 250 // Ajusta la altura para pantallas más pequeñas
      }
    }
  }]
});


const perrosPorRazaChartOptions = ref({
  chart: {
    type: 'treemap',
    foreColor: '#fff'
  },

  legend: {
    show: false
  },
  plotOptions: {
    treemap: {
      distributed: true,
      enableShades: false
    }
  },
  colors: ['#FF4560', '#00E396', '#008FFB', '#FEB019', '#FF66B2']
});

const gatosPorRazaChartOptions = ref({
  chart: {
    type: 'treemap',
    foreColor: '#fff'
  },

  legend: {
    show: false
  },
  plotOptions: {
    treemap: {
      distributed: true,
      enableShades: false
    }
  },
  colors: ['#FF4560', '#00E396', '#008FFB', '#FEB019', '#FF66B2']
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

    // Actualizar tarjetas de resumen
    totalMascotas.value = data.totalMascotas;
    totalVacunadas.value = data.totalVacunadas;
    totalNoVacunadas.value = data.totalNoVacunadas;
    totalCampanas.value = data.totalCampanas;
    totalPropietarios.value = data.totalPropietarios;

    // Actualizar gráfico de Donut: "Distribución de Mascotas por Especie"
    mascotasPorEspecieChartSeries.value = Object.values(data.mascotasPorEspecie);
    mascotasPorEspecieChartOptions.value = {
      ...mascotasPorEspecieChartOptions.value,
      labels: Object.keys(data.mascotasPorEspecie) // Las especies
    };

    // Configuración para el gráfico TreeMap: "Perros Registrados por Raza"
    perrosPorRazaChartSeries.value = Object.keys(data.perrosPorRaza).map((raza) => ({
      x: raza,
      y: data.perrosPorRaza[raza]
    }));
    perrosPorRazaChartOptions.value = {
      chart: { type: 'treemap', foreColor: '#fff', height: 350 },
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: true,
          shadeIntensity: 0.5
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff']
        },
        formatter: function (val, opt) {
          return `${opt.w.globals.labels[opt.dataPointIndex]}: ${val}`; // Muestra la raza y cantidad
        }
      },
      colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0'] // Colores para cada cuadro
    };

    // Configuración para el gráfico TreeMap: "Gatos Registrados por Raza"
    gatosPorRazaChartSeries.value = Object.keys(data.gatosPorRaza).map((raza) => ({
      x: raza,
      y: data.gatosPorRaza[raza]
    }));
    gatosPorRazaChartOptions.value = {
      chart: { type: 'treemap', foreColor: '#fff', height: 350 },
      plotOptions: {
        treemap: {
          distributed: true,
          enableShades: true,
          shadeIntensity: 0.5
        }
      },
      dataLabels: {
        enabled: true,
        style: {
          colors: ['#fff']
        },
        formatter: function (val, opt) {
          return `${opt.w.globals.labels[opt.dataPointIndex]}: ${val}`; // Muestra la raza y cantidad
        }
      },
      colors: ['#FF4560', '#FEB019', '#775DD0', '#008FFB', '#00E396'] // Colores para cada cuadro
    };

    // Actualizar gráfico de Pie: "Mascotas Vacunadas y No Vacunadas"
    mascotasVacunadasChartSeries.value = [
      data.mascotasVacunadasYNo.vacunadas,
      data.mascotasVacunadasYNo.no_vacunadas
    ];

    // Actualizar gráfico de Pie: "Perros Vacunados y No Vacunados"
    perrosVacunadosChartSeries.value = [
      data.perrosVacunadosYNo.vacunados,
      data.perrosVacunadosYNo.no_vacunados
    ];

    // Actualizar gráfico de Pie: "Gatos Vacunados y No Vacunados"
    gatosVacunadosChartSeries.value = [
      data.gatosVacunadosYNo.vacunados,
      data.gatosVacunadosYNo.no_vacunados
    ];

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

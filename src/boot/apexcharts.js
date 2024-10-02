import { boot } from 'quasar/wrappers';
import VueApexCharts from 'vue3-apexcharts';

export default boot(({ app }) => {
  // Registra el componente 'ApexChartComponent' globalmente
  app.component('ApexChartComponent', VueApexCharts);
});

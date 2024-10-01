import { boot } from 'quasar/wrappers';
import VueApexCharts from 'vue3-apexcharts';

export default boot(({ app }) => {
  app.component('ApexChartComponent', VueApexCharts); // Cambiar a nombre multi-palabra
});

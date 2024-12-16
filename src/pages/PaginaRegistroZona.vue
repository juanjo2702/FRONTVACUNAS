<template>
  <q-page class="q-pa-md">
    <section>
      <q-card>
        <q-card-section>
          <q-form @submit.prevent class="q-gutter-md">
            <div class="row q-col-gutter-md">
              <!-- Select de Departamento -->
              <div class="col-xs-12 col-sm-6">
                <q-select v-model="selectedDepartamento" :options="departamentos" label="Seleccionar Departamento"
                  outlined @update:model-value="fetchRedes" emit-value map-options />
              </div>

              <!-- Select de Red -->
              <div class="col-xs-12 col-sm-6">
                <q-select v-model="selectedRed" :options="redes" label="Seleccionar Red" outlined
                  @update:model-value="fetchMunicipios" emit-value map-options :disable="!selectedDepartamento" />
              </div>

              <!-- Select de Municipio -->
              <div class="col-xs-12 col-sm-6">
                <q-select v-model="selectedMunicipio" :options="municipios" label="Seleccionar Municipio" outlined
                  @update:model-value="fetchZonas" emit-value map-options :disable="!selectedRed" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </section>

    <!-- Tabla dinámica de zonas -->
    <section class="q-mt-md">
      <q-table title="Lista de Zonas" :rows="zonas" :columns="columns" row-key="id" flat bordered />
    </section>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { api } from "boot/axios";

// Variables para selects dinámicos
const departamentos = ref([]);
const redes = ref([]);
const municipios = ref([]);
const zonas = ref([]);

// Variables reactivas
const selectedDepartamento = ref(null);
const selectedRed = ref(null);
const selectedMunicipio = ref(null);

// Columnas de la tabla
const columns = [
  { name: "centro", label: "Centro", align: "left", field: "centro" },
];

// Fetch inicial para obtener departamentos
const fetchDepartamentos = async () => {
  try {
    const response = await api.get("/departamentos");
    departamentos.value = response.data.map((dep) => ({
      label: dep.nombre,
      value: dep.id,
    }));
  } catch (error) {
  }
};

// Fetch redes por departamento
const fetchRedes = async () => {
  selectedRed.value = null;
  selectedMunicipio.value = null;
  zonas.value = [];
  try {
    const response = await api.get(`/redes?departamento_id=${selectedDepartamento.value}`);
    redes.value = response.data.map((red) => ({
      label: red.nombre,
      value: red.id,
    }));
  } catch (error) {
  }
};

// Fetch municipios por red
const fetchMunicipios = async () => {
  selectedMunicipio.value = null;
  zonas.value = [];
  try {
    const response = await api.get(`/municipios?red_id=${selectedRed.value}`);
    municipios.value = response.data.map((mun) => ({
      label: mun.nombre,
      value: mun.id,
    }));
  } catch (error) {
  }
};

// Fetch zonas por municipio
const fetchZonas = async () => {
  zonas.value = [];
  try {
    const response = await api.get(`/zonas?municipio_id=${selectedMunicipio.value}`);
    zonas.value = response.data;
  } catch (error) {
  }
};

// Cargar departamentos al montar la página
fetchDepartamentos();
</script>

<style scoped>
.q-mt-md {
  margin-top: 20px;
}
</style>

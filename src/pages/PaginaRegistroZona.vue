<template>
  <q-page class="q-pa-md">
    <section class="formulario">
      <q-card>
        <q-card-section>
          <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md">
            <div class="row q-col-gutter-md q-mb-md q-pl-md">
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input filled v-model="zonaData.nombre" label="Nombre *" hint="Nombre" lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'El nombre es obligatorio']"
                  style="text-transform: uppercase;" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input filled v-model="zonaData.centro" label="Centro*" hint="Centro" lazy-rules
                  :rules="[(val) => (val && val.length > 0) || 'El centro es obligatorio']"
                  style="text-transform: uppercase;" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input filled v-model="zonaData.ciudad" label="Ciudad" hint="Ciudad"
                  style="text-transform: uppercase;" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-select filled v-model="zonaData.departamento" label="Departamento *" hint="Departamento" lazy-rules
                  :options="departamentos"
                  :rules="[(val) => (val && val.length > 0) || 'El departamento es obligatorio']" />
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-section>
          <div>
            <q-btn v-if="isEditing" label="Guardar Cambios" color="primary" @click="updateZona" />
            <q-btn v-else label="Registrar" color="primary" @click="onSubmit" />

            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" @click="onReset" />

          </div>
        </q-card-section>
      </q-card>
    </section>

    <q-page class="q-pa-md">
      <!-- Campo de búsqueda con icono de lupa -->
      <div class="search-container">
        <q-input borderless dense debounce="300" v-model="filter" label="Buscar por Nombre, Centro o Ciudad..." outlined
          style="text-transform: uppercase;">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>

      <!-- Tabla de zonas -->
      <q-table title="Lista de Zonas" :rows="filteredZonas" :columns="columns" row-key="id"
        :rows-per-page-options="[5, 10, 15]" flat bordered>
        <template v-slot:body-cell-acciones="props">
          <q-td align="center">
            <q-btn dense flat round color="primary" icon="edit" @click="editRow(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-page>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();
const zonas = ref([]);
const filter = ref("");

// Columnas de la tabla
const columns = [
  { name: "nombre", label: "Nombre", align: "left", field: "nombre" },
  { name: "centro", label: "Centro", align: "left", field: "centro" },
  { name: "ciudad", label: "Ciudad", align: "left", field: "ciudad" },
  { name: "departamento", label: "Departamento", align: "left", field: "departamento" },
  { name: "acciones", label: "Editar", align: "center" }
];

// Filtrado de zonas según la búsqueda
const filteredZonas = computed(() => {
  const searchTerm = filter.value.toLowerCase();
  if (!searchTerm) {
    return zonas.value;
  }
  return zonas.value.filter((zona) =>
    zona.nombre.toLowerCase().includes(searchTerm) ||
    zona.centro.toLowerCase().includes(searchTerm) ||
    zona.ciudad.toLowerCase().includes(searchTerm)
  );
});

// Obtener las zonas desde la API
const fetchZonas = async () => {
  try {
    const response = await api.get("/zonas");
    zonas.value = response.data;
  } catch (error) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "error",
      message: "Error al obtener la lista de zonas.",
    });
    console.error("Error al obtener zonas:", error);
  }
};


// Definir la estructura de datos para la zona
const zonaData = ref({
  nombre: '',
  centro: '',
  ciudad: '',
  departamento: ''
});

// Lista de departamentos
const departamentos = [
  'LA PAZ',
  'COCHABAMBA',
  'SANTA CRUZ',
  'ORURO',
  'POTOSÍ',
  'CHUQUISACA',
  'TARIJA',
  'BENI',
  'PANDO'
];

// Función para enviar los datos a la API
const onSubmit = async () => {
  if (!zonaData.value.nombre || !zonaData.value.centro || !zonaData.value.departamento) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Por favor, complete los campos obligatorios.'
    });
    return;
  }

  try {
    const response = await api.post('/zonas', zonaData.value); // Se envían los datos a la API
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Zona registrada con éxito.'
    });
    fetchZonas();
    onReset(); // Limpiar el formulario después de enviar
  } catch (error) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Error al registrar la zona.'
    });
    console.error('Error al registrar zona:', error);
  }
};

const onReset = () => {
  zonaData.value = {
    nombre: '',
    centro: '',
    ciudad: '',
    departamento: '',
  };
  isEditing.value = false; // Asegurarse de salir del modo edición
};


onMounted(() => {
  fetchZonas();
});



const editRow = (row) => {
  zonaData.value = { ...row }; // Cargar los datos de la fila seleccionada
  isEditing.value = true; // Activar modo edición
};

const isEditing = ref(false); // Modo edición desactivado por defecto

const updateZona = async () => {
  if (!zonaData.value.nombre || !zonaData.value.centro || !zonaData.value.departamento) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Por favor, complete los campos obligatorios.',
    });
    return;
  }

  try {
    await api.put(`/zonas/${zonaData.value.id}`, zonaData.value); // Realizar la solicitud de actualización
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Zona actualizada con éxito.',
    });
    fetchZonas(); // Actualizar la lista de zonas
    onReset(); // Restablecer el formulario
  } catch (error) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Error al actualizar la zona.',
    });
    console.error('Error al actualizar zona:', error);
  }
};

</script>

<style scoped>
.search-container {
  max-width: 400px;
  /* Ajusta este valor según el ancho deseado */
  margin-bottom: 20px;
  /* Espacio entre la búsqueda y la tabla */
}
</style>

<template>
  <q-card-section>
    <q-form @submit.prevent="submitFormMascota">
      <!-- Fila 1: Nombre del propietario ocupando toda la fila -->
      <div class="q-row q-col-gutter-md">
        <!-- Mostramos el nombre del propietario recibido como prop -->
        <q-input filled :value="`${propietario.persona.nombres} ${propietario.persona.apellidos}`" label="Propietario"
          readonly />
      </div>

      <!-- Fila 2: Nombre Mascota y Género -->
      <div class="q-row q-col-gutter-md">
        <q-input class="q-col-12 q-md-6" filled v-model="mascotaData.nombre" label="Nombre Mascota" lazy-rules
          required />
        <q-select class="q-col-12 q-md-6" filled v-model="mascotaData.genero" :options="['Macho', 'Hembra']"
          label="Género" />
      </div>

      <!-- Fila 3: Especie y Raza -->
      <div class="q-row q-col-gutter-md">
        <q-select class="q-col-12 q-md-6" filled v-model="mascotaData.especie" :options="['Perro', 'Gato']"
          label="Especie" @update:model-value="onEspecieChange" lazy-rules required />
        <q-select class="q-col-12 q-md-6" filled v-model="mascotaData.raza_id" use-input input-debounce="0" label="Raza"
          :options="filteredRazas" option-value="id" option-label="nombre" clearable hint="Seleccione una Raza"
          lazy-rules required />
      </div>

      <!-- Fila 4: Color y Edad -->
      <div class="q-row q-col-gutter-md">
        <q-input class="q-col-12 q-md-6" filled v-model="mascotaData.color" label="Color" />
        <q-input class="q-col-12 q-md-6" filled v-model="mascotaData.rangoEdad" label="Edad (0-20 años)" type="number"
          :rules="[(val) => val >= 0 && val <= 20 || 'La edad debe estar entre 0 y 20 años']" lazy-rules required
          min="0" max="20" />
      </div>

      <!-- Fila 5: Tamaño y Descripción -->
      <div class="q-row q-col-gutter-md">
        <q-select class="q-col-12 q-md-6" filled v-model="mascotaData.tamanio"
          :options="['Pequeño', 'Mediano', 'Grande']" label="Tamaño (Pequeño, Mediano, Grande)" lazy-rules required />
        <q-input class="q-col-12 q-md-6" filled v-model="mascotaData.descripcion" label="Descripción" type="textarea" />
      </div>

      <!-- Fila 6: Subir Imagen Frontal y Lateral -->
      <div class="q-row q-col-gutter-md">
        <div class="q-col-12 q-md-6">
          <label for="fotoFrontal">Subir Imagen Frontal</label>
          <input type="file" class="dropify" id="fotoFrontal" accept="image/*;capture=camera" />
        </div>

        <div class="q-col-12 q-md-6">
          <label for="fotoLateral">Subir Imagen Lateral</label>
          <input type="file" class="dropify" id="fotoLateral" accept="image/*;capture=camera" />
        </div>
      </div>

      <!-- Fila 7: Botones de acción -->
      <div class="q-row q-col-gutter-md justify-evenly q-mt-md">
        <q-btn label="Registrar y Finalizar" color="primary" @click="submitAndClose" />
        <q-btn label="Guardar y Registrar Siguiente Mascota" color="green" @click="submitAndContinue" />
      </div>
    </q-form>
  </q-card-section>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import $ from 'jquery';
import 'dropify/dist/css/dropify.min.css';
import 'dropify/dist/js/dropify.min.js';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

const props = defineProps({
  propietario: {
    type: Object,
    required: true
  }
});

watch(() => props.propietario, (newValue) => {
  console.log("Propietario recibido en MascotaForm:", newValue);
});
const $q = useQuasar();
const mascotaData = ref({
  propietario: '',
  propietario_id: null,
  nombre: '',
  genero: '',
  especie: '',
  color: '',
  rangoEdad: '',
  tamanio: '',
  raza_id: '',
  descripcion: ''
});

const razas = ref([]);
const filteredRazas = ref([]);

// Inicializar Dropify
nextTick(() => {
  $('.dropify').dropify();
});

// Filtrar razas según la especie seleccionada
const fetchRazas = async (tipo) => {
  try {
    const response = await api.get(`/razas?tipo=${tipo}`);
    razas.value = response.data;
    filteredRazas.value = razas.value;
  } catch (error) {
    console.error("Error al cargar las razas:", error);
  }
};

const onEspecieChange = (especie) => {
  if (!especie) {
    filteredRazas.value = [];
    return;
  }
  const tipo = especie === 'Perro' ? 0 : 1;  // 0 para perros, 1 para gatos
  fetchRazas(tipo);
};

const submitAndClose = async () => {
  await submitFormMascota(true);
};

const submitAndContinue = async () => {
  await submitFormMascota(false);
};

// Función para registrar la mascota
const submitFormMascota = async (closeModal = true) => {
  try {
    const formData = new FormData();
    formData.append('nombre', mascotaData.value.nombre);
    formData.append('genero', mascotaData.value.genero);
    formData.append('especie', mascotaData.value.especie);
    formData.append('color', mascotaData.value.color);
    formData.append('tamanio', mascotaData.value.tamanio);
    formData.append('raza_id', mascotaData.value.raza_id);
    formData.append('descripcion', mascotaData.value.descripcion);
    formData.append('propietario_id', props.propietarioId);

    // Capturamos las imágenes si existen
    const frontalImage = document.getElementById('fotoFrontal').files[0];
    const lateralImage = document.getElementById('fotoLateral').files[0];

    if (frontalImage) formData.append('fotoFrontal', frontalImage);
    if (lateralImage) formData.append('fotoLateral', lateralImage);

    await api.post('/mascotas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    $q.notify({
      type: 'positive',
      message: 'Mascota registrada correctamente',
      position: 'top',
      timeout: 3000
    });

    if (closeModal) {
      emit('close');
    }
  } catch (error) {
    console.error('Error al registrar mascota:', error);
    $q.notify({
      type: 'negative',
      message: 'Hubo un error al registrar la mascota',
      position: 'top',
      timeout: 3000
    });
  }
};
</script>

<style scoped>
.dropify {
  margin-bottom: 20px;
}
</style>

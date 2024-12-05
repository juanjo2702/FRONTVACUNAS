<template>
  <q-card style="min-width: 80vw; max-height: 90vh;">
    <q-card-section>
      <div class="text-h6">REGISTRAR NUEVA PERSONA</div>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <q-form ref="form" @submit.prevent="submitFormPersona">
        <!-- Distribución de los campos en columnas -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-xs-12 col-sm-6">
            <q-input filled v-model="personaData.nombres" label="Nombres" :rules="[requiredRule]" lazy-rules required />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input filled v-model="personaData.apellidos" label="Apellidos" :rules="[requiredRule]" lazy-rules
              required />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-xs-12 col-sm-6">
            <q-input filled v-model="personaData.ci" label="CI" :rules="[requiredRule]" lazy-rules required />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input filled v-model="personaData.telefono" label="Celular" :rules="[requiredRule]" lazy-rules
              required />
          </div>
        </div>

        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-xs-12 col-sm-6">
            <q-input filled v-model="propietarioData.direccion" label="Dirección" :rules="[requiredRule]" lazy-rules
              required />
          </div>
          <div class="col-xs-12 col-sm-6">
            <q-input filled v-model="propietarioData.observaciones" label="Observaciones" type="textarea" />
          </div>
        </div>

        <!-- Subir imagen y mostrar la previsualización -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-xs-12 col-sm-6">
            <label for="foto">Subir Foto del Propietario</label>
            <input type="file" class="dropify" id="foto" accept="image/*;capture=camera" @change="onImageChange" />
          </div>
          <div class="col-xs-12 col-sm-6">
            <img v-if="imageUrl" :src="imageUrl" alt="Foto del propietario"
              style="max-width: 100%; max-height: 150px;" />
          </div>
        </div>

        <!-- Mapa -->
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-xs-12">
            <div id="map" style="height: 300px; width: 100%;"></div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="q-pa-md row justify-evenly">
          <q-btn label="Registrar" type="submit" color="primary" />
          <q-btn label="Resetear" type="reset" color="negative" @click="resetFormPersona" />
          <q-btn label="Cerrar" color="green" @click="$emit('close')" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'dropify/dist/css/dropify.min.css';
import 'dropify/dist/js/dropify.min.js';
import $ from 'jquery';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';

// Usamos Quasar Notify
const $q = useQuasar();

// Definir `emit` para emitir eventos hacia el componente padre
const emit = defineEmits(['person-registered', 'close']);

// Datos de la persona
const personaData = ref({
  nombres: '',
  apellidos: '',
  ci: '',
  telefono: ''
});

const propietarioData = ref({
  direccion: '',
  observaciones: '',
  latitud: '',
  longitud: '',
  foto: null
});

// Imagen de previsualización
const imageUrl = ref(null);

const requiredRule = (val) => !!val || 'Este campo es obligatorio';

// Método para cargar la imagen seleccionada
const onImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageUrl.value = URL.createObjectURL(file);
    propietarioData.value.foto = file;
  }
};

// Inicializar el mapa cuando se monte el componente
const initializeMap = () => {
  nextTick(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        propietarioData.value.latitud = latitude;
        propietarioData.value.longitud = longitude;

        const map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        L.marker([latitude, longitude]).addTo(map);
      });
    } else {
      $q.notify({
        type: 'warning',
        message: 'Geolocalización no soportada.',
        position: 'top',
        timeout: 3000
      });
    }
  });
};

onMounted(() => {
  initializeMap();

  // Inicializar Dropify para el input de imagen
  nextTick(() => {
    $('#foto').dropify();
  });
});

// Resetear el formulario
const resetFormPersona = () => {
  personaData.value = { nombres: '', apellidos: '', ci: '', telefono: '' };
  propietarioData.value = { direccion: '', observaciones: '', foto: null };
  imageUrl.value = null;
  $('#foto').dropify().data('dropify').resetPreview();  // Resetear el campo de la imagen
};

// Validación de campos vacíos
const isFormValid = () => {
  if (!personaData.value.nombres || !personaData.value.apellidos || !personaData.value.ci || !personaData.value.telefono) {
    $q.notify({
      type: 'negative',
      message: 'Todos los campos de la persona son obligatorios',
      position: 'top',
      timeout: 3000
    });
    return false;
  }
  return true;
};

// Manejar el envío del formulario
const submitFormPersona = async () => {
  if (!isFormValid()) {
    return;  // Evitar el envío si los datos están incompletos
  }

  try {
    // Crear un nuevo objeto FormData para enviar los datos de la persona
    const formDataPersona = new FormData();
    formDataPersona.append('nombres', personaData.value.nombres);
    formDataPersona.append('apellidos', personaData.value.apellidos);
    formDataPersona.append('ci', personaData.value.ci);
    formDataPersona.append('telefono', personaData.value.telefono);

    // Realizar la solicitud para registrar a la persona
    const personaResponse = await api.post('/personas', formDataPersona, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    // Verificar si la respuesta de la API contiene los datos esperados
    const personaId = personaResponse?.data?.persona?.id;
    if (!personaId) {
      throw new Error('No se recibió un ID de persona válido');
    }

    // Registrar el propietario asociado a esta persona
    propietarioData.value.persona_id = personaId;

    const formDataPropietario = new FormData();
    formDataPropietario.append('direccion', propietarioData.value.direccion);
    formDataPropietario.append('observaciones', propietarioData.value.observaciones);
    formDataPropietario.append('latitud', propietarioData.value.latitud);
    formDataPropietario.append('longitud', propietarioData.value.longitud);

    const fotoPropietario = document.getElementById('foto').files[0];
    if (fotoPropietario) {
      formDataPropietario.append('foto', fotoPropietario);
    }

    formDataPropietario.append('persona_id', personaId);

    const propietarioResponse = await api.post('/propietarios', formDataPropietario, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    $q.notify({
      type: 'positive',
      message: 'Persona y propietario registrados correctamente',
      position: 'top',
      timeout: 3000
    });

    // Emitir el evento 'person-registered' para abrir el modal de mascota
    emit('person-registered', propietarioResponse.data.propietario);

  } catch (error) {
    console.error('Error al registrar persona y propietario:', error);
    $q.notify({
      type: 'negative',
      message: 'Error al registrar persona y propietario',
      position: 'top',
      timeout: 3000
    });
  }
};

</script>
<style scoped>
#map {
  height: 300px;
  width: 100%;
}

.dropify {
  border: 2px dashed #00aaff;
}
</style>

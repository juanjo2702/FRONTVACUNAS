<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="q-card">
        <q-card-section>
          <div class="text-h6">REGISTRAR NUEVO MIEMBRO</div>
        </q-card-section>
        <q-separator />

        <!-- Formulario de Registro de Persona y Miembro -->
        <q-card-section>
          <q-form ref="form" @submit.prevent="submitForm">
            <!-- Datos de la Persona -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-6">
                <q-input filled v-model="personaData.nombres" label="Nombre" required />
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-input filled v-model="personaData.apellidos" label="Apellido" required />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-6">
                <q-input filled v-model="personaData.ci" label="CI" required />
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-input filled v-model="personaData.telefono" label="Teléfono" />
              </div>
            </div>

            <!-- Subir Imágenes (Anverso y Reverso del CI) -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-6">
                <label for="fotoAnverso">Anverso del CI</label>
                <input type="file" class="dropify" id="fotoAnverso" accept="image/*;capture=camera" />
              </div>
              <div class="col-xs-12 col-sm-6">
                <label for="fotoReverso">Reverso del CI</label>
                <input type="file" class="dropify" id="fotoReverso" accept="image/*;capture=camera" />
              </div>
            </div>

            <!-- Botones -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-6">
                <q-btn label="REGISTRAR" type="submit" color="primary" class="full-width" />
              </div>
              <div class="col-xs-12 col-sm-6">
                <q-btn label="RESET" type="reset" color="negative" class="full-width" @click="resetForm" />
              </div>
            </div>
          </q-form>
        </q-card-section>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { api } from "boot/axios";
import $ from 'jquery'; // Para Dropify
import Swal from 'sweetalert2';
import 'dropify/dist/css/dropify.min.css';
import 'dropify/dist/js/dropify.min.js';

// Datos de la persona y el miembro
const personaData = ref({
  nombres: '',
  apellidos: '',
  ci: '',
  telefono: ''
});

const miembroData = ref({
  persona_id: null, // Aquí se guardará el id de la persona registrada
  fotoAnverso: null,
  fotoReverso: null
});

// Inicializar Dropify
const initializeDropify = () => {
  setTimeout(() => {
    $('#fotoAnverso').dropify();
    $('#fotoReverso').dropify();
  }, 300);
};

// Resetear formulario
const resetForm = () => {
  personaData.value = {
    nombres: '',
    apellidos: '',
    ci: '',
    telefono: ''
  };

  $('#fotoAnverso').data('dropify').resetPreview();
  $('#fotoReverso').data('dropify').resetPreview();
};

// Función para registrar Persona y Miembro
const submitForm = async () => {
  try {
    // Log de los datos de la persona
    console.log("Datos de la persona a enviar:", personaData.value);

    // Registrar Persona
    const personaResponse = await api.post('/personas', personaData.value);

    // Verifica que el ID de la persona se obtiene correctamente
    const personaId = personaResponse.data.id || personaResponse.data.persona_id;

    if (!personaId) {
      throw new Error('No se pudo obtener el ID de la persona');
    }

    console.log("Persona registrada con éxito, ID:", personaId);

    // Asignar el ID de la persona al miembroData
    miembroData.value.persona_id = personaId;
    console.log("ID de persona asignado a miembroData:", miembroData.value.persona_id);

    // Registrar Miembro
    const formData = new FormData();
    formData.append('persona_id', miembroData.value.persona_id); // Usar el ID de la persona registrada

    // Capturar las imágenes
    const fotoAnverso = document.getElementById('fotoAnverso').files[0];
    const fotoReverso = document.getElementById('fotoReverso').files[0];

    if (fotoAnverso) {
      formData.append('fotoAnverso', fotoAnverso);
      console.log("Anverso del CI seleccionado:", fotoAnverso);
    }

    if (fotoReverso) {
      formData.append('fotoReverso', fotoReverso);
      console.log("Reverso del CI seleccionado:", fotoReverso);
    }

    // Log de los datos del miembro que se están enviando
    console.log("Datos del miembro a enviar (FormData):", formData);

    // Enviar al backend
    const miembroResponse = await api.post('/miembros', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // Verifica que el miembro se haya registrado correctamente
    const miembroId = miembroResponse.data.id;

    if (!miembroId) {
      throw new Error('No se pudo obtener el ID del miembro registrado');
    }

    console.log("Miembro registrado con éxito, ID:", miembroId);

    // Después de registrar el miembro, registrar la participación
    let brigadaUserId = localStorage.getItem('brigadaUserId');

    // Convertir brigadaUserId a número
    brigadaUserId = Number(brigadaUserId);

    if (isNaN(brigadaUserId)) {
      throw new Error('El brigadaUserId no es un número válido');
    }

    console.log('Brigada ID:', brigadaUserId);

    // Registrar la participación en la tabla participaciones
    const participacionData = {
      miembro_id: miembroId,  // Usar el ID correcto del miembro registrado
      brigada_id: brigadaUserId  // Asegurarse de que el brigada_id sea un número
    };

    // Asegúrate de que participacionData tiene los IDs correctos
    console.log('Datos de participación a enviar:', participacionData);

    const participacionResponse = await api.post('/participacions', participacionData);

    console.log("Participación registrada con éxito:", participacionResponse.data);

    // Mostrar mensaje de éxito
    Swal.fire('Éxito', 'Miembro y participación registrados correctamente', 'success');
    resetForm(); // Resetear el formulario
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta del servidor:', error.response.data);
    } else {
      console.error('Error en la solicitud:', error);
    }
    Swal.fire('Error', 'Hubo un problema al registrar el miembro: ' + error.message, 'error');
  }
};

// Montar el componente y inicializar Dropify
onMounted(() => {
  initializeDropify();
});
</script>

<style scoped>
.full-width {
  width: 100%;
}

.dropify-wrapper {
  width: 100%;
  height: 150px;
  border: 2px dashed #e0e0e0;
  border-radius: 5px;
  background: #f9f9f9;
  text-align: center;
}
</style>

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

        <q-separator />

        <!-- Buscar Persona por CI -->
        <q-card-section>
          <div class="text-h6">Buscar Persona por CI</div>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-xs-12 col-sm-8">
              <q-input filled v-model="searchCI" label="Ingresar CI" clearable maxlength="20" />
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-btn label="Buscar" icon="search" color="primary" class="full-width" @click="searchPerson" />
            </div>
          </div>

          <!-- Campo con el nombre de la persona encontrada -->
          <q-input v-if="selectedPerson" v-model="selectedPersonLabel" label="Persona encontrada" filled class="q-my-md"
            readonly />

          <!-- Botón para agregar si es miembro -->
          <q-btn v-if="selectedPerson && isMember" label="Agregar a Participaciones" color="positive" class="q-mt-sm"
            @click="assignPerson" />
          <!-- Mensaje si no hay resultados -->
          <div v-if="!isSearching && searchCI && !selectedPerson">
            <q-banner dense class="bg-grey-2 text-dark">
              <q-icon name="warning" />
              No se encontraron resultados para el CI ingresado.
            </q-banner>
          </div>

          <!-- Mensaje si la persona no pertenece a miembros -->
          <div v-if="selectedPerson && !isMember">
            <q-banner dense class="bg-warning text-dark">
              <q-icon name="error" />
              Esta persona no pertenece a la categoría de miembros.
            </q-banner>
          </div>

          <!-- Spinner de carga -->
          <q-spinner v-if="isSearching" size="lg" color="primary" />
        </q-card-section>

        <q-table :rows="participaciones" :columns="columns" row-key="id" flat bordered>
          <template v-slot:body-cell-nombres="props">
            <q-td>{{ props.row.miembro.persona.nombres }}</q-td>
          </template>
          <template v-slot:body-cell-apellidos="props">
            <q-td>{{ props.row.miembro.persona.apellidos }}</q-td>
          </template>
          <template v-slot:body-cell-ci="props">
            <q-td>{{ props.row.miembro.persona.ci }}</q-td>
          </template>
          <template v-slot:body-cell-telefono="props">
            <q-td>{{ props.row.miembro.persona.telefono }}</q-td>
          </template>
        </q-table>
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
const brigadaUserId = Number(localStorage.getItem('brigadaUserId')); // Obtener el ID de la brigada logueada

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

const columns = [
  { name: "id", label: "ID", align: "left", field: "id" },
  { name: "nombres", label: "Nombres", align: "left", field: row => row.miembro?.persona?.nombres || "" },
  { name: "apellidos", label: "Apellidos", align: "left", field: row => row.miembro?.persona?.apellidos || "" },
  { name: "ci", label: "CI", align: "left", field: row => row.miembro?.persona?.ci || "" },
  { name: "telefono", label: "Teléfono", align: "left", field: row => row.miembro?.persona?.telefono || "" },
];
// Estados para la búsqueda
const searchCI = ref(''); // CI ingresado por el usuario
const searchResult = ref(null); // Resultado de la búsqueda (persona encontrada)
const selectedPerson = ref(null); // Persona seleccionada para futuras acciones
const selectedPersonLabel = ref(""); // Nombre completo de la persona
const showAddButton = ref(false); // Estado para mostrar el botón "Agregar"
const showTable = ref(false); // Inicialmente, la tabla está oculta
const isMember = ref(false); // Indica si la persona pertenece a miembros
const isSearching = ref(false); // Estado de carga
const participaciones = ref([]); // Lista de participaciones

const fetchParticipaciones = async () => {
  try {
    const response = await api.get(`/participaciones/brigada/${brigadaUserId}`);
    participaciones.value = response.data.map(item => ({
      ...item,
      miembro: item.miembro || { persona: { nombres: "", apellidos: "", ci: "", telefono: "" } }, // Asegura que todos los datos existen
    }));
    console.log("Datos de participaciones procesados:", participaciones.value);
  } catch (error) {
    console.error("Error cargando participaciones:", error);
    Swal.fire("Error", "Hubo un problema al cargar las participaciones.", "error");
  }
};
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

const searchPerson = async () => {
  console.log("CI ingresado:", searchCI.value); // Verifica el CI ingresado

  try {
    const response = await api.post('/personas/buscar-por-ci', { ci: searchCI.value });
    console.log("Persona encontrada:", response.data); // Imprime el resultado del backend
  } catch (error) {
    console.error("Error buscando persona:", error.response?.data || error.message);
    Swal.fire("Error", error.response?.data?.error || "Error al buscar persona", "error");
  }
};


// Registrar participación
const assignPerson = async () => {
  if (!selectedPerson.value || !isMember.value) {
    Swal.fire("Atención", "No se puede registrar. La persona no pertenece a miembros.", "warning");
    return;
  }

  try {
    const miembroResponse = await api.get(`/miembros`, {
      params: { persona_id: selectedPerson.value.id },
    });

    const miembro = miembroResponse.data;

    const participacionData = {
      miembro_id: miembro.id,
      brigada_id: brigadaUserId,
    };

    await api.post(`/participacions`, participacionData);
    await fetchParticipaciones();

    Swal.fire("Éxito", "Se ha registrado correctamente la participación.", "success");
  } catch (error) {
    console.error("Error registrando participación:", error);
    Swal.fire("Error", "Hubo un problema al registrar la participación.", "error");
  }
};

const searchAndRegisterParticipation = async () => {
  try {
    // Paso 1: Buscar persona por CI
    const response = await api.get('/personas/buscar-por-ci', { params: { ci: searchCI.value } });
    const persona = response.data;

    // Paso 2: Verificar si es miembro
    const miembroResponse = await api.get('/miembros', { params: { persona_id: persona.id } });
    const miembro = miembroResponse.data;

    if (!miembro) {
      Swal.fire("Error", "Esta persona no está registrada como miembro.", "warning");
      return;
    }

    // Paso 3: Registrar participación
    const participacionResponse = await api.post('/participaciones/registrar', {
      miembro_id: miembro.id,
      brigada_id: brigadaUserId, // ID de la brigada
    });

    Swal.fire("Éxito", "Participación registrada con éxito.", "success");
    console.log("Participación:", participacionResponse.data);
  } catch (error) {
    console.error("Error:", error);
    Swal.fire("Error", "Hubo un problema con el registro.", "error");
  }
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
    await fetchParticipaciones();
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
  showTable.value = false;
  fetchParticipaciones(); // Ocultar la tabla al iniciar
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

.q-table .q-td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

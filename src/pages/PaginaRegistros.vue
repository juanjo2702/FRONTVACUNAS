<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Botón para abrir el modal -->
      <q-btn label="Registrar Nueva Persona" color="primary" @click="openModalPersona" />
      <div style="margin-top: 20px;"></div>

      <div class="q-my-md row">
        <div class="col">
          <q-input v-model="search" label="Buscar..." outlined>
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>
      <q-table title="Lista de Propietarios" :rows-per-page-options="[5, 10, 15]" :rows="filteredPersonas"
        :columns="columns" row-key="ci" flat bordered>
        <template v-slot:body-cell-registro="props">
          <q-td align="center">
            <q-btn flat icon="pets" color="teal" @click="openModalMascotas(props.row)" />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td align="center">
            <q-btn flat icon="edit" color="primary" @click="editPersona(props.row)" />
            <q-btn flat icon="delete" color="negative" @click="deletePersona(props.row)" />
          </q-td>
        </template>
      </q-table>
      <!-- Modal con el formulario de registro de Persona -->
      <q-dialog v-model="isModalPersonaOpen" persistent>
        <q-card style="min-width: 80vw; max-height: 90vh;">
          <q-card-section>
            <div class="text-h6">REGISTRAR NUEVA PERSONA</div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <q-form ref="form" @submit.prevent="submitFormPersona">
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="personaData.nombres" label="Nombres"
                    :rules="[(val) => !!val || 'El nombre es obligatorio']" lazy-rules required />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="personaData.apellidos" label="Apellidos"
                    :rules="[(val) => !!val || 'El apellido es obligatorio']" lazy-rules required />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="personaData.ci" label="CI"
                    :rules="[(val) => !!val || 'El CI es obligatorio']" lazy-rules required />
                </div>
              </div>

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="personaData.telefono" label="Celular"
                    :rules="[(val) => !!val || 'El teléfono es obligatorio']" lazy-rules required />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="propietarioData.direccion" label="Dirección"
                    :rules="[(val) => !!val || 'La dirección es obligatoria']" lazy-rules required />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="propietarioData.observaciones" label="Observaciones" type="textarea"
                    style="width: 100%; height: 100px;" />
                </div>
              </div>

              <div id="map" class="q-mt-md" style="height: 300px; width: 100%"></div>

              <div class="q-pa-md row justify-evenly">
                <q-btn label="Registrar" type="submit" color="primary" />
                <q-btn label="Resetear" type="reset" color="negative" />
              </div>
              <div class="q-pa-md row justify-evenly">
                <q-btn label="Cerrar" color="green" @click="closeModalPersona" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Modal para Registrar Nueva Mascota -->
      <q-dialog v-model="isModalMascotaOpen" persistent>
        <q-card style="min-width: 60vw; max-height: 90vh;">
          <q-card-section>
            <div class="text-h6">REGISTRAR NUEVA MASCOTA</div>
          </q-card-section>

          <q-separator></q-separator>

          <q-card-section>
            <q-form ref="formMascota" @submit.prevent="submitFormMascota">
              <!-- Campo ligado al dueño (nombre del propietario) -->
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="mascotaData.propietario" label="Propietario" readonly />
                </div>
              </div>

              <!-- Campos de la mascota -->
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="mascotaData.nombre" label="Nombre Mascota" lazy-rules required />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-select filled v-model="mascotaData.genero" :options="['Macho', 'Hembra']" label="Género" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-select filled v-model="mascotaData.especie" :options="['Perro', 'Gato']" label="Especie" lazy-rules
                    required />
                </div>
              </div>

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-select filled style="width: 100%; text-transform: uppercase" v-model="mascotaData.raza_id"
                    use-input input-debounce="0" label="Raza" :options="filteredRazas" @filter="filterRazas"
                    option-value="id" option-label="nombre" hint="Seleccione una Raza" lazy-rules
                    :rules="[(val) => !!val || 'Seleccione una Raza']">
                  </q-select>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="mascotaData.color" label="Color" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="mascotaData.rangoEdad" label="Edad (0-20 años)" type="number"
                    :rules="[(val) => val >= 0 && val <= 15 || 'La edad debe estar entre 0 y 20 años']" lazy-rules
                    required min="0" max="20" />
                </div>
              </div>

              <!-- Agregamos el campo de descripción -->
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="mascotaData.descripcion" label="Descripción" type="textarea" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="mascotaData.tamanio" label="Tamaño (Pequeño, Mediano, Grande)" lazy-rules
                    required />
                </div>
              </div>

              <div class="q-pa-md row justify-between">
                <div>

                </div>
                <q-btn label="Registrar y Finalizar" color="primary" @click="submitAndClose" />
                <div class="q-pa-md row justify-center">
                  <q-btn label="Guardar y Registrar Siguiente Mascota" color="teal" @click="submitAndContinue" />
                </div>
                <div v-if="mostrarBotonCancelar" class="q-pa-md row justify-center">
                  <q-btn label="Cancelar y Cerrar" color="negative" @click="isModalMascotaOpen = false" />
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
import { onMounted } from "vue";
import Swal from 'sweetalert2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'dropify/dist/css/dropify.css';
import Dropify from 'dropify';
import { api } from "boot/axios";

const mostrarBotonCancelar = ref(false);
const personas = ref([]);
const search = ref('');
const columns = [
  { name: 'nombres_apellidos', label: 'Nombres y Apellidos', field: 'nombres_apellidos', align: 'center' },
  { name: 'ci', label: 'CI', field: 'ci', align: 'center' },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'center' },
  {
    name: 'registro',
    label: 'Registrar Mascota',
    field: 'registro',
    align: 'center',
    sortable: false
  },
  { name: 'actions', label: 'Acciones', align: 'center' }
];

const filteredPersonas = computed(() => {
  if (!search.value) {
    return personas.value;
  }
  return personas.value.filter(persona => {
    const searchTerm = search.value.toLowerCase();
    return (
      persona.nombres_apellidos.toLowerCase().includes(searchTerm) ||
      persona.ci.toLowerCase().includes(searchTerm) ||
      persona.telefono.toLowerCase().includes(searchTerm)
    );
  });
});

const fetchPropietarios = async () => {
  try {
    const response = await api.get('/propietarios');
    console.log('Response data:', response.data);

    personas.value = response.data.map(propietario => ({
      nombres_apellidos: `${propietario.persona.nombres} ${propietario.persona.apellidos}`,
      ci: propietario.persona.ci,
      telefono: propietario.persona.telefono
    }));
  } catch (error) {
    console.error('Error fetching propietarios:', error);
  }
};


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

const mascotaData = ref({
  propietario: '',  // Aquí se llenará con el nombre del propietario registrado
  nombre: '',
  genero: '',
  especie: '',
  color: '',
  rangoEdad: '',
  tamanio: '',
  raza_id: '',  // Importante para asegurarnos de que esté el ID de raza, no el objeto
  fotoFrontal: null,
  fotoLateral: null,
  descripcion: ''  // Nuevo campo de descripción
});

const isModalPersonaOpen = ref(false);
const isModalMascotaOpen = ref(false);
const razas = ref([]);
const filteredRazas = ref([]);
let map;
let currentMarker = null;

const openModalPersona = () => {
  isModalPersonaOpen.value = true;
  setTimeout(() => {
    initializeDropify();
    initializeMap();
  }, 300);
};

const closeModalPersona = () => {
  isModalPersonaOpen.value = false;
  resetFormPersona();
};

const openModalMascota = (nombre, apellidos, propietarioId) => {
  isModalMascotaOpen.value = true;
  mostrarBotonCancelar.value = false;
  // Verificación de los valores antes de concatenar
  const nombreCompleto = `${nombre || ''} ${apellidos || ''}`.trim();

  mascotaData.value.propietario = nombreCompleto;  // Asignamos el nombre completo del propietario
  mascotaData.value.propietario_id = propietarioId;  // Asignamos el ID del propietario
};

const openModalMascotas = (row) => {
  isModalMascotaOpen.value = true;
  mostrarBotonCancelar.value = true;
  // Concatenar el nombre completo del propietario de la fila seleccionada
  const nombreCompleto = `${row.nombres_apellidos || ''}`.trim();

  // Asignar el nombre completo y el ID del propietario
  mascotaData.value.propietario = nombreCompleto;  // Asignamos el nombre completo del propietario
  mascotaData.value.propietario_id = row.id;  // Asignamos el ID del propietario (puede variar dependiendo de tu estructura de datos)
};

const closeModalMascota = () => {
  isModalMascotaOpen.value = false;
  resetFormMascota();
};

const initializeDropify = () => {
  const fotoUploader = document.querySelector('.dropify');
  new Dropify(fotoUploader);
};

const initializeMap = () => {
  nextTick(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        propietarioData.value.latitud = latitude;
        propietarioData.value.longitud = longitude;

        map = L.map('map').setView([latitude, longitude], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        map.invalidateSize();
        currentMarker = L.marker([latitude, longitude]).addTo(map);

        map.on('click', function (e) {
          propietarioData.value.latitud = e.latlng.lat;
          propietarioData.value.longitud = e.latlng.lng;

          if (currentMarker) {
            map.removeLayer(currentMarker);
          }

          currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
        });
      }, () => {
        alert("No se pudo obtener la ubicación actual.");
        fallbackMapInitialization();
      });
    } else {
      alert("El navegador no soporta Geolocalización.");
      fallbackMapInitialization();
    }
  });
};

const fallbackMapInitialization = () => {
  map = L.map('map').setView([-17.3912, -66.1507], 13);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.invalidateSize();
  currentMarker = L.marker([-17.3912, -66.1507]).addTo(map);

  map.on('click', function (e) {
    propietarioData.value.latitud = e.latlng.lat;
    propietarioData.value.longitud = e.latlng.lng;

    if (currentMarker) {
      map.removeLayer(currentMarker);
    }

    currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
  });
};

const resetFormPersona = () => {
  personaData.value = {
    nombres: '',
    apellidos: '',
    ci: '',
    telefono: ''
  };
  propietarioData.value = {
    direccion: '',
    observaciones: '',
    latitud: '',
    longitud: '',
    foto: null
  };

  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  map.setView([-17.3912, -66.1507], 13);
};

const resetFormMascota = () => {
  mascotaData.value = {
    propietario: '',
    nombre: '',
    genero: '',
    especie: '',
    color: '',
    rangoEdad: '',
    tamanio: '',
    raza_id: '',
    fotoFrontal: null,
    fotoLateral: null,
    descripcion: ''  // Limpiar también la descripción
  };
};

const submitFormPersona = async () => {
  console.log("Intentando registrar persona y propietario...");
  console.log("Datos de persona a enviar:", personaData.value); // Agrega este log para revisar los datos
  try {
    const personaResponse = await api.post('/personas', personaData.value);
    const personaId = personaResponse.data.persona.id;
    propietarioData.value.persona_id = personaId;

    const propietarioResponse = await api.post('/propietarios', propietarioData.value);
    const propietario = propietarioResponse.data.propietario;

    openModalMascota(personaData.value.nombres, personaData.value.apellidos, propietario.id);

    Swal.fire('Éxito', 'Persona y propietario registrados correctamente', 'success');
    closeModalPersona();
  } catch (error) {
    if (error.response) {
      console.error("Error en la respuesta del servidor:", error.response.data); // Revisa este error detalladamente
    } else if (error.request) {
      console.error("No hubo respuesta del servidor:", error.request);
    } else {
      console.error("Error al configurar la solicitud:", error.message);
    }
    Swal.fire('Error', 'Hubo un error al registrar los datos', 'error');
  }
};

const submitFormMascota = async (closeModal = true) => {
  // Verificar los datos antes de enviar
  console.log("Datos de mascota a enviar:", mascotaData.value);

  // Validar que la edad esté entre 1 y 15
  if (mascotaData.value.rangoEdad < 1 || mascotaData.value.rangoEdad > 15) {
    Swal.fire('Error', 'La edad debe estar entre 1 y 15 años', 'error');
    return;
  }

  // Obtener la fecha actual de Bolivia (zona horaria -04:00)
  const now = new Date();
  const currentYear = now.getFullYear();
  const birthYear = currentYear - mascotaData.value.rangoEdad;

  // Crear la fecha de nacimiento en formato YYYY-MM-DD
  const fechaNacimiento = `${birthYear}-${now.getMonth() + 1}-${now.getDate()}`;
  console.log("Fecha de nacimiento calculada:", fechaNacimiento);

  try {
    const formData = new FormData();
    formData.append('nombre', mascotaData.value.nombre);
    formData.append('genero', mascotaData.value.genero);
    formData.append('especie', mascotaData.value.especie);
    formData.append('color', mascotaData.value.color);
    formData.append('tamanio', mascotaData.value.tamanio);
    formData.append('raza_id', mascotaData.value.raza_id.id); // Solo el ID de raza
    formData.append('descripcion', mascotaData.value.descripcion);
    formData.append('propietario_id', mascotaData.value.propietario_id);

    // Enviar la fecha calculada como fecha de nacimiento
    formData.append('rangoEdad', fechaNacimiento);

    if (mascotaData.value.fotoFrontal) {
      formData.append('fotoFrontal', mascotaData.value.fotoFrontal);
    }

    if (mascotaData.value.fotoLateral) {
      formData.append('fotoLateral', mascotaData.value.fotoLateral);
    }

    console.log("Datos enviados en FormData:", formData);

    const mascotaResponse = await api.post('/mascotas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log("Mascota registrada con éxito:", mascotaResponse.data);
    Swal.fire('Éxito', 'Mascota registrada correctamente', 'success');

    if (closeModal) {
      closeModalMascota(); // Solo cierra el modal si se indica
    }
  } catch (error) {
    if (error.response) {
      console.error("Error en la respuesta del servidor:", error.response.data);
    } else if (error.request) {
      console.error("No hubo respuesta del servidor:", error.request);
    } else {
      console.error("Error al configurar la solicitud:", error.message);
    }
    Swal.fire('Error', 'Hubo un error al registrar la mascota', 'error');
  }
};

const submitAndClose = async () => {
  // Registrar la mascota actual y cerrar el modal
  await submitFormMascota(true);  // Pasamos un argumento para que cierre el modal
};

// Función para registrar y cerrar el modal
const submitAndContinue = async () => {
  // Registrar la mascota actual
  await submitFormMascota(false); // Pasamos un argumento para no cerrar el modal

  // Guardar el nombre del propietario actual antes de limpiar
  const propietarioActual = mascotaData.value.propietario;

  // Limpiar los campos del formulario excepto el propietario
  mascotaData.value.nombre = '';
  mascotaData.value.genero = '';
  mascotaData.value.especie = '';
  mascotaData.value.color = '';
  mascotaData.value.rangoEdad = '';
  mascotaData.value.tamanio = '';
  mascotaData.value.raza_id = '';
  mascotaData.value.descripcion = '';
  mascotaData.value.fotoFrontal = null;
  mascotaData.value.fotoLateral = null;

  // Restaurar el propietario en el campo correspondiente
  mascotaData.value.propietario = propietarioActual;
};


// Llamada para cargar las razas
const fetchRazas = async () => {
  try {
    const response = await api.get('/razas');
    razas.value = response.data;
    filteredRazas.value = razas.value;
  } catch (error) {
    console.error("Error al cargar las razas:", error);
  }
};

// Cargar las razas al montar el componente
onMounted(() => {
  fetchPropietarios();
  fetchRazas();
});

const filterRazas = (val, update) => {
  if (val === "") {
    update(() => {
      filteredRazas.value = razas.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filteredRazas.value = razas.value.filter((v) =>
      v.nombre.toLowerCase().includes(needle)
    );
  });
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

.absolute-top-right {
  position: absolute;
  top: 0;
  right: 0;
}
</style>

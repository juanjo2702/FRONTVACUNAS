<template>
  <q-page padding>
    <div class="q-pa-md background">
      <div class="content-wrapper">
        <!-- Mensajes de concientización -->
        <div class="text-container">
          <h1 class="text-primary text-center text-responsive">¡Registra a tus mascotas para protegerlas contra la
            rabia!</h1>
          <p class="text-body1 text-center text-grey-8">
            <strong>El preregistro es clave para organizar campañas de vacunación más efectivas y proteger a tus
              mascotas
              y a tu
              comunidad.</strong>
          </p>
          <p class="text-body2 text-center">
            Una comunidad organizada y responsable puede prevenir brotes de enfermedades.
            ¡Haz tu parte y regístrate hoy mismo!
          </p>
        </div>
        <!-- Botón central para registrar -->
        <div class="btn-container">
          <q-btn label="Registrar Nueva Persona" color="primary" size="lg" push glossy icon="person_add"
            @click="openModalPersona" />
        </div>
      </div>

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
              <!-- Campo para imagen del propietario -->
              <div class="col-xs-12 col-sm-6 col-md-4">
                <label for="foto">Subir Foto del Propietario</label>
                <input type="file" class="dropify" id="foto" accept="image/*;capture=camera" />
              </div>

              <div id="map" class="q-mt-md" style="height: 300px; width: 100%"></div>

              <div class="q-pa-md row justify-evenly">
                <q-btn label="Registrar" color="primary" @click="confirmAndSubmit" />
                <q-btn label="Resetear" type="reset" color="green" />
              </div>
              <div class="q-pa-md row justify-evenly">
                <q-btn label="Cerrar" color="negative" @click="closeModalPersona" />
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

          <q-separator />

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
                  <q-select filled v-model="mascotaData.especie" :options="['Perro', 'Gato']" label="Especie"
                    @update:model-value="onEspecieChange" lazy-rules required />
                </div>
              </div>

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-select filled v-model="mascotaData.raza_id" use-input input-debounce="0" label="Raza"
                    :options="filteredRazas" option-value="id" option-label="nombre" clearable
                    hint="Seleccione una Raza" lazy-rules @filter="filterRazas" :disable="!mascotaData.especie"
                    :rules="[(val) => !!val || 'Seleccione una Raza']" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="mascotaData.color" label="Color" />
                </div>

                <!-- Campos para edad: años y meses -->
                <div class="col-xs-12 col-sm-6 col-md-2">
                  <q-input filled v-model.number="mascotaData.edadAnos" label="Años (1-20)" type="number"
                    :rules="[(val) => val >= 1 && val <= 20 || 'La edad en años debe estar entre 1 y 20']" lazy-rules
                    required min="1" max="20" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-2">
                  <q-input filled v-model.number="mascotaData.edadMeses" label="Meses (0-11)" type="number"
                    :rules="[(val) => val >= 0 && val <= 11 || 'La edad en meses debe estar entre 0 y 11']" lazy-rules
                    required min="0" max="11" />
                </div>
              </div>

              <!-- Agregamos el campo de descripción -->
              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="mascotaData.descripcion" label="Descripción" type="textarea" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-select filled v-model="mascotaData.tamanio" :options="['Pequeño', 'Mediano', 'Grande']"
                    label="Tamaño (Pequeño, Mediano, Grande)" lazy-rules required />
                </div>
              </div>

              <!-- Campo para imágenes -->
              <div class="col-xs-12 col-sm-6 col-md-4">
                <label for="fotoFrontal">Subir Imagen Frontal</label>
                <input type="file" class="dropify" id="fotoFrontal" accept="image/*;capture=camera" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <label for="fotoLateral">Subir Imagen Lateral</label>
                <input type="file" class="dropify" id="fotoLateral" accept="image/*;capture=camera" />
              </div>

              <div class="q-pa-md row justify-between">
                <div class="q-pa-md row justify-center">
                  <q-btn label="Registrar Mascota" color="teal" @click="submitAndContinueWithConfirmation" />
                </div>
                <div class="q-pa-md row justify-center">
                  <q-btn label="Cerrar" color="negative" @click="isModalMascotaOpen = false" />
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
import $ from 'jquery'; // Importa jQuery primero
import { ref, nextTick, computed } from 'vue';
import { onMounted } from "vue";
import Swal from 'sweetalert2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Dropify from 'dropify';
import { api, customAxios, storage } from "boot/axios";
// Importar Dropify CSS y JS
import 'dropify/dist/css/dropify.min.css';
import 'dropify/dist/js/dropify.min.js';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';  // Importa useQuasar
const router = useRouter();  // Crea una instancia del router
// Función para registrar la mascota y cerrar el modal
const submitAndClose = async () => {
  openModalVacunacion(); // Solo abre si hay mascotas
};
const $q = useQuasar();
const mostrarBotonCancelar = ref(false);
const personas = ref([]);
const isLoading = ref(true);

const fetchPropietarios = async () => {
  try {
    const response = await api.get('/propietarios');
    personas.value = response.data.map(propietario => ({
      nombres_apellidos: `${propietario.persona.nombres} ${propietario.persona.apellidos}`,
      ci: propietario.persona.ci,
      telefono: propietario.persona.telefono,
      foto: propietario.foto || '',  // Asegúrate de que haya al menos un string vacío si no hay foto
      propietario_id: propietario.id
    }));
    isLoading.value = false;  // Indicar que la carga ha terminado
  } catch (error) {
    console.error('Error fetching propietarios:', error);
  }
};
const props = defineProps({
  row: {
    type: Object,
    required: true
  }
});

const getStorageUrl = (path) => {
  if (!path) {
    console.error('La propiedad foto no está definida:', path);  // Asegúrate de que el path esté definido
    return '';
  }
  const url = `${customAxios.defaults.baseURL}${path}`;
  console.log('URL de la imagen generada:', url);  // Revisa que la URL esté bien formada
  return url;
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
  edadAnos: 0,
  edadMeses: 0,
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
  buttonsDisabled.value = true; // Deshabilita los botones

  const nombreCompleto = `${nombre || ''} ${apellidos || ''}`.trim();
  mascotaData.value.propietario = nombreCompleto;
  mascotaData.value.propietario_id = propietarioId;

  initializeDropify();
};


const openModalMascotas = (row) => {
  isModalMascotaOpen.value = true;
  buttonsDisabled.value = false; // Habilita los botones

  const nombreCompleto = `${row.nombres_apellidos || ''}`.trim();
  mascotaData.value.propietario = nombreCompleto;
  mascotaData.value.propietario_id = Number(row.propietario_id);

  initializeDropify();
};


const closeModalMascota = () => {
  isModalMascotaOpen.value = false;
  resetFormMascota();
};

const initializeDropify = () => {
  setTimeout(() => {
    // Inicializar Dropify para cada campo de imagen
    $('#fotoFrontal').dropify(); // Para el campo de imagen frontal
    $('#fotoLateral').dropify(); // Para el campo de imagen lateral
    $('#foto').dropify(); // Para la foto del propietario
  }, 300);  // Esperar 300ms para asegurarse de que el DOM esté listo
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
    longitud: ''
  };
  // Limpiar Dropify
  const fotoPropietarioElement = $('#foto').data('dropify');
  if (fotoPropietarioElement) {
    fotoPropietarioElement.resetPreview();  // Limpiar campo de imagen del propietario
  }

  const fotoFrontalElement = $('#fotoFrontal').data('dropify');
  if (fotoFrontalElement) {
    fotoFrontalElement.resetPreview();  // Limpiar campo de imagen frontal
  }

  const fotoLateralElement = $('#fotoLateral').data('dropify');
  if (fotoLateralElement) {
    fotoLateralElement.resetPreview();  // Limpiar campo de imagen lateral
  }

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
    edadAnos: 0,
    edadMeses: 0,
    tamanio: '',
    raza_id: '',
    descripcion: ''  // Limpiar también la descripción
  };

};

const submitFormPersona = async () => {
  console.log("Intentando registrar persona y propietario...");
  console.log("Datos de persona a enviar:", personaData.value); // Agrega este log para revisar los datos

  try {
    // Crear un nuevo objeto FormData solo para la persona
    const formDataPersona = new FormData();
    formDataPersona.append('nombres', personaData.value.nombres);
    formDataPersona.append('apellidos', personaData.value.apellidos);
    formDataPersona.append('ci', personaData.value.ci);
    formDataPersona.append('telefono', personaData.value.telefono);

    // Realizar la solicitud POST solo para la Persona
    const personaResponse = await api.post('/personas', formDataPersona, {
      headers: {
        'Content-Type': 'multipart/form-data', // Importante para enviar archivos
      },
    });

    // Ahora tomamos el ID de la Persona registrada
    const personaId = personaResponse.data.persona.id;
    propietarioData.value.persona_id = personaId;

    // Crear otro FormData solo para el propietario
    const formDataPropietario = new FormData();
    formDataPropietario.append('direccion', propietarioData.value.direccion);
    formDataPropietario.append('observaciones', propietarioData.value.observaciones);
    formDataPropietario.append('latitud', propietarioData.value.latitud);
    formDataPropietario.append('longitud', propietarioData.value.longitud);

    // Capturar la imagen del propietario si se ha seleccionado
    const fotoPropietario = document.getElementById('foto').files[0];
    if (!fotoPropietario) {
      console.error("No file selected for upload");
    } else {
      formDataPropietario.append('foto', fotoPropietario); // Añadir la imagen al FormData de la persona
    }

    // Añadir el ID de la persona al FormData del propietario
    formDataPropietario.append('persona_id', personaId);

    // Realizar la solicitud POST para el Propietario
    const propietarioResponse = await api.post('/propietarios', formDataPropietario, {
      headers: {
        'Content-Type': 'multipart/form-data', // Importante para enviar archivos
      },
    });

    const propietario = propietarioResponse.data.propietario;

    // Una vez que ambos registros estén completos, abre el modal para las mascotas
    openModalMascota(personaData.value.nombres, personaData.value.apellidos, propietario.id);

    // Mostrar mensaje de éxito
    $q.notify({
      type: 'positive',
      message: 'Persona y propietario registrados correctamente',
      position: 'top'
    });
    fetchPropietarios();

    closeModalPersona();
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta del servidor:', error.response.data); // Revisa este error detalladamente
    } else if (error.request) {
      console.error('No hubo respuesta del servidor:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
    $q.notify({
      type: 'negative',
      message: 'Hubo un error al registrar los datos',
      position: 'top'
    });
  }
};

// Cálculo de la fecha de nacimiento
const calculateFechaNacimiento = () => {
  const totalMeses = mascotaData.value.edadAnos * 12 + mascotaData.value.edadMeses;

  // Obtener fecha actual de Bolivia (UTC-4)
  const now = new Date();
  now.setHours(now.getHours() - 4); // Ajuste manual a la zona horaria UTC-4

  // Calcular fecha restando meses
  const fechaNacimiento = new Date(now.setMonth(now.getMonth() - totalMeses));

  return fechaNacimiento.toISOString().split('T')[0]; // Retorna en formato YYYY-MM-DD
};

const submitFormMascota = async (closeModal = true) => {
  // Verificar los datos antes de enviar
  console.log("Datos de mascota a enviar:", mascotaData.value);

  const fechaNacimiento = calculateFechaNacimiento();
  console.log('Fecha de nacimiento calculada:', fechaNacimiento);

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

    // Capturar las imágenes del DOM usando los IDs de los campos de Dropify
    const frontalImage = document.getElementById('fotoFrontal').files[0];  // Imagen frontal
    const lateralImage = document.getElementById('fotoLateral').files[0];  // Imagen lateral

    // Si existe una imagen frontal, la añadimos al FormData
    if (frontalImage) {
      formData.append('fotoFrontal', frontalImage);  // Nombre del campo en FormData: 'fotoFrontal'
    }

    // Si existe una imagen lateral, la añadimos al FormData
    if (lateralImage) {
      formData.append('fotoLateral', lateralImage);  // Nombre del campo en FormData: 'fotoLateral'
    }


    console.log("Datos enviados en FormData:", formData);

    const mascotaResponse = await api.post('/mascotas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log("Mascota registrada con éxito:", mascotaResponse.data);
    $q.notify({
      type: 'positive',
      message: 'Mascota registrada correctamente',
      position: 'top'
    });

    // Habilitar los botones una vez registrado
    buttonsDisabled.value = false;

    // Limpiar los campos de Dropify después de un registro exitoso
    const fotoFrontalElement = $('#fotoFrontal').dropify();
    fotoFrontalElement.data('dropify').resetPreview();
    fotoFrontalElement.data('dropify').clearElement();

    const fotoLateralElement = $('#fotoLateral').dropify();
    fotoLateralElement.data('dropify').resetPreview();
    fotoLateralElement.data('dropify').clearElement();

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
    $q.notify({
      type: 'negative',
      message: 'Hubo un error al registrar la mascota',
      position: 'top'
    });
  }

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
  mascotaData.value.edadAnos = 0;
  mascotaData.value.edadMeses = 0;
  mascotaData.value.tamanio = '';
  mascotaData.value.raza_id = '';
  mascotaData.value.descripcion = '';
  mascotaData.value.fotoFrontal = null;
  mascotaData.value.fotoLateral = null;

  // Restaurar el propietario en el campo correspondiente
  mascotaData.value.propietario = propietarioActual;
};


// Función para obtener razas filtradas por tipo (0 = Perro, 1 = Gato)
const fetchRazas = async (tipo) => {
  try {
    const response = await api.get(`/razas?tipo=${tipo}`); // El tipo 0 para perros, 1 para gatos
    razas.value = response.data;
    filteredRazas.value = razas.value;
  } catch (error) {
    console.error("Error al cargar las razas:", error);
  }
};

const onEspecieChange = (especie) => {
  if (!especie) {
    filteredRazas.value = []; // Vaciar las razas si no hay especie seleccionada
    return;
  }
  const tipo = especie === 'Perro' ? 0 : 1; // 0 para perros, 1 para gatos

  fetchRazas(tipo); // Llamar a la función fetchRazas con el tipo adecuado
};
import axios from 'axios';


// Cargar las razas al montar el componente
onMounted(() => {
  fetchPropietarios();
  fetchRazas();
  setTimeout(() => {
    $('#foto').dropify();  // Asegúrate de que Dropify está inicializado correctamente
  }, 300);  // Esperar 300ms para asegurarse de que el DOM esté listo
});

const filterRazas = (val, update) => {
  update(() => {
    if (val === '') {
      filteredRazas.value = razas.value; // Si no hay búsqueda, se muestran todas las razas
    } else {
      const needle = val.toLowerCase();
      filteredRazas.value = razas.value.filter((raza) =>
        raza.nombre.toLowerCase().includes(needle) // Filtra según el nombre de la raza
      );
    }
  });
};
// Estado para controlar si los botones deben estar deshabilitados o no
const buttonsDisabled = ref(true);
const confirmAndSubmit = () => {
  $q.dialog({
    title: '<span style="color: #4caf50;">Confirmación de Registro</span>',
    message: `
      <div style="display: flex; align-items: center; font-size: 16px;">
        <q-icon name="person_add" color="green" style="margin-right: 8px;"></q-icon>
        ¿Estás seguro de que sus datos son correctos?
      </div>
    `,
    html: true, // Permite HTML en el mensaje
    ok: {
      label: 'Registrar',
      color: 'green',
      flat: false,
    },
    cancel: {
      label: 'Cancelar',
      color: 'negative',
      flat: true,
    },
    persistent: true,
  }).onOk(() => {
    // Si acepta, proceder con el registro
    submitFormPersona();
  }).onCancel(() => {
    // Si cancela, mostrar notificación
    $q.notify({
      type: 'warning',
      message: 'Registro cancelado.',
      position: 'top',
    });
  });
};

const submitAndContinueWithConfirmation = () => {
  $q.dialog({
    title: '<span style="color: #2c82c9;">Confirmación</span>',
    message: `
      <div style="display: flex; align-items: center; font-size: 16px;">
        <q-icon name="help_outline" color="blue" style="margin-right: 8px;"></q-icon>
        ¿Estás seguro de que deseas registrar esta mascota? COMPRUEBE LOS DATOS
      </div>
    `,
    html: true, // Permite HTML en el mensaje
    ok: {
      label: 'Sí, continuar',
      color: 'primary',
      flat: false,
    },
    cancel: {
      label: 'Cancelar',
      color: 'negative',
      flat: true,
    },
    persistent: true,
  }).onOk(() => {
    // Acción al confirmar
    submitAndContinue();
  }).onCancel(() => {
    // Notificación al cancelar
    $q.notify({
      type: 'warning',
      message: 'Acción cancelada.',
      position: 'top',
    });
  });
};

</script>
<style scoped>
.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  /* Fondo semitransparente */
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  max-width: 600px;
  opacity: 1;
}

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

.dropify-wrapper {
  margin-bottom: 20px;
}

.q-btn {
  font-size: 1.2rem;
}

.foto-mascota {
  display: flex;
  justify-content: center;
}

.mascota-imagen {
  max-width: 150px;
  border-radius: 10px;
}

.q-td img {
  width: 80px;
  /* Ancho estándar */
  height: 80px;
  /* Altura estándar */
  object-fit: cover;
  /* Mantiene el recorte adecuado */
  border-radius: 5px;
  /* Redondeo de bordes */
}

.foto-mascota img {
  width: 100px;
  /* Ancho fijo */
  height: 100px;
  /* Altura fija */
  object-fit: cover;
  /* Mantiene el recorte adecuado */
  border-radius: 10px;
  /* Redondeo de bordes */
  margin-bottom: 10px;
  /* Espacio entre la imagen y el contenido */
}

.btn-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.text-container {
  max-width: 500px;
  margin-bottom: 20px;
}

.text-responsive {
  font-size: 4rem;
  /* Tamaño base para dispositivos grandes */
}

@media (max-width: 600px) {
  .text-responsive {
    font-size: 3rem;
    /* Ajuste de tamaño en dispositivos pequeños */
  }
}

.background {
  background-image: url('/fondopublico.png');
  background-size: cover;
  background-position: center;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  opacity: 1;
}
</style>

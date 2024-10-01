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
        <template v-slot:body-cell-foto="props">
          <q-td align="center">
            <img :src="props.row.foto ? `/storage/${props.row.foto}` : '/images/default_image.png'"
              alt="Foto del Propietario" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />
          </q-td>
        </template>

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
              <!-- Campo para imagen del propietario -->
              <div class="col-xs-12 col-sm-6 col-md-4">
                <div>
                  <label for="foto">Subir Foto del Propietario</label>
                  <input type="file" class="dropify" id="foto" accept="image/*;capture=camera" />
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
                  <q-select filled v-model="mascotaData.especie" :options="['Perro', 'Gato']" label="Especie"
                    @update:model-value="onEspecieChange" lazy-rules required />
                </div>

              </div>

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-select filled v-model="mascotaData.raza_id" use-input input-debounce="0" label="Raza"
                    :options="filteredRazas" option-value="id" option-label="nombre" clearable
                    hint="Seleccione una Raza" lazy-rules @filter="filterRazas"
                    :rules="[(val) => !!val || 'Seleccione una Raza']" />

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
                  <q-select filled v-model="mascotaData.tamanio" :options="['Pequeño', 'Mediano', 'Grande']"
                    label="Tamaño (Pequeño, Mediano, Grande)" lazy-rules required />
                </div>
              </div>

              <!-- Campo para imagen frontal -->
              <div class="col-xs-12 col-sm-6 col-md-4">
                <div>
                  <label for="fotoFrontal">Subir Imagen Frontal</label>
                  <input type="file" class="dropify" id="fotoFrontal" accept="image/*;capture=camera" />
                </div>
              </div>

              <!-- Campo para imagen lateral -->
              <div class="col-xs-12 col-sm-6 col-md-4">
                <div>
                  <label for="fotoLateral">Subir Imagen Lateral</label>
                  <input type="file" class="dropify" id="fotoLateral" accept="image/*;capture=camera" />
                </div>
              </div>



              <div class="q-pa-md row justify-between">
                <div></div>
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
import $ from 'jquery'; // Importa jQuery primero
import { ref, nextTick, computed } from 'vue';
import { onMounted } from "vue";
import Swal from 'sweetalert2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Dropify from 'dropify';
import { api } from "boot/axios";
// Importar Dropify CSS y JS
import 'dropify/dist/css/dropify.min.css';
import 'dropify/dist/js/dropify.min.js';

const mostrarBotonCancelar = ref(false);
const personas = ref([]);
const search = ref('');
const columns = [
  { name: 'nombres_apellidos', label: 'Nombres y Apellidos', field: 'nombres_apellidos', align: 'center' },
  { name: 'ci', label: 'CI', field: 'ci', align: 'center' },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'center' },
  { name: 'foto', label: 'Foto', field: 'foto', align: 'center' },
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
      telefono: propietario.persona.telefono,
      propietario_id: propietario.id  // Asegúrate de que propietario_id esté aquí
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
  const nombreCompleto = `${nombre || ''
    } ${apellidos || ''}`.trim();

  mascotaData.value.propietario = nombreCompleto;  // Asignamos el nombre completo del propietario
  mascotaData.value.propietario_id = propietarioId;  // Asignamos el ID del propietario
  // Inicializar Dropify
  initializeDropify();
};

const openModalMascotas = (row) => {
  isModalMascotaOpen.value = true;
  mostrarBotonCancelar.value = true;
  // Verificar la estructura de 'row'
  console.log("Datos de la fila seleccionada (row):", row);
  // Concatenar el nombre completo del propietario de la fila seleccionada
  const nombreCompleto = `${row.nombres_apellidos || ''
    }`.trim();



  // Asignar el nombre completo y el ID del propietario
  mascotaData.value.propietario = nombreCompleto;  // Asignamos el nombre completo del propietario
  mascotaData.value.propietario_id = Number(row.propietario_id);  // Asignamos el ID del propietario (puede variar dependiendo de tu estructura de datos)
  console.log("Propietario ID enviado:", mascotaData.value.propietario_id);
  // Inicializar Dropify
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
    rangoEdad: '',
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
    if (fotoPropietario) {
      formDataPropietario.append('foto', fotoPropietario); // Añadir la imagen al FormData del propietario
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
    Swal.fire('Éxito', 'Persona y propietario registrados correctamente', 'success');
    closeModalPersona();
  } catch (error) {
    if (error.response) {
      console.error('Error en la respuesta del servidor:', error.response.data); // Revisa este error detalladamente
    } else if (error.request) {
      console.error('No hubo respuesta del servidor:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
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
  //const fechaNacimiento = `${ birthYear }-${ now.getMonth() + 1 } -${ now.getDate() }`;
  const month = String(now.getMonth() + 1).padStart(2, '0');  // Mes con dos dígitos
  const day = String(now.getDate()).padStart(2, '0');  // Día con dos dígitos
  const fechaNacimiento = `${birthYear}-${month}-${day}`;  // Genera la fecha con el formato correcto

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
    Swal.fire('Éxito', 'Mascota registrada correctamente', 'success');
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


// Función para obtener razas filtradas por tipo (0 = Perro, 1 = Gato)
const fetchRazas = async (tipo) => {
  try {
    const response = await api.get(`/razas?tipo=${tipo}`);
    razas.value = response.data;
    filteredRazas.value = razas.value; // Actualiza el array con las razas filtradas
  } catch (error) {
    console.error("Error al cargar las razas:", error);
  }
};
const onEspecieChange = (especie) => {
  if (!especie) {
    filteredRazas.value = [];  // Vaciar las razas si no hay especie seleccionada
    return;
  }
  // Si la especie seleccionada es "Perro", el tipo es 0, si es "Gato", el tipo es 1
  const tipo = especie === 'Perro' ? 0 : 1;

  // Llamar a la función fetchRazas con el tipo correspondiente
  fetchRazas(tipo);
};


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

.dropify-wrapper {
  margin-bottom: 20px;
}
</style>

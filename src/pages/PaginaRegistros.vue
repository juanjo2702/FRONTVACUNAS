<template>
  <q-page padding>
    <div class="q-pa-md">
      <!-- Botón para abrir el modal -->
      <q-btn label="Registrar Nueva Persona" color="primary" @click="openModalPersona" />

      <!-- Modal con el formulario de registro de Persona -->
      <q-dialog v-model="isModalPersonaOpen" persistent>
        <q-card style="min-width: 80vw; max-height: 90vh;">
          <q-card-section>
            <div class="text-h6">REGISTRAR NUEVA PERSONA</div>
          </q-card-section>
          <q-separator></q-separator>
          <q-card-section>
            <q-form ref="form" @submit.prevent="submitFormPersona">
              <!-- Sección de Datos de Persona -->
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

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <label>Imagen del Propietario (Opcional)</label>
                  <input type="file" ref="fotoUploader" class="dropify" data-height="100%" />
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
                  <!-- <q-select filled v-model="" :options="razasOptions" label="Raza" use-input /> -->
                  <q-select filled style="width: 100%; text-transform: uppercase" v-model="selectedRaza" use-input
                    input-debounce="0" label="Raza" :options="filteredRazas" @filter="filterRazas" option-value="id"
                    option-label="nombre" hint="Seleccione una Raza" lazy-rules
                    :rules="[(val) => !!val || 'Seleccione una Raza']"></q-select>
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="mascotaData.color" label="Color" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-select filled v-model="mascotaData.rangoEdad" :options="['0-4', '5-9', '10-15']"
                    label="Rango de Edad" />
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

              <div class="row q-col-gutter-md q-mb-md">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <label>Foto Frontal</label>
                  <input type="file" ref="fotoUploader" class="dropify" data-height="100%" />
                </div>
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <label>Foto Lateral</label>
                  <input type="file" ref="fotoUploader" class="dropify" data-height="100%" />
                </div>
              </div>

              <div class="q-pa-md row justify-evenly">
                <q-btn label="Registrar Mascota" type="submit" color="primary" />
                <q-btn label="Cerrar" color="negative" @click="closeModalMascota" />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { onMounted } from "vue";
import Swal from 'sweetalert2';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'dropify/dist/css/dropify.css';
import Dropify from 'dropify';
import { api } from "boot/axios";

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
  raza_id: '',
  fotoFrontal: null,
  fotoLateral: null,
  descripcion: ''  // Nuevo campo de descripción
});

const isModalPersonaOpen = ref(false);
const isModalMascotaOpen = ref(false);
const razas = ref([]);
const selectedRaza = ref(null);
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

const openModalMascota = (nombrePropietario) => {
  isModalMascotaOpen.value = true;
  mascotaData.value.propietario = nombrePropietario; // Asignamos el nombre del propietario
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
  try {
    console.log("Datos a enviar para Persona:", personaData.value);
    const personaResponse = await api.post('/personas', personaData.value);
    const personaId = personaResponse.data.persona.id;
    propietarioData.value.persona_id = personaId;

    console.log("Persona registrada con éxito:", personaResponse.data);
    console.log("Datos a enviar para Propietario:", propietarioData.value);
    const propietarioResponse = await api.post('/propietarios', propietarioData.value);

    console.log("Propietario registrado con éxito:", propietarioResponse.data);

    Swal.fire('Éxito', 'Persona y propietario registrados correctamente', 'success');
    closeModalPersona();

    // Abrimos el modal de mascotas y pasamos el nombre del propietario
    openModalMascota(personaData.value.nombres);
  } catch (error) {
    if (error.response) {
      console.error("Error en la respuesta del servidor:", error.response.data);
    } else if (error.request) {
      console.error("No hubo respuesta del servidor:", error.request);
    } else {
      console.error("Error al configurar la solicitud:", error.message);
    }
    Swal.fire('Error', 'Hubo un error al registrar los datos', 'error');
  }
};

const submitFormMascota = async () => {
  console.log("Intentando registrar mascota...");
  try {
    const formData = new FormData();
    formData.append('nombre', mascotaData.value.nombre);
    formData.append('genero', mascotaData.value.genero);
    formData.append('especie', mascotaData.value.especie);
    formData.append('color', mascotaData.value.color);
    formData.append('rangoEdad', mascotaData.value.rangoEdad);
    formData.append('tamanio', mascotaData.value.tamanio);
    formData.append('raza_id', mascotaData.value.raza_id);
    formData.append('descripcion', mascotaData.value.descripcion);

    if (mascotaData.value.fotoFrontal) {
      formData.append('fotoFrontal', mascotaData.value.fotoFrontal);
    }

    if (mascotaData.value.fotoLateral) {
      formData.append('fotoLateral', mascotaData.value.fotoLateral);
    }

    const mascotaResponse = await api.post('/mascotas', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    console.log("Mascota registrada con éxito:", mascotaResponse.data);

    Swal.fire('Éxito', 'Mascota registrada correctamente', 'success');
    closeModalMascota();
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

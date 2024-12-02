<template>
  <q-page class="q-pa-md">
    <!-- Buscador de Propietario -->
    <div class="q-gutter-md q-col-gutter-md q-mt-md buscador">
      <q-input filled v-model="search" label="Buscar propietario" />
      <q-btn icon="search" color="primary" @click="buscarPropietarios" flat round />
    </div>

    <div v-if="propietarios.length > 0" class="q-mt-md">
      <q-list bordered padding>
        <q-item v-for="propietario in propietarios" :key="propietario.id" clickable
          @click="seleccionarPropietario(propietario)">
          <q-item-section>
            <q-item-label>{{ propietario.nombres }} {{ propietario.apellidos }} </q-item-label>
            <q-item-label caption>CI: {{ propietario.ci }} - Teléfono: {{ propietario.telefono
              }}</q-item-label>

          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Perfil del Propietario Seleccionado -->
    <div v-if="propietarioSeleccionado" class="q-mb-md q-mt-md">
      <q-card>
        <q-card-section>
          <div class="text-h6 q-py-sm">Propietario Seleccionado</div>
          <div class="q-gutter-md">
            <q-item-label>{{ propietarioSeleccionado.nombres }} {{ propietarioSeleccionado.apellidos
              }}</q-item-label>
            <q-item-label caption>CI: {{ propietarioSeleccionado.ci }}</q-item-label>
            <q-item-label caption>Teléfono: {{ propietarioSeleccionado.telefono }}</q-item-label>

            <!-- Botones para Editar y Eliminar -->
            <div class="row q-col-gutter-md">
              <q-btn flat icon="edit" color="primary" @click="editPersona(propietarioSeleccionado)" label="Editar"
                class="col" />

              <q-btn flat icon="delete" color="negative" @click="eliminarPersona" label="Eliminar" class="col" />

            </div>
          </div>
          <q-btn color="primary" @click="mostrarMascotas" label="Ver Mascotas" class="q-mt-md" />
        </q-card-section>

      </q-card>
    </div>

    <!-- Lista de Mascotas del Propietario Seleccionado -->
    <div v-if="mascotas.length > 0" class="q-mt-md">
      <div v-for="mascota in mascotas" :key="mascota.id" class="q-mb-md">
        <q-card>
          <q-card-section class="row q-col-gutter-md">
            <div class="foto-mascota col-4">
              <q-img :src="`${$storage.defaults.baseURL}/${mascota.fotoFrontal}` || 'https://via.placeholder.com/150'"
                alt="Foto del perro" class="mascota-imagen"
                style="max-width: 100px; max-height: 100px; margin: 0 auto;" />
            </div>

            <!-- Campos de Información de la Mascota -->
            <div class="col-8">
              <div class="q-mb-md">
                <q-input filled v-model="mascota.nombre" label="Nombre del Perro" :disable="!mascota.isEditing" />
              </div>
              <div class="q-mb-md">
                <q-input filled v-model="mascota.especie" label="Especie" :disable="!mascota.isEditing" />
              </div>
              <div class="q-mb-md">
                <q-input filled v-model="mascota.raza" label="Raza" :disable="!mascota.isEditing" />
              </div>


              <div class="q-mb-md">
                <q-input filled v-model="mascota.tamanio" label="Tamaño" :disable="!mascota.isEditing" />
              </div>

              <!-- Botones -->
              <div class="row q-col-gutter-md">
                <q-btn flat icon="edit" color="primary" @click="openEditMascotaModal(mascota)" label="Editar"
                  class="col" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>



    <q-dialog v-model="isModalPersonaOpen" @show="handleModalOpen" persistent>
      <q-card style="min-width: 80vw; max-height: 90vh;">
        <q-card-section>
          <div class="text-h6">EDITAR PERSONA</div>
        </q-card-section>
        <q-separator></q-separator>
        <q-card-section>
          <q-form ref="form" @submit.prevent="submitEditPersona">
            <!-- Datos de la persona -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="personaData.nombres" label="Nombres" lazy-rules required />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="personaData.apellidos" label="Apellidos" lazy-rules required />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="personaData.ci" label="CI" lazy-rules required />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="personaData.celular" label="Teléfono" lazy-rules required />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="propietarioData.direccion" label="Dirección" lazy-rules />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="propietarioData.observaciones" label="Observaciones" type="textarea" />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-4">
                <label for="foto">Subir Foto del Propietario</label>
                <input type="file" class="dropify" id="foto" accept="image/*;capture=camera"
                  :data-default-file="propietarioData.foto ? `${customAxios.defaults.baseURL}/storage/images/propietarios/${propietarioData.foto}` : ''" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="propietarioData.latitud" label="Latitud" lazy-rules />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="propietarioData.longitud" label="Longitud" lazy-rules />
              </div>
            </div>

            <div id="map" class="q-mt-md" style="height: 300px; width: 100%;"></div>

            <!-- Botones -->
            <div class="q-pa-md row justify-evenly">
              <q-btn label="Guardar" type="submit" color="primary" />
              <q-btn label="Resetear" type="reset" color="green" @click="resetFormPersona" />
              <q-btn label="Salir" color="negative" @click="closeModalPersona" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal para Editar Mascota -->
    <q-dialog v-model="isModalEditMascotaOpen" persistent>
      <q-card style="min-width: 60vw; max-height: 90vh;">
        <q-card-section>
          <div class="text-h6">EDITAR MASCOTA</div>
        </q-card-section>

        <q-separator></q-separator>

        <q-card-section>
          <q-form ref="formEditMascota" @submit.prevent="submitEditMascota">
            <!-- Propietario (solo lectura) -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="mascotaEditData.propietario" label="Propietario" readonly
                  v-if="mascotaEditData && mascotaEditData.propietario" />

              </div>
            </div>

            <!-- Campos de la mascota -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="mascotaEditData.nombre" label="Nombre Mascota" lazy-rules required />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-select filled v-model="mascotaEditData.genero" :options="['Macho', 'Hembra']" label="Género" />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-select filled v-model="mascotaEditData.especie" :options="['Perro', 'Gato']" label="Especie"
                  @update:model-value="onEspecieChange" />
              </div>

            </div>

            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-select filled v-model="mascotaEditData.raza_id" :options="allRazas" option-value="id"
                  option-label="nombre" label="Raza" clearable />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="mascotaEditData.color" label="Color" />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-4">
                <div class="col-xs-12 col-sm-6 col-md-4">
                  <q-input filled v-model="mascotaEditData.rangoEdad" label="Edad (0-20 años)" type="number"
                    :rules="[(val) => val !== null && val !== undefined && val >= 0 && val <= 20 || 'La edad debe estar entre 0 y 20 años']"
                    lazy-rules required min="0" max="20" />
                </div>
              </div>

              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-input filled v-model="mascotaEditData.descripcion" label="Descripción" type="textarea" lazy-rules />
              </div>
              <div class="col-xs-12 col-sm-6 col-md-4">
                <q-select filled v-model="mascotaEditData.tamanio" label="Tamaño"
                  :options="['Pequeño', 'Mediano', 'Grande']" />
              </div>

            </div>

            <!-- Campos de imágenes -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-6 col-md-4">
                <label for="editFotoFrontal">Imagen Frontal</label>
                <input type="file" id="editFotoFrontal" accept="image/*" class="form-control"
                  @change="onFileChange('fotoFrontal', $event)" />
                <q-img v-if="mascotaEditData.fotoFrontal" :src="getImgPreview('fotoFrontal')"
                  style="max-height: 100px;" />
              </div>

              <div class="col-xs-12 col-sm-6 col-md-4">
                <label for="editFotoHorizontal">Imagen Lateral</label>
                <input type="file" id="editFotoHorizontal" accept="image/*" class="form-control"
                  @change="onFileChange('fotoHorizontal', $event)" />
                <q-img v-if="mascotaEditData.fotoHorizontal" :src="getImgPreview('fotoHorizontal')"
                  style="max-height: 100px;" />
              </div>
            </div>


            <!-- Botones -->
            <div class="q-pa-md row justify-evenly">
              <q-btn label="Guardar Cambios" color="primary" @click="submitEditMascota" />

              <q-btn label="Cerrar" color="negative" @click="closeModalEditMascota" />

            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>




  </q-page>
</template>

<script>
import $ from 'jquery'; // Importa jQuery primero
import { ref, nextTick } from 'vue';
import { QPage, QInput, QBtn, QCard, QCardSection, QList, QItem, QItemSection, QItemLabel, QImg } from 'quasar';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { api } from 'src/boot/axios'; // Ruta al archivo axios.js
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'dropify/dist/css/dropify.min.css';
import 'dropify/dist/js/dropify.min.js';
import { useQuasar } from 'quasar'; // Asegúrate de importar useQuasar
import { computed } from 'vue';

export default {
  components: {
    QPage, QInput, QBtn, QCard, QCardSection, QList, QItem, QItemSection, QItemLabel, QImg
  },
  setup() {
    const search = ref("");
    const propietarios = ref([]);
    const propietarioSeleccionado = ref(null);
    const mascotas = ref([]);
    const $q = useQuasar(); // Inicializa Quasar
    const allRazas = ref([]); // Inicializar como una lista vacía

    const buscarPropietarios = async () => {
      try {
        const response = await api.get('/personas-con-propietarios'); // Llama al endpoint corregido
        console.log("Respuesta del backend:", response.data); // Verifica los datos devueltos

        propietarios.value = response.data.filter(propietario => {
          const fullName = `${propietario.nombres} ${propietario.apellidos}`.toLowerCase();
          return (
            fullName.includes(search.value.toLowerCase()) ||
            propietario.ci?.includes(search.value) ||
            propietario.telefono?.includes(search.value)
          );
        });
      } catch (error) {
        console.error("Error buscando propietarios:", error);
        propietarios.value = [];
      }
    };





    const seleccionarPropietario = (propietario) => {
      console.log("Propietario seleccionado:", propietario);
      console.log("ID de la persona (persona_id):", propietario.persona_id);

      if (!propietario.persona_id) {
        console.error("El propietario no tiene un ID de persona asociado.");
        $q.notify({
          color: "red-5",
          textColor: "white",
          icon: "error",
          message: "El propietario seleccionado no tiene un ID de persona asociado.",
        });
        return;
      }

      propietarioSeleccionado.value = propietario;
      mascotas.value = [];
    };





    const mostrarMascotas = async () => {
      if (!propietarioSeleccionado.value || !propietarioSeleccionado.value.id) {
        console.error("Propietario no seleccionado o datos incompletos.");
        return;
      }

      try {
        const response = await api.get(`/propietario/${propietarioSeleccionado.value.id}/mascotas`);
        mascotas.value = (response.data || []).filter(mascota => mascota.estado === 1);

        // Obtener el nombre de la raza para cada mascota
        for (const mascota of mascotas.value) {
          const razaResponse = await api.get(`/mascota/${mascota.id}/raza`);
          mascota.raza = razaResponse.data?.nombre || "Sin raza"; // Usa el nombre de la raza
        }
      } catch (error) {
        console.error("Error obteniendo mascotas:", error);
        mascotas.value = [];
      }
    };




    const descargarPDF = async (mascota) => {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [110, 85] // Tamaño ajustado
      });

      // Fondo del carnet (anverso)
      doc.setFillColor(242, 242, 242); // Color
      doc.rect(0, 0, 110, 85, 'F'); // Relleno del

      // Encabezado del carnet (anverso)
      doc.setFillColor(0, 102, 204); // Azul elegante
      doc.rect(0, 0, 110, 15, 'F'); // Fondo del encabezado
      doc.setTextColor(255, 255, 255); // Texto blanco
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Carnet de Mascota', 55, 10, { align: 'center' }); // Título centrado

      // Imagen de la mascota
      const imgSrc = `/storage/${mascota.fotoFrontal}`;
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imgSrc;

      img.onload = async () => {
        doc.addImage(img, 'JPEG', 8, 20, 35, 35); // Tamaño ajustado y centrado

        // Información de la mascota
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text(`Mascota:`, 50, 22);
        doc.setFont('helvetica', 'normal');
        doc.text(`Nombre: ${mascota.nombre}`, 50, 26);
        doc.text(`Especie: ${mascota.especie}`, 50, 30);
        doc.text(`Raza: ${mascota.raza}`, 50, 34);
        doc.text(`Tamaño: ${mascota.tamanio}`, 50, 38);

        // Línea divisoria
        doc.setDrawColor(0, 102, 204);
        doc.line(45, 42, 100, 42); // Línea horizontal

        // Información del propietario
        doc.setFont('helvetica', 'bold');
        doc.text(`Propietario:`, 50, 46);
        doc.setFont('helvetica', 'normal');
        doc.text(`${propietarioSeleccionado.value.nombres} ${propietarioSeleccionado.value.apellidos}`, 50, 50);
        doc.text(`CI: ${propietarioSeleccionado.value.ci}`, 50, 54);
        doc.text(`Teléfono: ${propietarioSeleccionado.value.telefono}`, 50, 58);

        // Reverso - Historial de vacunas
        doc.addPage();

        // Fondo del reverso
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 110, 85, 'F');

        // Encabezado del reverso
        doc.setFillColor(0, 102, 204);
        doc.rect(0, 0, 110, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Historial de Vacunas', 55, 10, { align: 'center' });

        // Obtener historial de vacunas
        let historial = [];
        if (mascota && mascota.id) {
          try {
            const response = await api.get(`/mascota/${mascota.id}/historial-vacunas`);
            historial = response.data;

            // Conversión de motivo
            const motivoMap = {
              1: 'Menor a 3 meses',
              2: 'Gestación',
              3: 'Enfermedad grave',
              4: 'Ausente'
            };

            // Mostrar cada entrada de historial de vacunación
            doc.setTextColor(0, 0, 0);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(10);
            let yPosition = 20;

            historial.forEach((registro, index) => {
              const motivoTexto = motivoMap[registro.motivo] || ''; // Convertir motivo si existe

              doc.text(`${index + 1}. Estado: ${registro.estado === 1 ? 'Vacunado' : 'No Vacunado'}`, 8, yPosition);

              // Solo mostrar el motivo si existe
              if (registro.motivo) {
                doc.text(`Motivo: ${motivoTexto}`, 8, yPosition + 4);
                yPosition += 4; // Aumentar el espacio solo si se muestra el motivo
              }

              doc.text(`Campaña: ${registro.campania_nombre}`, 8, yPosition + 4);
              doc.text(`Fecha fin: ${registro.campania_fecha_fin}`, 8, yPosition + 8);
              yPosition += 20; // Espacio para el siguiente registro
            });

          } catch (error) {
            console.error('Error obteniendo historial de vacunas', error);
          }
        } else {
          console.error('La mascota no tiene un ID válido');
        }

        doc.save(`Carnet_Mascota_${mascota.nombre}.pdf`);
      };

      img.onerror = () => {
        const placeholder = new Image();
        placeholder.src = `${$storage.defaults.baseURL}/placeholder.png`; // Usa la URL base de storage
        placeholder.onload = () => {
          doc.addImage(placeholder, 'JPEG', 8, 20, 35, 35); // Imagen de reemplazo
          doc.setDrawColor(0, 102, 204);
          doc.rect(8, 20, 35, 35);
          doc.save(`Carnet_Mascota_${mascota.nombre}.pdf`);
        };
      };
    };

    const obtenerRazaPorMascota = async (mascotaId) => {
      try {
        // Usa la instancia `api` para obtener la raza de la mascota
        const response = await api.get(`/mascota/${mascotaId}/raza`);
        const raza = response.data.raza;
        console.log(`La raza de la mascota es: ${raza}`);
      } catch (error) {
        console.error("Error obteniendo la raza de la mascota:", error);
      }
    };
    const isModalPersonaOpen = ref(false); // Estado del modal
    const personaData = ref({
      nombres: "",
      apellidos: "",
      ci: "",
      celular: "",

    });

    const propietarioData = ref({
      direccion: "",
      observaciones: "",
      foto: null,
      latitud: -17.3939, // Coordenadas iniciales (puedes ajustarlas)
      longitud: -66.1568,
    });
    const editPersona = (propietario) => {
      console.log("Propietario a editar:", propietario);

      personaData.value = {
        nombres: propietario.nombres || "",
        apellidos: propietario.apellidos || "",
        ci: propietario.ci || "",
        celular: propietario.telefono || "",
      };

      propietarioData.value = {
        direccion: propietario.propietario?.direccion || "",
        observaciones: propietario.propietario?.observaciones || "",
        foto: propietario.foto || null,
        latitud: propietario.propietario?.latitud || "",
        longitud: propietario.propietario?.longitud || "",
      };

      initializeMap(propietarioData.value.latitud, propietarioData.value.longitud);
      isModalPersonaOpen.value = true;
    };







    const closeModalPersona = () => {
      if (map) {
        map.remove(); // Destruye el mapa
        map = null; // Limpia la referencia al mapa
      }
      isModalPersonaOpen.value = false; // Cierra el modal
    };


    const resetFormPersona = () => {
      // Limpia los campos del formulario
      personaData.value = {
        nombres: "",
        apellidos: "",
        ci: "",
        telefono: "",
      };

      propietarioData.value = {
        direccion: "",
        observaciones: "",
        foto: null,
        latitud: "",
        longitud: "",
      };
      // Resetear Dropify
      nextTick(() => {
        const dropifyElement = $("#foto").data("dropify");
        if (dropifyElement) {
          dropifyElement.resetPreview();
          dropifyElement.clearElement();
        }
      });
    };

    const submitEditPersona = async () => {
      try {
        if (!propietarioSeleccionado.value || !propietarioSeleccionado.value.persona_id) {
          throw new Error("El ID de la persona es requerido para continuar.");
        }

        console.log("Enviando datos al backend:", {
          personaData: personaData.value,
          propietarioData: propietarioData.value,
        });

        // Enviar la solicitud al backend
        const response = await api.put(`/personas/${propietarioSeleccionado.value.persona_id}`, {
          nombres: personaData.value.nombres,
          apellidos: personaData.value.apellidos,
          ci: personaData.value.ci,
          telefono: personaData.value.celular,
          direccion: propietarioData.value.direccion,
          observaciones: propietarioData.value.observaciones,
          latitud: propietarioData.value.latitud,
          longitud: propietarioData.value.longitud,
        });

        console.log("Respuesta del servidor:", response.data);
        $q.notify({
          type: "positive",
          message: "Persona y propietario actualizados correctamente.",
        });

        isModalPersonaOpen.value = false; // Cerrar el modal
        // Actualizar la lista de propietarios
        await buscarPropietarios();
        // Forzar recarga de la página

      } catch (error) {
        console.error("Error al enviar los datos:", error);
        $q.notify({
          type: "negative",
          message: "Error al actualizar los datos.",
        });
      }
    };


    const obtenerPropietarioPorPersona = async (personaId) => {
      try {
        const response = await api.get(`/persona/${personaId}/propietario`);
        console.log("Datos del propietario obtenidos:", response.data); // Para verificar
        propietarioSeleccionado.value = response.data; // Actualiza correctamente
      } catch (error) {
        console.error("Error obteniendo el propietario:", error);
        alert("No se pudo obtener el propietario de la persona.");
      }
    };

    const seleccionarPersona = (persona) => {
      obtenerPropietarioPorPersona(persona.id);
    };
    let map;
    let currentMarker;

    const initializeMap = (lat, lng) => {
      nextTick(() => {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
          console.error('El contenedor del mapa no está disponible');
          return;
        }

        // Verificar si el mapa ya está inicializado
        if (map) {
          map.remove(); // Destruye la instancia previa del mapa
          map = null; // Limpia la variable para evitar referencias residuales
        }

        // Inicializa un nuevo mapa
        map = L.map(mapContainer).setView([lat, lng], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors',
        }).addTo(map);

        // Agregar marcador inicial
        currentMarker = L.marker([lat, lng]).addTo(map);

        // Actualizar coordenadas al mover el marcador
        map.on('click', (e) => {
          propietarioData.value.latitud = e.latlng.lat;
          propietarioData.value.longitud = e.latlng.lng;

          if (currentMarker) {
            currentMarker.setLatLng([e.latlng.lat, e.latlng.lng]);
          } else {
            currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
          }
        });
      });
    };





    const handleModalOpen = () => {
      // Inicializa el mapa con las coordenadas actuales del propietario
      initializeMap(propietarioData.value.latitud, propietarioData.value.longitud);

      // Inicializa Dropify para el input de archivo
      nextTick(() => {
        const dropifyInput = $('.dropify');
        if (dropifyInput.data('dropify')) {
          dropifyInput.dropify().destroy(); // Destruye la instancia previa
        }
        dropifyInput.dropify(); // Reinstancia Dropify
      });
    };

    const dropifyDefaultFile = (foto) => {
      if (!foto) return '';
      return `${api.defaults.baseURL}/storage/${foto}`;
    };




    const initializeDropify = () => {
      nextTick(() => {
        const dropifyInputs = $('.dropify');
        dropifyInputs.each(function () {
          $(this).dropify().destroy(); // Destruye instancias existentes
          $(this).dropify(); // Crea una nueva instancia
        });
      });
    };
    const eliminarPersona = async () => {
      try {
        // Asegúrate de tener el `persona_id` del propietario seleccionado
        const personaId = propietarioSeleccionado.value.persona_id;

        if (!personaId) {
          $q.notify({
            type: "negative",
            message: "No se puede eliminar. ID de la persona no encontrado.",
          });
          return;
        }

        // Llamada al backend para cambiar el estado a 0
        await api.patch(`/personas/${personaId}/desactivar`);

        $q.notify({
          type: "positive",
          message: "Persona eliminada exitosamente.",
        });

        // Forzar recarga de la página
        window.location.reload();
      } catch (error) {
        console.error("Error al desactivar la persona:", error);
        $q.notify({
          type: "negative",
          message: "Error al eliminar la persona.",
        });
      }
    };

    const toggleEditarMascota = async (mascota) => {
      if (mascota.isEditing) {
        // Guardar cambios
        try {
          const response = await api.put(`/mascotas/${mascota.id}`, {
            nombre: mascota.nombre,
            especie: mascota.especie,
            raza: mascota.raza,
            tamanio: mascota.tamanio,
          });

          console.log("Mascota actualizada:", response.data);
          $q.notify({
            type: "positive",
            message: "Mascota actualizada correctamente.",
          });

          // Salir del modo de edición
          mascota.isEditing = false;
        } catch (error) {
          console.error("Error al guardar cambios en la mascota:", error);
          $q.notify({
            type: "negative",
            message: "Error al actualizar la mascota.",
          });
        }
      } else {
        // Entrar en modo de edición
        mascota.isEditing = true;
      }
    };

    const isModalEditMascotaOpen = ref(false); // Estado del modal de edición

    const mascotaEditData = ref({
      id: null,
      propietario: "",
      nombre: "",
      genero: "",
      especie: "",
      raza_id: "",
      color: "",
      rangoEdad: "",
      descripcion: "",
      tamanio: "",
      fotoFrontal: null,
      fotoLateral: null,
    });

    const openEditMascotaModal = async (mascota) => {
      if (!mascota || !propietarioSeleccionado.value) {
        console.error("Datos de mascota o propietario no disponibles.");
        return;
      }

      try {
        // Configurar datos de la mascota en el modal
        mascotaEditData.value = {
          id: mascota.id,
          propietario: `${propietarioSeleccionado.value.nombres} ${propietarioSeleccionado.value.apellidos}` || "",
          propietario_id: propietarioSeleccionado.value.id, // Asignar el ID del propietario
          nombre: mascota.nombre || "",
          genero: mascota.genero || "",
          especie: mascota.especie || "",
          raza_id: mascota.raza_id || null, // Asegurarse de cargar solo el ID de la raza
          color: mascota.color || "",
          rangoEdad: calcularEdad(mascota.rangoEdad), // Convertir fecha a edad
          descripcion: mascota.descripcion || "",
          tamanio: mascota.tamanio || "",
          fotoFrontal: mascota.fotoFrontal || null,
          fotoHorizontal: mascota.fotoHorizontal || null,
        };

        // Cargar las razas según la especie seleccionada
        await obtenerRazasPorTipo(mascota.especie);

        isModalEditMascotaOpen.value = true;
      } catch (error) {
        console.error("Error al cargar datos de la mascota:", error);
      }
    };

    const formData = new FormData();

    // Cerrar modal de edición
    const closeModalEditMascota = () => {
      isModalEditMascotaOpen.value = false;
    };

    const calcularFechaDesdeEdad = (edad) => {
      const hoy = new Date();
      const fechaNacimiento = new Date(hoy.setFullYear(hoy.getFullYear() - edad));
      return fechaNacimiento.toISOString().split("T")[0]; // Formato YYYY-MM-DD
    };

    const submitEditMascota = async () => {
      try {
        // Validar que la mascota tenga un ID
        if (!mascotaEditData.value.id) {
          throw new Error("El ID de la mascota es requerido para continuar.");
        }

        console.log("Enviando datos al backend:", {
          mascotaData: mascotaEditData.value,
        });

        // Calcular la fecha de nacimiento desde la edad
        const convertirEdadAFecha = (edad) => {
          const hoy = new Date();
          hoy.setFullYear(hoy.getFullYear() - edad);
          const month = String(hoy.getMonth() + 1).padStart(2, "0");
          const day = String(hoy.getDate()).padStart(2, "0");
          return `${hoy.getFullYear()}-${month}-${day}`;
        };

        const fechaDesdeEdad = convertirEdadAFecha(mascotaEditData.value.rangoEdad);
        console.log("Fecha de nacimiento calculada:", fechaDesdeEdad);

        // Crear payload con los datos de la mascota
        const payload = {
          nombre: mascotaEditData.value.nombre,
          genero: mascotaEditData.value.genero,
          especie: mascotaEditData.value.especie,
          raza_id: mascotaEditData.value.raza_id,
          color: mascotaEditData.value.color,
          descripcion: mascotaEditData.value.descripcion || "",
          tamanio: mascotaEditData.value.tamanio,
          rangoEdad: fechaDesdeEdad, // Enviar la fecha calculada
        };

        // Solo agregar imágenes si son nuevas
        if (mascotaEditData.value.fotoFrontal instanceof File) {
          payload.fotoFrontal = mascotaEditData.value.fotoFrontal;
        }
        if (mascotaEditData.value.fotoHorizontal instanceof File) {
          payload.fotoHorizontal = mascotaEditData.value.fotoHorizontal;
        }

        // Enviar solicitud al backend
        const response = await api.put(`/mascotas/${mascotaEditData.value.id}`, payload);

        console.log("Mascota actualizada correctamente:", response.data);

        $q.notify({
          type: "positive",
          message: "Mascota actualizada correctamente.",
        });

        isModalEditMascotaOpen.value = false; // Cerrar el modal
        await mostrarMascotas(); // Actualizar la lista de mascotas
      } catch (error) {
        console.error("Error al actualizar la mascota:", error.response?.data || error.message);
        $q.notify({
          type: "negative",
          message: "Error al actualizar la mascota.",
        });
      }
    };

    const filterRazas = (term, update) => {
      update(() => {
        filteredRazas.value = allRazas.value.filter((raza) =>
          raza.nombre.toLowerCase().includes(term.toLowerCase())
        );
      });
    };

    const obtenerRazasPorTipo = async (tipo) => {
      try {
        const tipoMap = { Perro: 0, Gato: 1 };
        const response = await api.get(`/getRazas?tipo=${tipoMap[tipo]}`);
        allRazas.value = response.data; // Asigna los datos obtenidos
      } catch (error) {
        console.error(`Error al obtener razas para tipo ${tipo}:`, error);
      }
    };

    const onEspecieChange = async (nuevaEspecie) => {
      console.log('Nueva especie seleccionada:', nuevaEspecie);
      await obtenerRazasPorTipo(nuevaEspecie); // Cargar razas de la especie seleccionada
      mascotaEditData.value.raza_id = null; // Resetea la raza cuando cambia la especie
    };
    const filteredRazas = computed(() => {
      return allRazas.value.filter((raza) => raza.especie === mascotaEditData.value.especie);
    });

    const calcularEdad = (fechaNacimiento) => {
      if (!fechaNacimiento) return 0; // Si no hay fecha, asumimos 0 años.

      const nacimiento = new Date(fechaNacimiento);
      const hoy = new Date();
      let edad = hoy.getFullYear() - nacimiento.getFullYear();

      // Ajustar si el cumpleaños aún no ha ocurrido este año
      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }

      return edad >= 0 ? edad : 0; // Devolver 0 si la edad es inválida
    };

    const onFileChange = (field, event) => {
      const file = event.target.files[0] || null;
      mascotaEditData.value[field] = file;
    };

    const getImgPreview = (field) => {
      const file = mascotaEditData.value[field];
      if (file instanceof File) {
        return URL.createObjectURL(file); // Vista previa local para archivos recién cargados
      } else if (file) {
        return `${api.defaults.baseURL}/storage/${file}`; // Imagen ya existente
      }
      return ''; // Retorna vacío si no hay imagen
    };

    return {
      search,
      propietarios,
      propietarioSeleccionado,
      mascotas,
      isModalPersonaOpen, // Asegúrate de incluir esto
      personaData,
      propietarioData,
      buscarPropietarios,
      seleccionarPropietario,
      mostrarMascotas,
      descargarPDF,
      editPersona, // Incluye esta función
      closeModalPersona,
      resetFormPersona,
      obtenerRazaPorMascota,
      submitEditPersona,
      obtenerPropietarioPorPersona,
      seleccionarPersona,
      initializeMap,
      handleModalOpen,
      dropifyDefaultFile,
      initializeDropify,
      eliminarPersona,
      toggleEditarMascota,
      submitEditMascota,
      openEditMascotaModal,
      isModalEditMascotaOpen,
      mascotaEditData, // Retornar al template
      onEspecieChange,
      filteredRazas,
      filterRazas,
      closeModalEditMascota,
      obtenerRazasPorTipo,
      allRazas,
      calcularEdad,
      onFileChange,
      getImgPreview
    };
  }
};
</script>

<style scoped>
.q-page {
  background-color: #f0f0f0;
}

.q-img {
  border-radius: 8px;
}

.q-btn {
  width: 100%;
  margin-bottom: 8px;
}

.foto-mascota {
  display: flex;
  justify-content: center;
}

.mascota-imagen {
  max-width: 150px;
  border-radius: 10px;
}

.full-width {
  width: 100%;
}

.mascota-imagen {
  max-width: 100px;
  max-height: 200px;
  border-radius: 10px;
  margin: 0 auto;
  /* Asegura que esté centrada */
  display: block;
  /* Para que tome el ancho completo en su contenedor */
}

.map {
  height: 300px;
  width: 100%;
}

.dropify-wrapper {
  border: 1px solid #dcdcdc;
  border-radius: 8px;
}

.dropify-message p {
  font-size: 14px;
  color: #666;
}
</style>

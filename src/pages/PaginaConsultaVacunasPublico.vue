<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Header con título y breve descripción -->
    <div class="text-center q-mb-lg">
      <div class="text-h4 text-primary q-mb-sm">Registro de Mascotas</div>
      <p class="text-grey-8 q-ma-none">Busca información sobre mascotas registradas y sus propietarios</p>
    </div>

    <!-- Buscador de Propietario con diseño mejorado -->
    <q-card class="search-container q-mb-md">
      <q-card-section>
        <div class="row items-center q-col-gutter-md">
          <div class="col-xs-12 col-sm-8 col-md-9">
            <q-input filled v-model="search" label="Buscar propietario"
              placeholder="Ingrese nombre, CI o teléfono del propietario" bg-color="white" standout class="search-input"
              @keyup.enter="buscarPropietarios">
              <template v-slot:prepend>
                <q-icon name="person_search" color="primary" />
              </template>
            </q-input>
          </div>
          <div class="col-xs-12 col-sm-4 col-md-3">
            <q-btn color="primary" icon-right="search" label="Buscar" @click="buscarPropietarios" class="full-width"
              unelevated rounded :loading="isSearching" />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Resultados de la búsqueda -->
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="propietarios.length > 0" class="q-mt-md">
        <q-card class="results-card">
          <q-card-section>
            <div class="text-h6 text-primary q-mb-md">Resultados de búsqueda</div>
            <q-list separator>
              <q-item v-for="propietario in propietarios" :key="propietario.id" clickable v-ripple
                @click="seleccionarPropietario(propietario)" class="propietario-item">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white">
                    {{ propietario.nombres.charAt(0).toUpperCase() }}{{ propietario.apellidos.charAt(0).toUpperCase() }}
                  </q-avatar>
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-medium">{{ propietario.nombres }} {{ propietario.apellidos
                    }}</q-item-label>
                  <q-item-label caption>
                    <div class="row items-center q-gutter-x-md">
                      <div><q-icon name="badge" size="xs" class="q-mr-xs" /> CI: {{ propietario.ci }}</div>
                      <div><q-icon name="phone" size="xs" class="q-mr-xs" /> {{ propietario.telefono }}</div>
                    </div>
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-icon name="chevron_right" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </transition>

    <!-- Mensaje de no resultados -->
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="noResults" class="text-center q-pa-xl">
        <q-icon name="search_off" size="64px" color="grey-6" />
        <div class="text-h6 q-mt-md text-grey-8">No se encontraron resultados</div>
        <p class="text-grey-7">Por favor intente con otros términos de búsqueda</p>
      </div>
    </transition>

    <!-- Perfil del Propietario Seleccionado -->
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="propietarioSeleccionado" class="q-my-md">
        <q-card class="owner-profile-card">
          <q-card-section class="bg-primary text-white">
            <div class="row items-center">
              <div class="col-auto q-mr-md">
                <q-avatar size="72px" color="white" text-color="primary" font-size="36px">
                  {{ propietarioSeleccionado.nombres.charAt(0).toUpperCase() }}{{
                    propietarioSeleccionado.apellidos.charAt(0).toUpperCase() }}
                </q-avatar>
              </div>
              <div class="col">
                <div class="text-h5">{{ propietarioSeleccionado.nombres }} {{ propietarioSeleccionado.apellidos }}</div>
                <div class="q-mt-sm">
                  <q-chip dense outline class="q-mr-sm bg-white text-primary">
                    <q-icon name="badge" left size="sm" />
                    <span>CI: {{ propietarioSeleccionado.ci }}</span>
                  </q-chip>
                  <q-chip dense outline class="bg-white text-primary">
                    <q-icon name="phone" left size="sm" />
                    <span>{{ propietarioSeleccionado.telefono }}</span>
                  </q-chip>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="center" class="q-py-md">
            <q-btn color="primary" icon="pets" label="Ver Mascotas Registradas" @click="mostrarMascotas"
              :loading="loadingMascotas" rounded unelevated class="full-width" style="max-width: 300px" />
          </q-card-actions>
        </q-card>
      </div>
    </transition>

    <!-- Lista de Mascotas del Propietario -->
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="mascotas.length > 0" class="q-mt-md">
        <div class="text-h6 text-primary q-mb-md">Mascotas registradas</div>
        <div class="row q-col-gutter-md">
          <div v-for="mascota in mascotas" :key="mascota.id" class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
            <q-card class="mascota-card">
              <q-img :src="`${$storage.defaults.baseURL}/${mascota.fotoFrontal}` || 'https://via.placeholder.com/150'"
                height="200px" fit="cover" class="mascota-imagen"
                placeholder-src="https://via.placeholder.com/150?text=Cargando...">
                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-grey-3">
                    <q-icon name="pets" size="50px" color="grey-7" />
                  </div>
                </template>
                <div class="absolute-bottom text-subtitle1 text-center bg-primary text-white q-pa-sm">
                  {{ mascota.nombre }}
                </div>
              </q-img>

              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12 col-sm-6">
                    <div class="text-caption text-grey-7">Especie</div>
                    <div class="text-body1">{{ mascota.especie }}</div>
                  </div>
                  <div class="col-xs-12 col-sm-6">
                    <div class="text-caption text-grey-7">Raza</div>
                    <div class="text-body1">{{ mascota.raza }}</div>
                  </div>
                  <div class="col-xs-12 q-mt-sm">
                    <div class="text-caption text-grey-7">Tamaño</div>
                    <div class="text-body1">{{ mascota.tamanio }}</div>
                  </div>
                </div>
              </q-card-section>

              <q-card-actions align="center" class="q-pa-md">
                <q-btn color="primary" icon="picture_as_pdf" label="Descargar Carnet" @click="descargarPDF(mascota)"
                  :loading="mascota.downloading" unelevated rounded class="full-width" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mensaje si no hay mascotas -->
    <transition appear enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-if="noMascotas" class="text-center q-pa-xl">
        <q-icon name="pets" size="64px" color="grey-6" />
        <div class="text-h6 q-mt-md text-grey-8">No hay mascotas registradas</div>
        <p class="text-grey-7">Este propietario no tiene mascotas asociadas en el sistema</p>
      </div>
    </transition>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue';
import { QPage, QInput, QBtn, QCard, QCardSection, QList, QItem, QItemSection, QItemLabel, QImg, QIcon, QAvatar, QCardActions, QChip } from 'quasar';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import { api } from 'src/boot/axios'; // Ruta al archivo axios.js
import { parseISO } from 'date-fns';

export default {
  components: {
    QPage, QInput, QBtn, QCard, QCardSection, QList, QItem, QItemSection, QItemLabel, QImg, QIcon, QAvatar, QCardActions, QChip
  },
  setup() {
    const search = ref("");
    const propietarios = ref([]);
    const propietarioSeleccionado = ref(null);
    const mascotas = ref([]);
    const isSearching = ref(false);
    const loadingMascotas = ref(false);
    const hasSearched = ref(false);

    // Estado computado para mostrar mensaje de no resultados
    const noResults = computed(() => {
      return hasSearched.value && propietarios.value.length === 0 && search.value.trim() !== "";
    });

    // Estado computado para mostrar mensaje de no mascotas
    const noMascotas = computed(() => {
      return propietarioSeleccionado.value && mascotas.value.length === 0 && loadingMascotas.value === false;
    });

    const buscarPropietarios = async () => {
      if (!search.value.trim()) {
        propietarios.value = [];
        hasSearched.value = false;
        return;
      }

      isSearching.value = true;
      hasSearched.value = true;

      try {
        const response = await api.get('/buscar-personas', {
          params: { q: search.value }
        });
        propietarios.value = response.data;
        propietarioSeleccionado.value = null;
        mascotas.value = [];
      } catch (error) {
        propietarios.value = [];
      } finally {
        isSearching.value = false;
      }
    };

    const seleccionarPropietario = (propietario) => {
      propietarioSeleccionado.value = propietario;
      mascotas.value = [];
    };

    const mascotaImage = async (fotoFrontal) => {
      try {
        const response = await $storage.get(`/${fotoFrontal}`, { responseType: 'blob' });
        return URL.createObjectURL(response.data);
      } catch (error) {
        return 'https://via.placeholder.com/150';
      }
    };

    const obtenerHistorialVacunas = async (mascotaId) => {
      try {
        const response = await api.get(`/mascota/${mascotaId}/historial-vacunas`);
        return response.data;
      } catch (error) {
        return [];
      }
    };

    const mostrarMascotas = async () => {
      if (propietarioSeleccionado.value) {
        loadingMascotas.value = true;

        try {
          const response = await api.get(`/propietario/${propietarioSeleccionado.value.id}/mascotas`);

          // Añadimos la propiedad downloading para controlar el estado del botón
          const mascotasConEstado = response.data.map(mascota => ({
            ...mascota,
            downloading: false
          }));

          mascotas.value = mascotasConEstado;

          // Recorremos cada mascota para obtener su raza
          for (let mascota of mascotas.value) {
            try {
              const razaResponse = await api.get(`/mascota/${mascota.id}/raza`);
              mascota.raza = razaResponse.data.raza;
            } catch (error) {
              mascota.raza = 'No especificada';
            }
          }
        } catch (error) {
          mascotas.value = [];
        } finally {
          loadingMascotas.value = false;
        }
      }
    };

    const descargarPDF = async (mascota) => {
      // Establecer estado de descarga
      mascota.downloading = true;

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [110, 85], // Tamaño ajustado
      });

      // Fondo del carnet (anverso)
      doc.setFillColor(242, 242, 242);
      doc.rect(0, 0, 110, 85, 'F');

      // Encabezado del carnet (anverso)
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, 110, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('Carnet de Mascota', 55, 10, { align: 'center' });

      try {
        // Obtén la URL de la imagen o usa un placeholder
        const imgSrc = await obtenerImagen(mascota.fotoFrontal);

        // Agrega la imagen al PDF
        doc.addImage(imgSrc, 'JPEG', 8, 20, 35, 35);

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

        doc.setDrawColor(0, 102, 204);
        doc.line(45, 42, 100, 42);

        // Información del propietario
        doc.setFont('helvetica', 'bold');
        doc.text(`Propietario:`, 50, 46);
        doc.setFont('helvetica', 'normal');
        doc.text(`${propietarioSeleccionado.value.nombres} ${propietarioSeleccionado.value.apellidos}`, 50, 50);
        doc.text(`CI: ${propietarioSeleccionado.value.ci}`, 50, 54);
        doc.text(`Teléfono: ${propietarioSeleccionado.value.telefono}`, 50, 58);

        // Reverso - Historial de vacunas
        doc.addPage();

        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 110, 85, 'F');

        doc.setFillColor(0, 102, 204);
        doc.rect(0, 0, 110, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('Historial de Vacunas', 55, 10, { align: 'center' });

        const historial = await obtenerHistorialVacunas(mascota.id);

        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);

        let yPosition = 20;
        historial.forEach((registro, index) => {
          // Verificar si la fecha está presente y válida
          const fechaValida = registro.created_at && !isNaN(new Date(registro.created_at));
          const fechaFormateada = fechaValida
            ? registro.created_at.split('T')[0] // Obtiene solo la parte `YYYY-MM-DD`
            : "Fecha inválida";
          // Agregar información al PDF
          doc.text(`${index + 1}. Estado: ${registro.estado === 1 ? 'Vacunado' : 'No Vacunado'}`, 8, yPosition);
          doc.text(`Fecha vacunación: ${fechaFormateada}`, 8, yPosition + 4);

          if (registro.motivo) {
            const motivoMap = {
              1: 'Menor a 3 meses',
              2: 'Gestación',
              3: 'Enfermedad grave',
              4: 'Ausente',
            };

            doc.text(`Motivo: ${motivoMap[registro.motivo] || 'No especificado'}`, 8, yPosition + 8);
            yPosition += 4; // Aumenta espacio si se agregó un motivo
          }

          doc.text(`Campaña: ${registro.campania_nombre}`, 8, yPosition + 8);
          yPosition += 16; // Espacio para el siguiente registro
        });

        // Guarda el PDF
        doc.save(`Carnet_Mascota_${mascota.nombre}.pdf`);
      } catch (error) {
        alert('No se pudo generar el PDF, inténtalo nuevamente.');
      } finally {
        // Restaurar estado de descarga
        mascota.downloading = false;
      }
    };

    const obtenerRazaPorMascota = async (mascotaId) => {
      try {
        const response = await api.get(`/mascota/${mascotaId}/raza`);
        const raza = response.data.raza;
        return raza;
      } catch (error) {
        return 'No especificada';
      }
    };

    const obtenerImagen = async (ruta) => {
      try {
        const response = await api.get(`/storage/${ruta}`, { responseType: 'blob' });
        return URL.createObjectURL(response.data);
      } catch (error) {
        return '/storage/placeholder.png';
      }
    };

    return {
      search,
      propietarios,
      propietarioSeleccionado,
      mascotas,
      isSearching,
      loadingMascotas,
      noResults,
      noMascotas,
      obtenerRazaPorMascota,
      buscarPropietarios,
      seleccionarPropietario,
      mostrarMascotas,
      descargarPDF,
      obtenerImagen
    };
  }
};
</script>

<style scoped>
.q-page {
  background-color: #f7f7f7;
  min-height: 100vh;
}

.search-container {
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
}

.search-container:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.results-card,
.owner-profile-card,
.mascota-card {
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.results-card:hover,
.owner-profile-card:hover,
.mascota-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.mascota-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.mascota-imagen {
  transition: transform 0.5s ease;
}

.mascota-card:hover .mascota-imagen {
  transform: scale(1.05);
}

.propietario-item {
  transition: background-color 0.2s ease;
}

.propietario-item:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.full-width {
  width: 100%;
}

/* Animaciones */
.animated {
  animation-duration: 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

.fadeIn {
  animation-name: fadeIn;
}

.fadeOut {
  animation-name: fadeOut;
}

/* Responsive adjustments */
@media (max-width: 599px) {
  .search-input {
    width: 100%;
  }
}
</style>

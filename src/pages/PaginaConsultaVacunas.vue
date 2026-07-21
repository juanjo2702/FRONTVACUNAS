<template>
  <q-page class="q-pa-md bg-grey-1">
    <!-- Encabezado con título -->
    <div class="text-h5 text-primary q-mb-md">Búsqueda de Propietarios y Mascotas</div>

    <!-- Buscador de Propietario Mejorado -->
    <q-card class="q-mb-md search-card">
      <q-card-section>
        <div class="row items-center">
          <div class="col-grow">
            <q-input
              filled
              v-model="search"
              label="Buscar propietario"
              class="no-border"
              placeholder="Ingrese nombre, apellido o CI del propietario"
              bg-color="white"
              standout
              dense
            >
              <template v-slot:append>
                <q-icon name="search" class="cursor-pointer" @click="buscarPropietarios" />
              </template>
            </q-input>
          </div>
          <div class="col-auto q-ml-sm">
            <q-btn
              color="primary"
              icon="search"
              label="Buscar"
              @click="buscarPropietarios"
              unelevated
              rounded
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Resultados de Búsqueda Mejorados -->
    <div v-if="propietarios.length > 0" class="q-mt-md">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Resultados de búsqueda</div>
      <q-card class="search-results">
        <q-list separator>
          <q-item
            v-for="propietario in propietarios"
            :key="propietario.id"
            clickable
            v-ripple
            @click="seleccionarPropietario(propietario)"
            class="propietario-item"
          >
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white">
                {{ propietario.nombres.charAt(0) }}{{ propietario.apellidos.charAt(0) }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium">{{ propietario.nombres }} {{ propietario.apellidos }}</q-item-label>
              <q-item-label caption class="row items-center">
                <q-icon name="badge" size="xs" class="q-mr-xs" /> CI: {{ propietario.ci }}
                <q-separator vertical spaced class="q-mx-sm" />
                <q-icon name="phone" size="xs" class="q-mr-xs" /> {{ propietario.telefono }}
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-icon name="chevron_right" color="grey-7" />
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <!-- Perfil del Propietario Seleccionado Mejorado -->
    <div v-if="propietarioSeleccionado" class="q-my-md">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Información del Propietario</div>
      <q-card class="profile-card">
        <q-card-section class="bg-primary text-white">
          <div class="row items-center">
            <div class="col-auto q-mr-md">
              <q-avatar size="72px" color="white" text-color="primary" font-size="40px">
                {{ propietarioSeleccionado.nombres.charAt(0) }}{{ propietarioSeleccionado.apellidos.charAt(0) }}
              </q-avatar>
            </div>
            <div class="col">
              <div class="text-h6">{{ propietarioSeleccionado.nombres }} {{ propietarioSeleccionado.apellidos }}</div>
              <div class="q-mt-sm row items-center">
                <q-chip dense outline class="q-mr-sm">
                  <q-icon name="badge" left size="sm" />
                  <span>CI: {{ propietarioSeleccionado.ci }}</span>
                </q-chip>
                <q-chip dense outline>
                  <q-icon name="phone" left size="sm" />
                  <span>{{ propietarioSeleccionado.telefono }}</span>
                </q-chip>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            color="primary"
            icon="pets"
            label="Ver Mascotas"
            @click="mostrarMascotas"
            unelevated
            rounded
          />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Lista de Mascotas Mejorada -->
    <div v-if="mascotas.length > 0" class="q-mt-md">
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Mascotas Registradas</div>
      <div class="row q-col-gutter-md">
        <div
          v-for="mascota in mascotas"
          :key="mascota.id"
          class="col-xs-12 col-sm-6 col-md-4"
        >
          <q-card class="mascota-card">
            <q-img
              :src="`${$storage.defaults.baseURL}/${mascota.fotoFrontal}` || 'https://via.placeholder.com/150'"
              height="200px"
              fit="cover"
              class="mascota-imagen"
              placeholder-src="https://via.placeholder.com/150?text=Cargando..."
            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-negative text-white">
                  <q-icon name="error" size="24px" />
                </div>
              </template>
              <div class="absolute-bottom text-subtitle1 text-center bg-dark q-pa-sm opacity-80">
                {{ mascota.nombre }}
              </div>
            </q-img>

            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-6">
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon color="primary" name="pets" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Especie</q-item-label>
                      <q-item-label>{{ mascota.especie }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-6">
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon color="primary" name="category" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Raza</q-item-label>
                      <q-item-label>{{ mascota.raza }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
                <div class="col-12">
                  <q-item dense>
                    <q-item-section avatar>
                      <q-icon color="primary" name="straighten" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label caption>Tamaño</q-item-label>
                      <q-item-label>{{ mascota.tamanio }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </div>
              </div>
            </q-card-section>

            <q-card-actions align="center" class="q-pb-md">
              <q-btn
                color="primary"
                icon="picture_as_pdf"
                label="Descargar Carnet"
                @click="descargarPDF(mascota)"
                unelevated
                rounded
                class="full-width"
              />
            </q-card-actions>
          </q-card>
        </div>
      </div>
    </div>

    <!-- Mensaje si no hay resultados -->
    <div v-if="propietarios.length === 0 && search.length > 0" class="text-center q-pa-lg">
      <q-icon name="search_off" size="56px" color="grey-7" />
      <div class="text-h6 q-mt-sm text-grey-7">No se encontraron resultados</div>
      <div class="text-body2 text-grey-7">Intente con otro término de búsqueda</div>
    </div>

    <!-- Mensaje si no hay mascotas -->
    <div v-if="propietarioSeleccionado && mascotas.length === 0 && mostrandoMascotas" class="text-center q-pa-lg">
      <q-icon name="pets" size="56px" color="grey-7" />
      <div class="text-h6 q-mt-sm text-grey-7">No hay mascotas registradas</div>
      <div class="text-body2 text-grey-7">Este propietario no tiene mascotas asociadas</div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { QPage, QInput, QBtn, QCard, QCardSection, QList, QItem, QItemSection, QItemLabel, QImg, QIcon, QAvatar, QCardActions, QChip, QSeparator } from 'quasar';
import jsPDF from 'jspdf';
import autoTable from "jspdf-autotable";
import { api } from 'src/boot/axios'; // Ruta al archivo axios.js
import { parseISO } from 'date-fns';

export default {
  components: {
    QPage, QInput, QBtn, QCard, QCardSection, QList, QItem, QItemSection, QItemLabel, QImg, QIcon, QAvatar, QCardActions, QChip, QSeparator
  },
  setup() {
    const search = ref("");
    const propietarios = ref([]);
    const propietarioSeleccionado = ref(null);
    const mascotas = ref([]);
    const mostrandoMascotas = ref(false);

    const buscarPropietarios = async () => {
      if (!search.value.trim()) {
        propietarios.value = [];
        return;
      }

      try {
        const response = await api.get('/buscar-personas', {
          params: { q: search.value }
        });
        propietarios.value = response.data;
        propietarioSeleccionado.value = null;
        mascotas.value = [];
        mostrandoMascotas.value = false;
      } catch (error) {
        propietarios.value = [];
      }
    };

    const seleccionarPropietario = (propietario) => {
      propietarioSeleccionado.value = propietario;
      mascotas.value = [];
      mostrandoMascotas.value = false;
    };

    const mascotaImage = async (fotoFrontal) => {
      try {
        const response = await $storage.get(`/${fotoFrontal}`, { responseType: 'blob' });
        return URL.createObjectURL(response.data); // Convierte el blob en una URL usable por el navegador
      } catch (error) {
        return 'https://via.placeholder.com/150'; // Retorna un placeholder si ocurre un error
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
        try {
          // Usar la instancia `api` para obtener las mascotas
          const response = await api.get(`/propietario/${propietarioSeleccionado.value.id}/mascotas`);
          mascotas.value = response.data;
          mostrandoMascotas.value = true;

          // Recorremos cada mascota para obtener su raza
          for (let mascota of mascotas.value) {
            const razaResponse = await api.get(`/mascota/${mascota.id}/raza`);
            mascota.raza = razaResponse.data.raza; // Asignamos la raza a cada mascota
          }
        } catch (error) {
          mostrandoMascotas.value = true;
        }
      }
    };

    const descargarPDF = async (mascota) => {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: [110, 85], // Tamaño ajustado
      });

      const agregarTextoConSalto = (texto, x, y, maxWidth = 90) => {
        const lineas = doc.splitTextToSize(texto, maxWidth);
        lineas.forEach((linea, index) => {
          doc.text(linea, x, y + index * 4); // Salto de línea cada 4mm
        });
      };

      doc.setFillColor(242, 242, 242);
      doc.rect(0, 0, 110, 85, 'F');

      // Encabezado del carnet (anverso)
      doc.setFillColor(0, 102, 204);
      doc.rect(0, 0, 110, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(16);
      doc.text('Carnet de Mascota', 55, 10, { align: 'center' });

      try {
        const imgSrc = await obtenerImagen(mascota.fotoFrontal);

        doc.addImage(imgSrc, 'JPEG', 8, 20, 35, 35);

        // Información de la mascota
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        agregarTextoConSalto(`Mascota:`, 50, 22);
        agregarTextoConSalto(`Nombre: ${mascota.nombre}`, 50, 26);
        agregarTextoConSalto(`Especie: ${mascota.especie}`, 50, 30);
        agregarTextoConSalto(`Raza: ${mascota.raza}`, 50, 34);
        agregarTextoConSalto(`Tamaño: ${mascota.tamanio}`, 50, 38);

        doc.setDrawColor(0, 102, 204);
        doc.line(45, 42, 100, 42);

        // Información del propietario
        agregarTextoConSalto(`Propietario:`, 50, 46);
        agregarTextoConSalto(`${propietarioSeleccionado.value.nombres} ${propietarioSeleccionado.value.apellidos}`, 50, 50);
        agregarTextoConSalto(`CI: ${propietarioSeleccionado.value.ci}`, 50, 54);
        agregarTextoConSalto(`Teléfono: ${propietarioSeleccionado.value.telefono}`, 50, 58);

        // Reverso - Historial de vacunas
        doc.addPage();
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 110, 85, 'F');

        doc.setFillColor(0, 102, 204);
        doc.rect(0, 0, 110, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(16);
        doc.text('Historial de Vacunas', 55, 10, { align: 'center' });

        const historial = await obtenerHistorialVacunas(mascota.id);

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);

        let yPosition = 20;
        const motivoMap = {
          1: 'Casa cerrada',
          2: 'Ausente',
          3: 'Otros',
        };

        historial.forEach((registro, index) => {
          const fechaValida = registro.created_at && !isNaN(new Date(registro.created_at));
          const fechaFormateada = fechaValida
            ? registro.created_at.split('T')[0]
            : "Fecha inválida";

          agregarTextoConSalto(`${index + 1}. Estado: ${registro.estado === 1 ? 'Vacunado' : 'No Vacunado'}`, 8, yPosition);
          agregarTextoConSalto(`Fecha vacunación: ${fechaFormateada}`, 8, yPosition + 4);

          if (registro.motivo) {
            agregarTextoConSalto(`Motivo: ${motivoMap[registro.motivo] || 'No especificado'}`, 8, yPosition + 8);
            yPosition += 4;
          }

          if (registro.descripcion) {
            agregarTextoConSalto(`Descripción: ${registro.descripcion}`, 8, yPosition + 8);
            yPosition += 4;
          }

          agregarTextoConSalto(`Campaña: ${registro.campania_nombre}`, 8, yPosition + 8);
          yPosition += 16;
        });

        doc.save(`Carnet_Mascota_${mascota.nombre}.pdf`);
      } catch (error) {
        alert('No se pudo generar el PDF, inténtalo nuevamente.');
      }
    };

    const obtenerRazaPorMascota = async (mascotaId) => {
      try {
        // Usa la instancia `api` para obtener la raza de la mascota
        const response = await api.get(`/mascota/${mascotaId}/raza`);
        const raza = response.data.raza;
      } catch (error) {
      }
    };

    const obtenerImagen = async (ruta) => {
      try {
        const response = await api.get(`/storage/${ruta}`, { responseType: 'blob' });
        return URL.createObjectURL(response.data); // Devuelve la URL para usarla en la imagen
      } catch (error) {
        return '/storage/placeholder.png'; // Imagen de respaldo en caso de error
      }
    };

    return {
      search,
      propietarios,
      propietarioSeleccionado,
      mascotas,
      mostrandoMascotas,
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

.search-card, .profile-card, .mascota-card, .search-results {
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.search-card:hover, .profile-card:hover, .mascota-card:hover {
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.mascota-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.mascota-imagen {
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  transition: transform 0.5s;
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

.no-border .q-field__native {
  padding-left: 0;
}

.full-width {
  width: 100%;
}

@media (max-width: 599px) {
  .q-card-section {
    padding: 12px;
  }

  .q-avatar {
    font-size: 16px;
  }
}
</style>

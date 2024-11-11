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

            <div class="col-8">
              <div class="q-mb-md">
                <q-input filled v-model="mascota.nombre" label="Nombre del Perro" disable />
              </div>
              <div class="q-mb-md">
                <q-input filled v-model="mascota.especie" label="Especie" disable />
              </div>
              <div class="q-mb-md">
                <q-input filled v-model="mascota.raza" label="Raza" disable />
              </div>
              <div class="q-mb-md">
                <q-input filled v-model="mascota.tamanio" label="Tamaño" disable />
              </div>
              <!-- Botón para descargar PDF -->
              <div class="q-mt-md">
                <q-btn color="primary" label="Descargar PDF" @click="descargarPDF(mascota)" class="full-width" />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import { QPage, QInput, QBtn, QCard, QCardSection, QList, QItem, QItemSection, QItemLabel, QImg } from 'quasar';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { api } from 'src/boot/axios'; // Ruta al archivo axios.js

export default {
  components: {
    QPage, QInput, QBtn, QCard, QCardSection, QList, QItem, QItemSection, QItemLabel, QImg
  },
  setup() {
    const search = ref("");
    const propietarios = ref([]);
    const propietarioSeleccionado = ref(null);
    const mascotas = ref([]);

    const buscarPropietarios = async () => {
      try {
        const response = await api.get('/buscar-personas', {
          params: { q: search.value }
        });
        propietarios.value = response.data;
        propietarioSeleccionado.value = null;
        mascotas.value = [];
      } catch (error) {
        console.error("Error buscando propietarios:", error);
        propietarios.value = [];
      }
    };

    const seleccionarPropietario = (propietario) => {
      propietarioSeleccionado.value = propietario;
      mascotas.value = [];
    };

    const mostrarMascotas = async () => {
      if (propietarioSeleccionado.value) {
        try {
          // Usar la instancia `api` para obtener las mascotas
          const response = await api.get(`/propietario/${propietarioSeleccionado.value.id}/mascotas`);
          mascotas.value = response.data;

          // Recorremos cada mascota para obtener su raza
          for (let mascota of mascotas.value) {
            const razaResponse = await api.get(`/mascota/${mascota.id}/raza`);
            mascota.raza = razaResponse.data.raza; // Asignamos la raza a cada mascota
          }
          console.log(mascotas.value); // Verifica que "raza" y "tamaño" estén presentes
        } catch (error) {
          console.error("Error obteniendo mascotas:", error);
        }
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

    return {
      search,
      propietarios,
      propietarioSeleccionado,
      mascotas,
      obtenerRazaPorMascota,
      buscarPropietarios,
      seleccionarPropietario,
      mostrarMascotas,
      descargarPDF
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
</style>

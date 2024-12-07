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
import autoTable from "jspdf-autotable";
import { api } from 'src/boot/axios'; // Ruta al archivo axios.js
import { parseISO } from 'date-fns';
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

    const mascotaImage = async (fotoFrontal) => {
      try {
        const response = await $storage.get(`/${fotoFrontal}`, { responseType: 'blob' });
        return URL.createObjectURL(response.data); // Convierte el blob en una URL usable por el navegador
      } catch (error) {
        console.error("Error obteniendo la imagen:", error);
        return 'https://via.placeholder.com/150'; // Retorna un placeholder si ocurre un error
      }
    };


    const obtenerHistorialVacunas = async (mascotaId) => {
      try {
        const response = await api.get(`/mascota/${mascotaId}/historial-vacunas`);
        console.log('Historial recibido:', response.data);
        return response.data;
      } catch (error) {
        console.error('Error al obtener el historial de vacunación:', error);
        return [];
      }
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
        console.error("Error generando el PDF:", error);
        alert('No se pudo generar el PDF, inténtalo nuevamente.');
      }
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
    const obtenerImagen = async (ruta) => {
      try {
        const response = await api.get(`/storage/${ruta}`, { responseType: 'blob' });
        return URL.createObjectURL(response.data); // Devuelve la URL para usarla en la imagen
      } catch (error) {
        console.error("Error obteniendo la imagen:", error);
        return '/storage/placeholder.png'; // Imagen de respaldo en caso de error
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
      descargarPDF,
      obtenerImagen
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

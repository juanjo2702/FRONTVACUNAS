<template>
  <q-page padding>
    <q-form @submit.prevent="submitForm">
      <div class="row items-center">
        <!-- Selector para buscar propietario -->
        <q-select v-model="selectedPropietario" :options="propietarios" option-label="nombre" option-value="id"
          label="Buscar propietario" use-input fill-input @filter="filterPropietario" clearable use-chips
          class="col-grow">
          <template v-slot:selected-item="scope">
            <q-chip removable @remove="selectedPropietario = null">
              {{ scope.opt.nombre }}
            </q-chip>
          </template>
        </q-select>

        <!-- Botón para buscar mascotas del propietario -->
        <q-btn label="Buscar Mascotas" color="primary" @click="submitForm" class="q-ml-md" />
      </div>

      <!-- Información del propietario -->
      <div v-if="propietarioData">
        <q-card class="q-ma-md">
          <q-card-section>
            <div>
              <strong>Nombre:</strong> {{ propietarioData.nombre }}
            </div>
            <div>
              <strong>Dirección:</strong> {{ propietarioData.direccion }}
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- Lista de mascotas -->
      <div v-if="mascotas.length > 0">
        <q-table :rows="mascotas" :columns="columns" row-key="id" title="Mascotas del propietario">
          <template v-slot:body-cell-acciones="props">
            <q-td align="center">
              <q-btn label="Generar PDF" color="primary" @click="generarPDF(props.row)" />
            </q-td>
          </template>
        </q-table>
      </div>

      <!-- Mensaje cuando no hay mascotas -->
      <div v-else>
        <q-card class="q-ma-md">
          <q-card-section>
            <div>
              No hay mascotas registradas para este propietario.
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { ref } from 'vue';
import jsPDF from 'jspdf'; // Importamos jsPDF
import perroFoto from 'src/img/prueba.jpg'; // Importa la imagen desde la carpeta local

export default {
  setup() {
    const selectedPropietario = ref(null);   // Guardamos el objeto propietario seleccionado
    const propietarios = ref([]);
    const propietarioData = ref(null);
    const mascotas = ref([]);

    // Definición de las columnas de la tabla
    const columns = [
      { name: 'nombre', required: true, label: 'Nombre', align: 'left', field: 'nombre' },
      { name: 'especie', label: 'Especie', align: 'left', field: 'especie' },
      { name: 'genero', label: 'Género', align: 'left', field: 'genero' },
      { name: 'fechaNacimiento', label: 'Fecha de Nacimiento', align: 'left', field: 'fechaNacimiento' },
      { name: 'acciones', label: 'Acciones', align: 'center' }
    ];

    // Función para simular el filtrado de propietarios
    const filterPropietario = (val, update) => {
      if (val === '') {
        update(() => {
          propietarios.value = [];
        });
        return;
      }

      // Simula que existe un propietario cuando se busca "123"
      if (val === '123') {
        update(() => {
          propietarios.value = [
            { id: 1, nombre: 'Juan Pérez', direccion: 'Calle Falsa 123' }
          ];
        });
      } else {
        update(() => {
          propietarios.value = [];
        });
      }
    };

    // Simula la obtención de datos del propietario y sus mascotas
    const fetchPropietarioData = () => {
      if (selectedPropietario.value) {
        const propietario = selectedPropietario.value;

        // Actualiza los datos del propietario
        propietarioData.value = {
          id: propietario.id,
          nombre: propietario.nombre,
          direccion: propietario.direccion
        };

        // Simula mascotas con foto y vacunación para "Juan Pérez"
        if (propietario.id === 1) {
          mascotas.value = [
            { id: 1, nombre: 'Rex', especie: 'Perro', genero: 'Macho', fechaNacimiento: '2016-05-20', vacunado: true, foto: perroFoto },
            { id: 2, nombre: 'Milo', especie: 'Perro', genero: 'Macho', fechaNacimiento: '2019-02-10', vacunado: false, foto: perroFoto } // Usa la misma foto para todas las mascotas por ahora
          ];
        } else {
          mascotas.value = []; // Si no hay mascotas para otros propietarios
        }
      }
    };

    // Convertir la imagen a base64 usando FileReader
    const convertirImagenABase64 = (imagen, callback) => {
      const reader = new FileReader();
      reader.onload = () => {
        callback(reader.result); // Retorna la imagen en formato base64
      };
      reader.readAsDataURL(imagen);
    };

    // Función para generar PDF tipo carnet
    const generarPDF = (mascota) => {
      const doc = new jsPDF();

      // Centrar el título
      doc.setFontSize(16);
      doc.text('Carnet de la Mascota', 105, 10, null, null, 'center');

      // Información del propietario
      doc.setFontSize(12);
      doc.text(`Propietario: ${propietarioData.value.nombre}`, 10, 30);
      doc.text(`Domicilio: ${propietarioData.value.direccion}`, 10, 40);

      // Información de la mascota
      doc.text(`Nombre de la mascota: ${mascota.nombre}`, 10, 50);
      doc.text(`Especie: ${mascota.especie}`, 10, 60);
      doc.text(`Género: ${mascota.genero}`, 10, 70);
      doc.text(`Fecha de Nacimiento: ${mascota.fechaNacimiento}`, 10, 80);
      doc.text(`Vacunado: ${mascota.vacunado ? 'Sí' : 'No'}`, 10, 90);

      // Convertir la imagen a base64 y agregarla al PDF
      fetch(perroFoto)
        .then(res => res.blob())
        .then(blob => {
          convertirImagenABase64(blob, (base64Imagen) => {
            doc.addImage(base64Imagen, 'JPEG', 150, 30, 50, 50); // Agregamos la imagen como base64
            doc.save(`${mascota.nombre}_carnet.pdf`);
          });
        });
    };

    // Función que se ejecuta al presionar el botón "Buscar Mascotas"
    const submitForm = () => {
      fetchPropietarioData();
    };

    return {
      selectedPropietario,
      propietarios,
      propietarioData,
      mascotas,
      columns,
      filterPropietario,
      submitForm,
      generarPDF
    };
  }
};
</script>

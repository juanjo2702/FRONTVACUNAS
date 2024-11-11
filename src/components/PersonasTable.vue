<template>
  <q-table :rows="personas" :columns="columns" row-key="propietario_id">
    <!-- Imagen de la persona -->
    <template v-slot:body-cell-foto="props">
      <q-td align="center">
        <img v-if="props.row.foto" :src="getStorageUrl(props.row.foto)" style="max-height: 100px;" />
        <span v-else>No image available</span>
      </q-td>
    </template>
    <!-- Acciones: Editar y Eliminar -->
    <template v-slot:body-cell-actions="props">
      <q-td align="center">
        <q-btn flat icon="edit" color="primary" @click="editPersona(props.row)" />
        <q-btn flat icon="delete" color="negative" @click="deletePersona(props.row)" />
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { defineProps } from 'vue';

// Recibe la lista de personas desde el componente padre (PaginaRegistros.vue)
const props = defineProps({
  personas: {
    type: Array,
    default: () => []  // Inicializa como array vacío si no hay datos
  }
});

// Columnas de la tabla
const columns = [
  { name: 'nombres_apellidos', label: 'Nombres y Apellidos', field: 'nombres_apellidos', align: 'center' },
  { name: 'ci', label: 'CI', field: 'ci', align: 'center' },
  { name: 'telefono', label: 'Teléfono', field: 'telefono', align: 'center' },
  { name: 'foto', label: 'Foto', field: 'foto', align: 'center' },
  { name: 'actions', label: 'Acciones', align: 'center' }
];

// Función para obtener la URL de la imagen
const getStorageUrl = (path) => `http://localhost:8000${path}`;

// Métodos de editar y eliminar
const editPersona = (persona) => {
  console.log('Editar persona:', persona);
};

const deletePersona = (persona) => {
  console.log('Eliminar persona:', persona);
};
</script>

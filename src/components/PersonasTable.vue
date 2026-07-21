<template>
  <q-table :rows="personas" :columns="columns" row-key="propietario_id" flat bordered class="shadow-2 rounded-borders">
    <!-- Imagen de la persona -->
    <template v-slot:body-cell-foto="props">
      <q-td align="center">
        <q-avatar size="60px" class="shadow-1" v-if="props.row.foto">
          <q-img :src="getStorageUrl(props.row.foto)" loading="lazy" spinner-color="primary" style="height: 100%; width: 100%; object-fit: cover;">
            <template v-slot:error>
              <div class="absolute-full flex flex-center bg-negative text-white text-caption">
                <q-icon name="broken_image" size="24px" />
              </div>
            </template>
          </q-img>
        </q-avatar>
        <q-avatar size="60px" color="grey-3" text-color="grey-7" icon="person" v-else />
      </q-td>
    </template>
    <!-- Acciones: Editar y Eliminar -->
    <template v-slot:body-cell-actions="props">
      <q-td align="center">
        <q-btn round flat icon="edit" color="primary" @click="editPersona(props.row)">
          <q-tooltip>Editar Persona</q-tooltip>
        </q-btn>
        <q-btn round flat icon="delete" color="negative" @click="deletePersona(props.row)">
          <q-tooltip>Eliminar Persona</q-tooltip>
        </q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { defineProps } from 'vue';
import { customAxios } from 'boot/axios';

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
const getStorageUrl = (path) => `${customAxios.defaults.baseURL}${path}`;

// Métodos de editar y eliminar
const editPersona = (persona) => {
  console.log('Editar persona:', persona);
};

const deletePersona = (persona) => {
  console.log('Eliminar persona:', persona);
};
</script>

<template>
  <q-page class="q-pa-md">

    <q-row justify="center" class="q-mb-md">
      <q-col cols="8" sm="4"> <!-- Espacio centrado para el input -->
        <q-input filled v-model="search" label="Buscar propietario" class="search-input" />
      </q-col>
      <q-col cols="2" sm="1">
        <q-btn icon="search" color="primary" @click="buscarPropietarios" flat round class="search-btn" />
      </q-col>
    </q-row>

    <!-- Lista de Resultados de Búsqueda -->
    <div v-if="propietarios.length > 0" class="q-mt-md">
      <q-list bordered padding>
        <q-item v-for="propietario in propietarios" :key="propietario.id" clickable
          @click="seleccionarPropietario(propietario)">
          <q-item-section>
            <q-item-label>{{ propietario.nombres }} {{ propietario.apellidos }}</q-item-label>
            <q-item-label caption>CI: {{ propietario.ci }} - Teléfono: {{ propietario.telefono }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>

    <!-- Perfil del Propietario Seleccionado -->
    <div v-if="propietarioSeleccionado" class="q-mb-md q-mt-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Propietario Seleccionado: {{ propietarioSeleccionado.nombres }} {{
            propietarioSeleccionado.apellidos }}</div>
          <q-btn color="primary" @click="mostrarMascotas">Ver Mascotas</q-btn>
        </q-card-section>
      </q-card>
    </div>

    <!-- Lista de Mascotas del Propietario Seleccionado -->
    <div v-if="mascotas.length > 0" class="q-mt-md">
      <div v-for="mascota in mascotas" :key="mascota.id" class="q-mb-md">
        <q-card>
          <q-card-section>
            <div class="mascota-info">
              <!-- Foto del perro -->
              <div class="foto-mascota">
                <q-img
                  :src="`http://localhost:8000/storage/${mascota.fotoFrontal}` || 'https://via.placeholder.com/150'"
                  alt="Foto del perro" class="mascota-imagen" />
              </div>

              <!-- Información del perro -->
              <div class="mascota-datos">
                <div class="q-mb-md">
                  <q-input filled v-model="mascota.nombre" label="Nombre del Perro" disable />
                </div>

                <!-- Select para Miembro de la Brigada -->
                <q-select v-model="mascota.miembroSeleccionado" label="Miembro de la Brigada"
                  :options="miembrosBrigada.map(miembro => ({ label: `${miembro.persona.nombres} ${miembro.persona.apellidos}`, value: miembro.id }))"
                  filled />

                <!-- Botones de estado de vacunación -->
                <div class="q-mb-md vacunacion-container">
                  <q-btn block unelevated :color="mascota.vacunado === 1 ? 'green' : 'grey'"
                    @click="mascota.vacunado = 1">
                    <q-icon name="check" /> Vacunado
                  </q-btn>
                  <q-btn block unelevated :color="mascota.vacunado === 0 ? 'red' : 'grey'"
                    @click="mascota.vacunado = 0">
                    <q-icon name="close" /> No Vacunado
                  </q-btn>
                </div>

                <!-- Motivo si no vacunado -->
                <q-select v-if="mascota.vacunado === 0" v-model="mascota.motivo" label="Motivo de no vacunación"
                  :options="[
                    { label: 'Menor a 3 meses', value: 1 },
                    { label: 'Gestacion', value: 2 },
                    { label: 'Enfermedad grave', value: 3 },
                    { label: 'Ausente', value: 4 }
                  ]" />

                <!-- Botón para guardar cambios -->
                <div class="q-mt-md">
                  <q-btn color="primary" label="Guardar" @click="guardarHistorial(mascota)" />
                </div>
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
import { api } from 'boot/axios';
import { useQuasar } from 'quasar';
import axios from 'axios'; // Importa useQuasar
export default {

  setup() {
    const $q = useQuasar();
    const search = ref("");
    const propietarios = ref([]);
    const propietarioSeleccionado = ref(null);
    const mascotas = ref([]);
    const miembrosBrigada = ref([]);

    const buscarPropietarios = async () => {
      try {
        const response = await api.get('/buscar-personas', { params: { q: search.value } });
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
          const response = await axios.get(`http://localhost:8000/api/propietario/${propietarioSeleccionado.value.id}/mascotas`);
          mascotas.value = response.data;
        } catch (error) {
          console.error("Error obteniendo mascotas:", error);
        }
        obtenerMiembrosBrigada();
      }
    };

    // Obtener miembros de la brigada
    const obtenerMiembrosBrigada = async () => {
      try {
        const brigadaId = localStorage.getItem('brigadaUserId');
        const response = await api.get(`/brigadas/${brigadaId}/miembros`);
        miembrosBrigada.value = response.data;
      } catch (error) {
        console.error("Error al obtener miembros de la brigada:", error);
      }
    };

    const guardarHistorial = async (mascota) => {
      try {
        // Aquí obtenemos solo el valor del miembro_id
        const data = {
          estado: mascota.vacunado, // 1 para vacunado, 0 para no vacunado
          motivo: mascota.vacunado === 0 ? mascota.motivo.value : null, // Obtener solo el valor del motivo
          mascota_id: mascota.id,
          miembro_id: mascota.miembroSeleccionado.value || mascota.miembroSeleccionado, // Asegúrate de obtener solo el valor del ID
          brigada_id: localStorage.getItem('brigadaUserId') // Enviar la brigada_id desde el localStorage
        };

        console.log("Datos enviados al backend:", data);

        // Enviar los datos al backend
        const response = await api.post('/historiavacunas', data);

        if (response.status === 200) {
          $q.notify({
            type: 'positive',
            message: 'Historial de vacunación guardado correctamente.'
          });
        }
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Error al guardar el historial de vacunación.'
        });
        console.error("Error:", error);
      }
    };


    return {
      search,
      propietarios,
      propietarioSeleccionado,
      mascotas,
      miembrosBrigada,
      buscarPropietarios,
      seleccionarPropietario,
      mostrarMascotas,
      guardarHistorial,
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

.search-input {
  width: 100%;
}

.vacunacion-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mascota-info {
  display: flex;
  flex-direction: column;
}

.mascota-datos {
  display: flex;
  flex-direction: column;
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
</style>

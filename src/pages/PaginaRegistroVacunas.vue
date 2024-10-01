<template>
  <q-page class="q-pa-md">
    <!-- Buscador de Propietario -->
    <div class="q-gutter-md q-col-gutter-md q-mt-md buscador">
      <q-input filled v-model="search" label="Buscar propietario" />
      <q-btn icon="search" color="primary" @click="buscarPropietarios" flat round />
    </div>

    <!-- Lista de Resultados de Búsqueda -->
    <div v-if="propietarios.length > 0" class="q-mt-md">
      <q-list bordered padding>
        <q-item v-for="propietario in propietarios" :key="propietario.id" clickable
          @click="seleccionarPropietario(propietario)">
          <q-item-section>
            <q-item-label>{{ propietario.nombres }} {{ propietario.apellidos }}</q-item-label>
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
                <div v-if="mascota.vacunado === 0">
                  <q-select v-model="mascota.motivo" label="Motivo de no vacunación" :options="[
                    { label: 'Menor a 3 meses', value: 1 },
                    { label: 'Preñada', value: 2 },
                    { label: 'Enfermedad grave', value: 3 }
                  ]" />
                </div>

                <!-- Botón para guardar cambios -->
                <div class="q-mt-md">
                  <q-btn color="primary" label="Guardar Cambios" @click="guardarHistorial(mascota)" />
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
import { QPage, QInput, QBtn, QCard, QCardSection, QList, QItem, QItemSection, QItemLabel, QImg, QBtnToggle, QSelect } from 'quasar';
import axios from 'axios';

export default {
  components: {
    QPage, QInput, QBtn, QCard, QCardSection, QList, QItem, QItemSection, QItemLabel, QImg, QSelect
  },
  setup() {
    const search = ref("");
    const propietarios = ref([]);
    const propietarioSeleccionado = ref(null);
    const mascotas = ref([]);

    const buscarPropietarios = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/buscar-personas', { params: { q: search.value } });
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
      }
    };

    const guardarHistorial = async (mascota) => {
      console.log({
        mascota_id: mascota.id,
        estado: mascota.vacunado,
        motivo: mascota.vacunado === 0 ? mascota.motivo : null,
        alcance_id: mascota.alcance_id, // Asegúrate de tener estos valores
        participacion_id: mascota.participacion_id // Asegúrate de tener estos valores
      });
      try {
        await axios.post('http://localhost:8000/api/historiavacunas', {
          mascota_id: mascota.id,
          estado: mascota.vacunado, // 1 para vacunado, 0 para no vacunado
          motivo: mascota.vacunado === 0 ? mascota.motivo : null,
          alcance_id: mascota.alcance_id,
          participacion_id: mascota.participacion_id
        });
        alert("Historial de vacunación guardado correctamente.");
      } catch (error) {
        console.error("Error guardando historial de vacunación:", error);
      }
    };




    return {
      search,
      propietarios,
      propietarioSeleccionado,
      mascotas,
      buscarPropietarios,
      seleccionarPropietario,
      mostrarMascotas,
      guardarHistorial
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

.vacunado-card {
  background-color: #e0f8e0;
  border-left: 5px solid green;
}

.no-vacunado-card {
  background-color: #fde5e5;
  border-left: 5px solid red;
}

.q-btn {
  width: 130px;
  margin-right: 8px;
  font-size: 14px;
}

.vacunacion-container {
  display: flex;
  justify-content: flex-start;
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

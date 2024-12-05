<template>
  <q-page class="q-pa-md">
    <section class="formulario">
      <q-card class="q-pa-md" style="padding: 20px;">
        <q-card-section>
          <q-form @submit.prevent="onSubmit" @reset="onReset" class="q-gutter-md">
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-4">
                <q-input filled v-model="formData.nombres" label="Nombres *" hint="Nombres" lazy-rules
                  :rules="[(val) => !!val || 'Los nombres son obligatorios']" class="input-spacing"
                  style="text-transform: uppercase;" />
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-input filled v-model="formData.apellidos" label="Apellidos *" hint="Apellidos" lazy-rules
                  :rules="[(val) => !!val || 'Los apellidos son obligatorios']" class="input-spacing"
                  style="text-transform: uppercase;" />
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-input filled v-model="formData.ci" label="CI *" hint="CI" lazy-rules
                  :rules="[(val) => !!val || 'El CI es obligatorio']" class="input-spacing"
                  style="text-transform: uppercase;" />
              </div>
            </div>
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-xs-12 col-sm-4">
                <q-input filled v-model="formData.telefono" label="Número de teléfono *" hint="Teléfono" lazy-rules
                  :rules="[(val) => !!val || 'El teléfono es obligatorio']" class="input-spacing"
                  style="text-transform: uppercase;" />
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-input filled v-model="formData.nombreUsuario" label="Nombre de usuario *" hint="Usuario" lazy-rules
                  :rules="[(val) => !!val || 'El nombre de usuario es obligatorio']" class="input-spacing"
                  style="text-transform: uppercase;" />
              </div>
              <div class="col-xs-12 col-sm-4">
                <q-input filled v-model="formData.password" label="Password *" hint="Password" type="password"
                  lazy-rules :rules="[(val) => !!val || 'La contraseña es obligatoria']" class="input-spacing" />
              </div>
            </div>
          </q-form>
        </q-card-section>
        <q-card-section>
          <div>
            <q-btn v-if="isEditing" label="Guardar Cambios" color="primary" @click="updateData" />
            <q-btn v-else label="Registrar" color="primary" @click="onSubmit" />

            <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" @click="onReset" />

          </div>
        </q-card-section>
      </q-card>
    </section>

    <q-page class="q-pa-md">
      <!-- Tabla de personas registradas -->
      <q-table title="Lista de Personas" :rows="filteredPersonas" :columns="columns" row-key="id" flat bordered>
        <template v-slot:top>
          <q-input borderless dense debounce="300" color="primary" v-model="search" placeholder="Buscar">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <!-- Botones de editar/eliminar -->
        <template v-slot:body-cell-acciones="props">
          <q-td align="center">
            <q-btn flat icon="edit" color="primary" @click="editPersona(props.row)" />
            <q-btn flat icon="delete" color="negative" @click="changeEstadoPersona(props.row)" />
          </q-td>
        </template>
      </q-table>

    </q-page>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";

const $q = useQuasar();
const personas = ref([]);
const search = ref("");
const loading = ref(false);

// Definir el rol predeterminado que será enviado (en este caso JefeZona)
const rolId = ref(null);

// Configuración para que todos reciban el rol de JEFEZONA
// Suponiendo que el ID del rol JEFEZONA en la base de datos es 2. Cambia según sea necesario.
onMounted(() => {
  rolId.value = 2; // ID del rol JEFEZONA
});

const columns = [
  { name: "nombres", label: "Nombres", align: "left", field: "nombres" },
  { name: "apellidos", label: "Apellidos", align: "left", field: "apellidos" },
  { name: "ci", label: "CI", align: "left", field: "ci" },
  { name: "telefono", label: "Teléfono", align: "left", field: "telefono" },
  { name: "nombreUsuario", label: "Nombre de Usuario", align: "left", field: row => row.usuario?.nombre || 'N/A' },
  { name: "password", label: "Password", align: "left", field: row => row.usuario?.password || 'N/A' },
  { name: "acciones", label: "Acciones", align: "center" }
];

const filteredPersonas = computed(() => {
  if (!search.value) return personas.value;
  const searchTerm = search.value.toLowerCase();
  return personas.value.filter((persona) =>
    persona.nombres.toLowerCase().includes(searchTerm) ||
    persona.apellidos.toLowerCase().includes(searchTerm) ||
    persona.ci.toLowerCase().includes(searchTerm)
  );
});

// Definir estructura de datos del formulario
const formData = ref({
  nombres: "",
  apellidos: "",
  ci: "",
  telefono: "",
  nombreUsuario: "",
  password: ""
});


const onSubmit = async () => {
  if (!formData.value.nombres || !formData.value.apellidos || !formData.value.ci || !formData.value.telefono || !formData.value.nombreUsuario || !formData.value.password) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Complete todos los campos obligatorios'
    });
    return;
  }

  try {
    // Registro del usuario con el rol específico (JEFEZONA en este caso)
    const usuarioResponse = await api.post("/usuarios", {
      nombre: formData.value.nombreUsuario,
      password: formData.value.password,
      estado: 1, // Estado automático
      rol_id: rolId.value
    });

    // Asegúrate de que la respuesta contiene el `id`
    const usuarioId = usuarioResponse.data.id;
    console.log("Usuario ID generado:", usuarioId); // Debe mostrar el ID generado

    // Registro de la persona con el ID del usuario creado
    await api.post("/personas", {
      nombres: formData.value.nombres,
      apellidos: formData.value.apellidos,
      ci: formData.value.ci,
      telefono: formData.value.telefono,
      usuario_id: usuarioId // Aquí enlazamos el usuario recién creado
    });

    $q.notify({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      message: "Persona y Usuario registrados con éxito."
    });

    // Limpiar el formulario
    onReset();
    fetchPersonas(); // Actualizar la lista de personas
  } catch (error) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "error",
      message: "Error al registrar. Intente nuevamente."
    });
    console.error(error);
  }
};


const onReset = () => {
  // Reinicia los datos del formulario
  formData.value = {
    nombres: "",
    apellidos: "",
    ci: "",
    telefono: "",
    nombreUsuario: "",
    password: "",
  };

  // Salir del modo edición
  isEditing.value = false;

  // Limpiar el ID del registro en edición
  editingId.value = null;


};

const fetchPersonas = async () => {
  try {
    const response = await api.get("/personas?filter=withUsuario");
    // Filtrar las personas que tienen usuario_id y estado = 1
    personas.value = response.data.filter(
      (persona) => persona.usuario_id !== null && persona.estado === 1
    );
  } catch (error) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "error",
      message: "Error al obtener las personas."
    });
    console.error(error);
  }
};


onMounted(() => {
  fetchPersonas();
});


const isEditing = ref(false); // Indica si estás editando
const editingId = ref(null); // ID del registro en edición
const updateUsuarioData = {
  nombre: formData.value.nombreUsuario,
};

if (formData.value.password) {
  updateUsuarioData.password = formData.value.password;
}


const editPersona = async (row) => {
  try {
    const response = await api.get(`/jefe-zona/${row.id}`); // Llama al endpoint correspondiente
    const data = response.data;

    // Asigna los datos obtenidos al formulario
    formData.value = {
      nombres: data.nombres,
      apellidos: data.apellidos,
      ci: data.ci,
      telefono: data.telefono,
      nombreUsuario: data.usuario?.nombre || '',
      password: '', // No mostrar la contraseña en el formulario
    };

    isEditing.value = true; // Activa el modo edición
    editingId.value = row.id; // Guarda el ID de la persona en edición
  } catch (error) {
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Error al cargar los datos para editar.',
    });
    console.error(error);
  }
};


const updateData = async () => {
  if (
    !formData.value.nombres ||
    !formData.value.apellidos ||
    !formData.value.ci ||
    !formData.value.telefono ||
    !formData.value.nombreUsuario
  ) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "error",
      message: "Por favor, complete los campos obligatorios.",
    });
    return;
  }

  try {
    // Enviar datos de persona y usuario al backend
    const payload = {
      nombres: formData.value.nombres,
      apellidos: formData.value.apellidos,
      ci: formData.value.ci,
      telefono: formData.value.telefono,
      usuario: formData.value.nombreUsuario,
      password: formData.value.password || undefined, // Enviar contraseña solo si fue proporcionada
    };

    await api.put(`/personas/${editingId.value}`, payload);

    $q.notify({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      message: "Datos actualizados con éxito.",
    });

    fetchPersonas(); // Actualizar la lista
    onReset(); // Salir del modo edición y limpiar el formulario
  } catch (error) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "error",
      message: "Error al actualizar los datos.",
    });
    console.error("Error al actualizar los datos:", error);
  }
};
const changeEstadoPersona = async (row) => {
  try {
    // Llama al endpoint para desactivar la persona
    await api.patch(`/personas/${row.id}/desactivar`);

    $q.notify({
      color: "green-4",
      textColor: "white",
      icon: "cloud_done",
      message: "Persona desactivada con éxito."
    });

    fetchPersonas(); // Actualiza la lista de personas
  } catch (error) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "error",
      message: "Error al desactivar la persona."
    });
    console.error(error);
  }
};


</script>


<style scoped>
.formulario {
  max-width: 100%;
  margin: auto;
}

.q-card {
  padding: 20px;
  border-radius: 8px;
}

.input-spacing {
  margin-bottom: 20px;
}

.q-table {
  margin-top: 20px;
}
</style>

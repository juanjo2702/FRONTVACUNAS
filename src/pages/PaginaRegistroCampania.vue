<template>
  <q-page class="q-pa-md">
    <!-- Botón para abrir el modal -->
    <q-btn label="Registrar Campaña" color="primary" @click="openModal" />

    <div style="margin-top: 20px;"></div>

    <!-- Campo de búsqueda -->
    <div class="q-my-md row">
      <div class="col">
        <q-input v-model="search" label="Buscar por Nombre, Fecha o Estado..." outlined>
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Tabla de campañas -->
    <q-table title="Lista de Campañas" :rows-per-page-options="[5, 10, 15]" :rows="filteredCampanias" :columns="columns"
      row-key="id" flat bordered>
      <!-- Columna para estado y fase -->
      <template v-slot:body-cell-estado="props">
        <q-td align="center">
          <q-chip v-if="props.row.estado === 0" color="orange" text-color="white">
            FASE PREVIA
          </q-chip>
          <q-chip v-else-if="props.row.estado === 1" color="green" text-color="white">
            FASE VACUNACIÓN
          </q-chip>
          <q-chip v-else-if="props.row.estado === 2" color="red" text-color="white">
            CAMPAÑA FINALIZADA
          </q-chip>
        </q-td>
      </template>

      <!-- Nueva columna para el botón "Siguiente Fase" -->
      <template v-slot:body-cell-next-phase="props">
        <q-td align="center">
          <q-btn v-if="props.row.estado !== 2" color="primary" icon-right="arrow_forward" @click="nextPhase(props.row)"
            class="q-btn--phase">
            Siguiente Fase
          </q-btn>
        </q-td>
      </template>


      <template v-slot:body-cell-actions="props">
        <q-td align="center">
          <q-btn flat icon="edit" color="primary" @click="editCampania(props.row)" />
          <q-btn flat icon="delete" color="negative" @click="deleteCampania(props.row)" />
        </q-td>
      </template>
    </q-table>

    <!-- Modal para el formulario de campaña -->
    <q-dialog v-model="isModalOpen" persistent>
      <q-card style="min-width: 50vw; max-height: 90vh;">
        <q-card-section>
          <div class="text-h6">REGISTRAR CAMPAÑA</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="submitForm">
            <div class="row q-col-gutter-md q-mb-md">
              <!-- Campo para el Nombre -->
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input filled v-model="campaniaData.nombre" label="Nombre *" lazy-rules
                  :rules="[(val) => !!val || 'El nombre es obligatorio']" style="text-transform: uppercase" />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-md">
              <!-- Campo para la Fecha de Inicio -->
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input filled v-model="campaniaData.fechaInicio" label="Fecha de Inicio *" lazy-rules>
                  <template v-slot:append>
                    <q-icon name="event" @click="showDatePicker('fechaInicio')" />
                  </template>
                </q-input>
                <q-popup-proxy v-if="showPicker === 'fechaInicio'" transition-show="scale" transition-hide="scale">
                  <q-date v-model="campaniaData.fechaInicio" mask="YYYY-MM-DD" @input="hidePicker" />
                </q-popup-proxy>
              </div>

              <!-- Campo para la Fecha de Finalización -->
              <div class="col-xs-12 col-sm-6 col-md-6">
                <q-input filled v-model="campaniaData.fechaFinal" label="Fecha de Finalización" lazy-rules>
                  <template v-slot:append>
                    <q-icon name="event" @click="showDatePicker('fechaFinal')" />
                  </template>
                </q-input>
                <q-popup-proxy v-if="showPicker === 'fechaFinal'" transition-show="scale" transition-hide="scale">
                  <q-date v-model="campaniaData.fechaFinal" mask="YYYY-MM-DD" @input="hidePicker" />
                </q-popup-proxy>
              </div>
            </div>

            <div class="q-pa-md row justify-evenly">
              <q-btn label="Registrar" type="submit" color="primary" />
              <q-btn label="Resetear" type="reset" color="negative" @click="resetForm" />
            </div>

            <div class="q-pa-md row justify-evenly">
              <q-btn label="Cerrar" color="green" @click="closeModal" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal para seleccionar Zonas -->
    <q-dialog v-model="isZonasModalOpen" persistent>
      <q-card style="min-width: 50vw; max-height: 90vh;">
        <q-card-section>
          <div class="text-h6">ASIGNAR ZONAS A LA CAMPAÑA:</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-form @submit.prevent="submitZonasForm">
            <div class="row q-col-gutter-md q-mb-md">
              <!-- Select para el Centro -->
              <div class="col-xs-12 col-sm-6">
                <q-select filled v-model="selectedZona" label="Seleccionar Centro *" :options="zonas" option-value="id"
                  option-label="centro" :rules="[(val) => !!val || 'El centro es obligatorio']" />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-md">
              <!-- Select para el Jefe de Zona -->
              <div class="col-xs-12 col-sm-6">
                <q-select filled v-model="selectedJefeZona" label="Jefe de Zona *" lazy-rules
                  :options="filteredJefesZona" option-value="id" option-label="nombreCompleto"
                  :rules="[(val) => !!val || 'El jefe de zona es obligatorio']" />
              </div>

              <!-- Campo para el Número de Brigadas -->
              <div class="col-xs-12 col-sm-6">
                <q-input filled v-model="numBrigadas" label="Número de Brigadas *" type="number"
                  :rules="[(val) => !!val || 'El número de brigadas es obligatorio']" />
              </div>
            </div>

            <div class="q-pa-md row justify-evenly">
              <!-- Botón de Guardar y Siguiente Asignación -->
              <q-btn label="Guardar y Siguiente Asignación" type="button" color="primary"
                @click="guardarYSiguienteAsignacion" />

              <!-- Botón de Guardar y Finalizar -->
              <q-btn label="Guardar y Finalizar Asignación" type="button" color="green"
                @click="guardarYFinalizarAsignacion" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";
import { api } from "boot/axios";
import Swal from "sweetalert2";
import jsPDF from "jspdf";
import "jspdf-autotable";

const $q = useQuasar();

// Variables para la campaña
const campaniaData = ref({
  nombre: "",
  fechaInicio: null,
  fechaFinal: null,
  estado: 0
});

const isModalOpen = ref(false);
const showPicker = ref(null);
const search = ref("");

// Métodos
const openModal = () => {
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const showDatePicker = (field) => {
  showPicker.value = field;
};

const hidePicker = () => {
  showPicker.value = null;
};


const resetForm = () => {
  campaniaData.value = {
    nombre: "",
    fechaInicio: null,
    fechaFinal: null,
    estado: 0 // Estado por defecto
  };
};


// Tabla de Campañas
const columns = [
  { name: "nombre", label: "Nombre", align: "center", field: "nombre" },
  { name: "fechaInicio", label: "Fecha de Inicio", align: "center", field: "fechaInicio" },
  { name: "fechaFinal", label: "Fecha de Finalización", align: "center", field: "fechaFinal" },
  { name: "estado", label: "Estado", align: "center", field: "estado" },
  { name: "next-phase", label: "Siguiente Fase", align: "center", field: "next-phase" }, // <--- Asegúrate de tener esta columna
  { name: "actions", label: "Acciones", align: "center" }
];

const campanias = ref([]);

// Método para obtener las campañas
const fetchCampanias = async () => {
  try {
    const response = await api.get("/campanias");
    campanias.value = response.data.sort((a, b) => b.id - a.id); // Orden descendente
  } catch (error) {
    console.error("Error fetching campañas:", error);
  }
};

// Función para pasar a la siguiente fase
const nextPhase = async (campania) => {
  let newEstado = campania.estado + 1;
  let mensaje = '';

  if (campania.estado === 0) {
    mensaje = '¿Está seguro de pasar a la FASE DE VACUNACIÓN?';
  } else if (campania.estado === 1) {
    mensaje = '¿Está seguro de dar la campaña por FINALIZADA?';
  }

  // Mostrar SweetAlert para confirmar el cambio de fase
  const confirm = await Swal.fire({
    title: 'Confirmar Cambio de Fase',
    text: mensaje,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, cambiar',
    cancelButtonText: 'No, cancelar'
  });

  // Si el usuario confirma el cambio
  if (confirm.isConfirmed) {
    try {
      await api.put(`/campanias/${campania.id}`, { estado: newEstado });
      fetchCampanias(); // Actualizar la tabla con las nuevas fases

      // Notificar que el cambio de fase fue exitoso
      $q.notify({
        color: 'green-8',
        textColor: 'white',
        icon: 'check',
        message: 'Fase actualizada correctamente.',
        position: 'top',
        timeout: 3000
      });
    } catch (error) {
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'error',
        message: 'Error al actualizar la fase.',
        position: 'top',
        timeout: 3000
      });
    }
  } else {
    $q.notify({
      color: 'orange-8',
      textColor: 'white',
      icon: 'cancel',
      message: 'Cambio de fase cancelado.',
      position: 'top',
      timeout: 3000
    });
  }
};

// Computed property para el filtrado de campañas basado en la búsqueda
const filteredCampanias = computed(() => {
  if (!search.value) {
    return campanias.value;
  }
  const searchTerm = search.value.toLowerCase();
  return campanias.value.filter((campania) =>
    campania.nombre.toLowerCase().includes(searchTerm) ||
    campania.fechaInicio.toLowerCase().includes(searchTerm) ||
    campania.fechaFinal.toLowerCase().includes(searchTerm) ||
    (campania.estado === 0 && "fase previa".includes(searchTerm)) ||
    (campania.estado === 1 && "fase vacunacion".includes(searchTerm)) ||
    (campania.estado === 2 && "campaña finalizada".includes(searchTerm))
  );
});

// Función para enviar el formulario
const submitForm = async () => {
  if (!campaniaData.value.nombre || !campaniaData.value.fechaInicio || !campaniaData.value.fechaFinal) {
    $q.notify({
      color: "red-5",
      textColor: "white",
      icon: "error",
      message: "Por favor, complete todos los campos.",
      position: "top",
      timeout: 3000
    });
    return;
  }

  try {
    const response = await api.post("/campanias", {
      nombre: campaniaData.value.nombre,
      fechaInicio: campaniaData.value.fechaInicio,
      fechaFinal: campaniaData.value.fechaFinal,
      estado: 0
    });

    // Registro exitoso de la campaña
    $q.notify({
      color: "green-8",
      textColor: "white",
      icon: "cloud_done",
      message: "Campaña registrada con éxito.",
      position: "top",
      timeout: 3000
    });

    // Actualiza la lista de campañas
    fetchCampanias();

    // Cierra el modal actual
    resetForm();
    closeModal();

    // Abre el siguiente modal
    openZonasModal();
  } catch (error) {
    console.error(error);
    if (error.response && error.response.status === 422) {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "error",
        message: "Error al procesar los datos. Verifique los campos.",
        position: "top",
        timeout: 3000
      });
    } else {
      $q.notify({
        color: "red-5",
        textColor: "white",
        icon: "error",
        message: "Error al registrar la campaña. Intente nuevamente.",
        position: "top",
        timeout: 3000
      });
    }
  }
};

// Función para asignar zonas a la campaña
// Variables y estados para la asignación de zonas

const isZonasModalOpen = ref(false);
const selectedCentro = ref(null);
const selectedZona = ref(''); // Campo de Zona autocompletado
const selectedJefeZona = ref(null);
const numBrigadas = ref('');
const zonas = ref([]); // Lista de zonas
const jefesZona = ref([]);

// Filtrar zonas y jefes de zona mientras se escribe
const filteredZonas = computed(() => {
  // Si no hay un valor seleccionado, retorna todas las zonas
  if (!selectedZona.value) return zonas.value;

  // Verifica que el valor sea una cadena antes de aplicar toLowerCase
  return zonas.value.filter(zona =>
    zona.nombre.toLowerCase().includes(selectedZona.value.toString().toLowerCase()) // Asegura que sea una cadena
  );
});

const filteredJefesZona = computed(() => {
  if (!selectedJefeZona.value || typeof selectedJefeZona.value !== 'string') return jefesZona.value;
  const searchTerm = selectedJefeZona.value.toLowerCase();
  return jefesZona.value.filter(jefe =>
    jefe.nombreCompleto.toLowerCase().includes(searchTerm)
  );
});

// Obtener las zonas al montar el componente
const fetchZonas = async () => {
  try {
    const response = await api.get('/zonas');
    console.log('Zonas obtenidas:', response.data); // Asegúrate de que las zonas tienen el campo centro
    zonas.value = response.data;
  } catch (error) {
    console.error('Error al obtener zonas:', error);
  }
};

// Obtener los jefes de zona con el rol de Jefe de Zona (rol_id = 2)
const fetchJefesZona = async () => {
  try {
    const response = await api.get('/jefes-zona'); // Suponiendo que esta es la ruta de tu backend
    jefesZona.value = response.data.map(jefe => ({
      id: jefe.usuario_id,
      nombreCompleto: jefe.nombreCompleto
    }));
  } catch (error) {
    console.error('Error al obtener jefes de zona:', error);
  }
};

const submitZonasForm = async () => {
  try {
    // Código para manejar el formulario de zonas
    await api.post('/zonas', {
      campania_id: campaniaData.value.id,
      zona_id: selectedZona.value.id,
      usuario_id: selectedJefeZona.value.id
    });

    $q.notify({
      color: 'green-8',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Zona asignada correctamente',
      position: 'top',
      timeout: 3000
    });
    closeZonasModal(); // Cierra el modal de zonas
  } catch (error) {
    console.error('Error al asignar zona:', error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Error al asignar la zona',
      position: 'top',
      timeout: 3000
    });
  }
};

const activeCampania = computed(() => {
  return campanias.value.find(c => c.estado === 0 || c.estado === 1);
});

// Obtener el centro (centro) cuando se selecciona una zona
const fetchcentro = () => {
  const zonaSeleccionada = zonas.value.find(zona => zona.id === selectedZona.value);
  if (zonaSeleccionada) {
    centro.value = zonaSeleccionada.centro; // Asignar el centro correspondiente
  } else {
    centro.value = ''; // Limpiar el campo si no se selecciona nada
  }
};

// Función para abrir el modal
const openZonasModal = () => {
  console.log("Abriendo modal de zonas...");
  isZonasModalOpen.value = true;
};


// Función para cerrar el modal
const closeZonasModal = () => {
  isZonasModalOpen.value = false;
  resetZonasForm();
};

// Función para resetear el formulario de asignación de zonas
const resetZonasForm = () => {
  selectedZona.value = null;
  selectedJefeZona.value = null;
  numBrigadas.value = '';
};

const fetchZonaPorCentro = () => {
  const zonaEncontrada = zonas.value.find(zona => zona.id === selectedCentro.value);
  if (zonaEncontrada) {
    console.log("Zona encontrada:", zonaEncontrada);  // Imprime el detalle de la zona encontrada
    selectedZona.value = zonaEncontrada;  // Asigna el objeto completo de la zona
    centro.value = zonaEncontrada.centro;  // Asigna el centro si lo necesitas
  } else {
    console.log("No se encontró zona para este centro.");
    selectedZona.value = null;
    centro.value = '';  // Limpia el valor de `centro` si no se encuentra zona
  }
};


// Enviar el formulario de asignación de zonas
const generarBrigadas = async (zonaId, numBrigadas) => {
  const zona = zonas.value.find(z => z.id === zonaId);
  if (!zona) {
    console.error('Zona no encontrada');
    return;
  }

  const zonaNombre = zona.nombre.substring(0, 3).toUpperCase(); // Primeras 3 letras del centro
  // Dividir el nombre de la campaña por "-" y tomar las últimas 2 partes si existen
  // Obtener el mes y el año actuales
  const fechaActual = new Date();
  const mesActual = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Mes actual (formato MM)
  const añoActual = fechaActual.getFullYear(); // Año actual (formato YYYY)
  const brigadas = [];
  console.log('Zona:', zonaNombre);
  console.log('Mes y Año:', `${mesActual}-${añoActual}`);

  for (let i = 1; i <= numBrigadas; i++) {
    const username = `BR${i}-${zonaNombre}-${mesActual}-${añoActual}`;
    const password = `BRIGADA${i}${zonaNombre}`;  // Contraseña
    console.log(`Contraseña generada: ${password}`);
    // Guardar cada brigada
    try {
      const response = await api.post('/brigadas', {
        usuario: {
          nombre: username,
          password: password,
          rol_id: 1,  // Asignar el rol de brigada (puedes ajustar este rol según tu estructura)
          estado: 1  // Estado activo
        },
        zona_id: zonaId  // Relacionar con la zona seleccionada
      });
      brigadas.push({ nombre: username, password });
      console.log(`Brigada ${i} guardada correctamente`, response.data);
    } catch (error) {
      console.error(`Error al crear la brigada ${i}:`, error);
    }
  }
  generarPDFBrigadas(zona.nombre, zona.centro, selectedJefeZona.value.nombreCompleto, brigadas);
};
const generarPDFBrigadas = (zona, centro, jefeZona, brigadas) => {
  const doc = new jsPDF();

  // Título del documento
  doc.setFontSize(18);
  doc.text("Informe de Brigadas", 14, 22);

  // Detalles de la campaña y la zona
  doc.setFontSize(12);
  doc.text(`Zona: ${zona}`, 14, 32);
  doc.text(`Centro: ${centro}`, 14, 40);
  doc.text(`Jefe de Zona: ${jefeZona}`, 14, 48);

  // Generar la tabla de brigadas con jsPDF-AutoTable
  const tableData = brigadas.map((brigada, index) => [
    index + 1,
    brigada.nombre,
    brigada.password,
  ]);

  doc.autoTable({
    head: [["#", "Nombre de Brigada", "Contraseña"]],
    body: tableData,
    startY: 60, // Dónde empezar la tabla
  });

  // Descargar el PDF
  doc.save(`Brigadas-${zona}.pdf`);
};

const guardarYFinalizarAsignacion = async () => {
  // Lógica para guardar en la tabla de alcances
  await guardarAsignacion();

  // Cerrar el modal después de guardar
  closeZonasModal();

  $q.notify({
    color: 'green-8',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Asignación guardada y finalizada.',
    position: 'top',
    timeout: 3000
  });
};
const fetchPersonaPorUsuarioId = async (usuarioId) => {
  try {
    const response = await api.get(`/personas/usuario/${usuarioId}`);
    console.log('Persona encontrada:', response.data);
    return response.data;  // Devolver los datos de la persona
  } catch (error) {
    console.error('Error al obtener la persona:', error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Error al obtener la persona.',
      position: 'top',
      timeout: 3000
    });
    return null;
  }
};


const obtenerPersona = async () => {
  const persona = await fetchPersonaPorUsuarioId(usuarioId);
  console.log(persona);
};

// Función para guardar la asignación en la tabla alcances
const guardarAsignacion = async () => {
  const zonaId = typeof selectedZona.value === 'object' ? selectedZona.value.id : selectedZona.value;
  console.log("ID de la zona seleccionada (forzado):", zonaId); // Este debe ser un número
  try {
    const usuarioId = selectedJefeZona.value.id;

    // Obtener la persona asociada al usuario
    const responsePersona = await api.get(`/personas/usuario/${usuarioId}`);
    const persona = responsePersona.data;

    const activeCampania = campanias.value.find(c => c.estado === 0 || c.estado === 1);

    if (!activeCampania || !selectedZona.value || !selectedZona.value.id || !persona.id) {
      console.error("Datos incompletos:", {
        campania_id: activeCampania ? activeCampania.id : 'undefined',
        zona_id: zonaId ? zonaId : 'undefined',
        persona_id: persona.id
      });
      return;
    }

    // Valida que haya una zona seleccionada
    if (!selectedZona.value) {
      console.error("No se ha seleccionado una zona válida");
      $q.notify({
        color: 'red-5',
        textColor: 'white',
        icon: 'error',
        message: 'Por favor selecciona una zona válida.',
        position: 'top',
        timeout: 3000
      });
      return;
    }

    // Imprimir los datos que se van a enviar al backend
    console.log("Datos que se enviarán:", {
      campania_id: activeCampania.id,
      zona_id: zonaId,  // Asegúrate de que contiene el ID correcto
      persona_id: persona.id
    });

    // Enviar los datos al backend
    await api.post('/alcances', {
      campania_id: activeCampania.id,
      zona_id: zonaId,  // Capturar el ID de la zona
      persona_id: persona.id
    });
    fetchCampanias();
    await generarBrigadas(zonaId, numBrigadas.value)
    $q.notify({
      color: 'green-8',
      textColor: 'white',
      icon: 'cloud_done',
      message: 'Asignación guardada correctamente.',
      position: 'top',
      timeout: 3000
    });
  } catch (error) {
    console.error("Error al guardar asignación:", error);
    $q.notify({
      color: 'red-5',
      textColor: 'white',
      icon: 'error',
      message: 'Error al guardar la asignación.',
      position: 'top',
      timeout: 3000
    });
  }
};
const guardarYSiguienteAsignacion = async () => {
  try {
    await guardarAsignacion();
    // Uso de await dentro de una función async
    resetZonasForm();
  } catch (error) {
    console.error('Error al guardar asignación', error);
  }
};

// Cargar las campañas, zonas y jefes de zona al montar el componente
onMounted(() => {
  fetchCampanias();
  fetchZonas();
  fetchJefesZona();
});
</script>

<style scoped>
.q-btn--phase {
  font-weight: bold;
  border-radius: 50px;
  padding: 10px 20px;
  background: linear-gradient(to right, #1e88e5, #64b5f6);
  color: white;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.1);
}
</style>

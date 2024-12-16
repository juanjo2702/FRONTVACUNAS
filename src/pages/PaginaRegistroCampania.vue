<template>
  <q-page class="q-pa-md">
    <!-- Botón para registrar campaña -->
    <q-btn label="Registrar Campaña" color="primary" @click="openModal" unelevated class="q-mb-md" icon="add_circle" />

    <!-- Campo de búsqueda -->
    <div class="q-my-md row">
      <div class="col">
        <q-input v-model="search" outlined dense placeholder="Buscar por Nombre, Fecha o Estado...">
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <!-- Tabla de campañas -->
    <q-table title="Lista de Campañas" :rows="filteredCampanias" :columns="columns" row-key="id" flat bordered
      separator="horizontal" class="tabla-campanias" :rows-per-page-options="[5, 10, 15]">
      <!-- Columna personalizada para Estado -->
      <template v-slot:body-cell-estado="props">
        <q-td align="center">
          <q-chip v-if="props.row.estado === 0" color="orange" text-color="white" label="FASE PREVIA" />
          <q-chip v-else-if="props.row.estado === 1" color="green" text-color="white" label="FASE VACUNACIÓN" />
          <q-chip v-else-if="props.row.estado === 2" color="red" text-color="white" label="CAMPAÑA FINALIZADA" />
        </q-td>
      </template>

      <!-- Botón para "Siguiente Fase" -->
      <template v-slot:body-cell-next-phase="props">
        <q-td align="center">
          <q-btn v-if="props.row.estado !== 2" label="Siguiente Fase" color="primary" icon-right="arrow_forward"
            unelevated @click="confirmNextPhase(props.row)" class="q-btn--phase" />
        </q-td>
      </template>

      <!-- Botón para "Asignar Centro de Salud" -->
      <template v-slot:body-cell-asignar-centro="props">
        <q-td align="center">
          <q-btn v-if="props.row.estado === 0 || props.row.estado === 1" label="Asignar Centro" color="blue" flat
            icon="local_hospital" @click="assignHealthCenter(props.row)" />
        </q-td>
      </template>

      <!-- Botón para "Asignar o Aumentar Brigadas" -->
      <template v-slot:body-cell-asignar-brigadas="props">
        <q-td align="center">
          <q-btn v-if="props.row.estado === 0 || props.row.estado === 1" label="Asignar/Aumentar Brigadas"
            color="purple" icon-right="group_add" unelevated @click="assignOrIncreaseBrigades(props.row)"
            class="q-btn--brigades" />
        </q-td>
      </template>
    </q-table>

    <!-- Modal para registrar campaña -->
    <q-dialog v-model="isModalOpen" persistent>
      <q-card class="q-gutter-md q-pa-md" style="width: 90%; max-width: 500px;">
        <q-card-section>
          <div class="text-h6">Registrar Nueva Campaña</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form @submit.prevent="submitForm">
            <q-input v-model="campaniaData.nombre" label="Nombre" outlined dense class="q-mb-md"
              :rules="[(val) => !!val || 'El nombre es obligatorio']" />
            <q-input v-model="campaniaData.fechaInicio" label="Fecha de Inicio" outlined dense type="date"
              class="q-mb-md" :rules="[(val) => !!val || 'La fecha de inicio es obligatoria']" />
            <q-input v-model="campaniaData.fechaFinal" label="Fecha de Finalización" outlined dense type="date"
              class="q-mb-md" :rules="[(val) => !!val || 'La fecha de finalización es obligatoria']" />
            <div class="row justify-between">
              <q-btn label="Limpiar Campos" flat color="warning" @click="clearRegisterForm" />
              <q-btn label="Registrar" color="primary" type="submit" />
              <q-btn label="Cerrar" flat color="negative" @click="closeModal" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal para asignar centro de salud -->
    <q-dialog v-model="isHealthCenterModalOpen" persistent>
      <q-card class="q-gutter-md q-pa-md" style="width: 90%; max-width: 500px;">
        <q-card-section>
          <div class="text-h6">Asignar Centro de Salud</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form ref="healthCenterForm" @submit.prevent="submitHealthCenterForm">
            <q-select v-model="selectedCentro" :options="filteredCentros" option-value="id" option-label="centro"
              clearable label="Seleccionar Centro de Salud" outlined dense class="q-mb-md"
              :rules="[val => !formValidationActive.value || !!val || 'Debe seleccionar un centro']" use-input
              input-debounce="300" @filter="filterCentros" />
            <q-select v-model="selectedJefeZona" :options="filteredJefesZona" option-value="persona_id"
              option-label="nombreCompleto" label="Seleccionar Jefe de Centro" outlined dense class="q-mb-md"
              :rules="[val => !formValidationActive.value || !!val || 'Debe seleccionar un jefe de centro']" use-input
              input-debounce="300" @filter="filterJefesZona" />
            <q-input v-model="informativo.municipio" label="Municipio" outlined dense readonly />
            <q-input v-model="informativo.red" label="Red" outlined dense readonly />
            <q-input v-model="informativo.departamento" label="Departamento" outlined dense readonly />
            <div class="row justify-between">
              <q-btn label="Limpiar Campos" flat color="warning" @click="clearHealthCenterForm" />
              <q-btn label="Salir" flat color="negative" @click="closeHealthCenterModal" />
              <q-btn label="Guardar y Siguiente" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal para asignar o aumentar brigadas -->
    <q-dialog v-model="isBrigadesModalOpen" persistent>
      <q-card class="q-gutter-md q-pa-md" style="width: 90%; max-width: 500px;">
        <q-card-section>
          <div class="text-h6">Asignar o Aumentar Brigadas</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-form ref="brigadesForm" @submit.prevent="submitBrigadesForm">
            <q-select v-model="selectedZona" :options="filteredZonas" option-label="centro" option-value="id"
              label="Seleccionar Zona" outlined dense emit-value map-options class="q-mb-md"
              :rules="[val => !formValidationActive.value || 'Debe seleccionar una zona']" use-input
              input-debounce="300" @filter="filterZonas" />
            <q-input v-model="numeroBrigadas" type="number" label="Número de Brigadas" outlined dense class="q-mb-md"
              :rules="[val => !formValidationActive.value || !!val || 'El número de brigadas debe ser mayor a 0']" />

            <q-input v-model="brigadasInformativo.municipio" label="Municipio" outlined dense readonly />
            <q-input v-model="brigadasInformativo.red" label="Red" outlined dense readonly />
            <q-input v-model="brigadasInformativo.departamento" label="Departamento" outlined dense readonly />
            <div class="row justify-between">
              <q-btn label="Limpiar Campos" flat color="warning" @click="clearBrigadesForm" />
              <q-btn label="Cerrar" flat color="negative" @click="closeBrigadesModal" />
              <q-btn label="Guardar y Siguiente" color="primary" type="submit" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { api } from "boot/axios";
import Swal from "sweetalert2";
import { useQuasar } from "quasar";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

const $q = useQuasar();
const campanias = ref([]);
const centros = ref([]);
const jefesZona = ref([]);
const search = ref("");
const isModalOpen = ref(false);
const isHealthCenterModalOpen = ref(false);
const healthCenterForm = ref(null);
const campaniaData = ref({
  nombre: "",
  fechaInicio: "",
  fechaFinal: "",
  estado: 0,
});
const formValidationActive = ref(false);
const selectedCentro = ref(null);
const selectedJefeZona = ref(null);
const activeCampania = ref(null);
const filteredCentros = ref(centros.value);
const filteredJefesZona = ref(jefesZona.value);

const isBrigadesModalOpen = ref(false); // Estado del modal de brigadas
const selectedZona = ref(null);
const numeroBrigadas = ref(null);
const filteredZonas = ref([]); // Zonas filtradas para la campaña seleccionada

const brigadesForm = ref(null);

const formatFecha = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

// Definir columnas de la tabla
const columns = [
  { name: "nombre", align: "left", label: "Nombre", field: "nombre", sortable: true },
  { name: "fechaInicio", align: "center", label: "Fecha de Inicio", field: row => formatFecha(row.fechaInicio), sortable: true },
  { name: "fechaFinal", align: "center", label: "Fecha de Finalización", field: row => formatFecha(row.fechaFinal), sortable: true },
  { name: "estado", align: "center", label: "Estado", field: "estado" },
  { name: "next-phase", align: "center", label: "Siguiente Fase", field: "next-phase" },
  { name: "asignar-centro", align: "center", label: "Asignar Centro de Salud", field: "asignar-centro" },
  { name: "asignar-brigadas", align: "center", label: "Asignar/Aumentar Brigadas", field: "asignar-brigadas" },
];

// Cargar campañas desde la API
const fetchCampanias = async () => {
  try {
    const response = await api.get("/campanias");
    campanias.value = response.data.sort((a, b) => b.id - a.id); // Orden descendente
  } catch (error) {
    console.error("Error al obtener campañas:", error);
  }
};

// Cargar centros desde la API
const fetchCentros = async () => {
  try {
    const response = await api.get("/zonas/centros"); // Asegúrate que este endpoint es correcto
    centros.value = response.data.map((zona) => ({
      id: zona.id,
      centro: zona.centro,
    }));
  } catch (error) {
    console.error("Error al obtener centros:", error);
  }
};
// Cargar jefes de zona desde la API
const fetchJefesZona = async () => {
  try {
    const response = await api.get("/jefes-zona");
    jefesZona.value = response.data.map((jefe) => ({
      persona_id: jefe.persona_id, // ID de la persona (clave primaria)
      usuario_id: jefe.usuario_id, // ID del usuario
      nombreCompleto: jefe.nombreCompleto, // Nombre completo
    }));

    console.log("Jefes de Zona cargados:", jefesZona.value); // Depuración
  } catch (error) {
    console.error("Error al obtener jefes de zona:", error);
    $q.notify({
      type: "negative",
      message: "Error al cargar los jefes de zona.",
      position: "top",
    });
  }
};

// Filtrar campañas según la búsqueda
const filteredCampanias = computed(() => {
  if (!search.value) return campanias.value;

  const term = search.value.toLowerCase();
  return campanias.value.filter((campania) =>
    Object.values(campania)
      .join(" ")
      .toLowerCase()
      .includes(term)
  );
});



const filterCentros = (val, update) => {
  update(() => {
    const term = val.toLowerCase();
    filteredCentros.value = centros.value.filter(centro =>
      centro.centro.toLowerCase().includes(term)
    );
  });
};

const filterJefesZona = (val, update) => {
  update(() => {
    const term = val.toLowerCase();
    filteredJefesZona.value = jefesZona.value.filter(jefe =>
      jefe.nombreCompleto.toLowerCase().includes(term)
    );
  });
};

watch(centros, (newVal) => {
  filteredCentros.value = newVal;
});

watch(jefesZona, (newVal) => {
  filteredJefesZona.value = newVal;
});

watch(selectedZona, (newVal) => {
  if (newVal === null) {
    console.log("Campo de zona limpiado");
    // Si necesitas limpiar datos relacionados:
    numeroBrigadas.value = null; // Resetear el número de brigadas si es necesario
  }
});

watch(selectedCentro, async (newVal) => {
  if (newVal) {
    try {
      const response = await api.get(`/zonas/${newVal.id}/detalles`);
      informativo.value.municipio = response.data.municipio;
      informativo.value.red = response.data.red;
      informativo.value.departamento = response.data.departamento;
    } catch (error) {
      console.error('Error al obtener detalles del centro:', error);
    }
  } else {
    // Limpiar campos informativos si no hay selección
    informativo.value.municipio = '';
    informativo.value.red = '';
    informativo.value.departamento = '';
  }
});

const informativo = ref({
  municipio: '',
  red: '',
  departamento: '',
});

watch(selectedZona, async (newVal) => {
  if (newVal) {
    try {
      const response = await api.get(`/zonas/${newVal}/detalles`);
      brigadasInformativo.value.municipio = response.data.municipio;
      brigadasInformativo.value.red = response.data.red;
      brigadasInformativo.value.departamento = response.data.departamento;
    } catch (error) {
      console.error("Error al obtener detalles de la zona:", error);
    }
  } else {
    // Limpiar los campos informativos
    brigadasInformativo.value.municipio = "";
    brigadasInformativo.value.red = "";
    brigadasInformativo.value.departamento = "";
  }
});
const brigadasInformativo = ref({
  municipio: "",
  red: "",
  departamento: "",
});

// Abrir y cerrar el modal
const openModal = () => (isModalOpen.value = true);
const closeModal = () => {
  isModalOpen.value = false;
  campaniaData.value = { nombre: "", fechaInicio: "", fechaFinal: "", estado: 0 };
};

// Abrir y cerrar el modal de asignar centro
const assignHealthCenter = (campania) => {
  activeCampania.value = campania;
  // Limpia valores del formulario
  selectedCentro.value = null;
  selectedJefeZona.value = null;
  // Abre el modal
  isHealthCenterModalOpen.value = true;
};
const closeHealthCenterModal = () => {
  isHealthCenterModalOpen.value = false;
  selectedCentro.value = null;
  selectedJefeZona.value = null;
};

// Guardar asignación en la tabla alcances
const submitHealthCenterForm = async () => {
  formValidationActive.value = true;

  if (!selectedCentro.value || !selectedJefeZona.value) {
    $q.notify({
      type: "negative",
      message: "Debe seleccionar un centro de salud y un jefe de zona.",
      position: "top",
    });
    return;
  }

  try {
    const payload = {
      campania_id: activeCampania.value.id, // ID de la campaña seleccionada
      zona_id: selectedCentro.value.id,    // Extraer el ID del centro seleccionado
      persona_id: selectedJefeZona.value.persona_id, // Extraer el persona_id del jefe de zona seleccionado
    };

    console.log("Datos que se envían al backend:", payload); // Verificar el payload corregido

    // Enviar los datos al backend
    await api.post("/alcances", payload);

    $q.notify({
      type: "positive",
      message: "Asignación guardada correctamente.",
      position: "top",
    });

    // Limpiar el formulario después de guardar
    selectedCentro.value = null;
    selectedJefeZona.value = null;
    formValidationActive.value = false; // Desactiva validación para que no se muestren errores al limpiar
  } catch (error) {
    // Manejar errores del servidor
    if (error.response?.status === 409) {
      // Error 409: Conflicto, centro ya asignado
      $q.notify({
        type: "warning",
        message: error.response.data.message || "El centro ya está asignado a esta campaña.",
        position: "top",
      });
    } else {
      console.error("Error al guardar asignación:", error.response?.data || error.message);
      $q.notify({
        type: "negative",
        message: "Error al guardar asignación.",
        position: "top",
      });
    }
  }
};
// Confirmar cambio de fase con SweetAlert
const confirmNextPhase = async (campania) => {
  const nextEstado = campania.estado + 1;
  const message =
    campania.estado === 0
      ? "¿Estás seguro de pasar a la Fase de Vacunación?"
      : "¿Estás seguro de Finalizar la Campaña?";

  const result = await Swal.fire({
    title: "Confirmar Cambio de Fase",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, cambiar",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    nextPhase(campania, nextEstado);
  }
};

// Cambiar fase
const nextPhase = async (campania, newEstado) => {
  try {
    await api.put(`/campanias/${campania.id}`, { estado: newEstado });
    await fetchCampanias();
    $q.notify({ type: "positive", message: "Fase actualizada correctamente.", position: "top" });
  } catch (error) {
    console.error("Error al actualizar fase:", error);
    $q.notify({ type: "negative", message: "Error al actualizar fase.", position: "top" });
  }
};

// Registrar campaña
const submitForm = async () => {
  try {
    await api.post("/campanias", campaniaData.value);
    await fetchCampanias(); // Actualizar la tabla
    $q.notify({ type: "positive", message: "Campaña registrada exitosamente.", position: "top" });
    closeModal();
  } catch (error) {
    console.error("Error al registrar campaña:", error);
    $q.notify({ type: "negative", message: "Error al registrar campaña.", position: "top" });
  }
};

// Función para abrir el modal
const assignOrIncreaseBrigades = async (campania) => {
  activeCampania.value = campania;
  await fetchZonasForCampania(campania.id); // Filtrar zonas para esta campaña
  isBrigadesModalOpen.value = true;
};

// Función para cerrar el modal
const closeBrigadesModal = () => {
  isBrigadesModalOpen.value = false;
  selectedZona.value = null;
  numeroBrigadas.value = null;
};

const fetchZonasForCampania = async (campaniaId) => {
  try {
    const response = await api.get(`/alcances/campania/${campaniaId}`);
    console.log("Zonas recibidas del backend:", response.data); // Agregado para verificar

    filteredZonas.value = response.data.map((alcance) => ({
      id: alcance.zona.id,    // ID de la zona
      centro: alcance.zona.centro, // Nombre del centro
    }));
  } catch (error) {
    console.error("Error al obtener zonas para la campaña:", error);
    $q.notify({
      type: "negative",
      message: "Error al cargar las zonas asociadas a la campaña.",
      position: "top",
    });
  }
};
const clearBrigadesModal = () => {
  selectedZona.value = null; // Limpiar selección del `q-select`
  numeroBrigadas.value = null; // Limpiar input de número de brigadas

  // Resetear validación del formulario
  if (brigadesForm.value) {
    brigadesForm.value.resetValidation(); // Limpiar alertas de validación
  }
};

// Enviar datos para generar brigadas
const submitBrigadesForm = async () => {
  formValidationActive.value = true;
  if (!selectedZona.value || !numeroBrigadas.value) {
    $q.notify({
      type: "negative",
      message: "Debe seleccionar una zona y especificar el número de brigadas.",
      position: "top",
    });
    return;
  }

  try {
    const payload = {
      campania_id: activeCampania.value.id, // ID de la campaña activa
      zona_id: selectedZona.value,         // ID de la zona seleccionada
      num_brigadas: numeroBrigadas.value, // Número de brigadas a generar
    };

    console.log("Datos enviados al backend:", payload); // Agregado para depuración

    // Enviar datos al backend
    const response = await api.post("/brigadas/generar", payload);

    $q.notify({
      type: "positive",
      message: "Brigadas generadas correctamente.",
      position: "top",
    });

    console.log("Brigadas generadas:", response.data.brigadas);

    // Generar el PDF con los datos de brigadas
    const campania = activeCampania.value;
    const zona = filteredZonas.value.find((z) => z.id === selectedZona.value);
    const brigadasNuevas = response.data.brigadas;
    const brigadasCompletas = response.data.brigadas_completas;

    // Generar el PDF
    generatePDF(campania, zona, brigadasNuevas, brigadasCompletas);

    selectedZona.value = null;
    numeroBrigadas.value = null;
    // Limpiar campos y quitar alertas
    formValidationActive.value = false;
  } catch (error) {
    console.error("Error al generar brigadas:", error.response?.data || error.message);
    $q.notify({
      type: "negative",
      message: "Error al generar brigadas. Verifique los datos e intente de nuevo.",
      position: "top",
    });
  }
};

const generatePDF = async (campania, zona, brigadasNuevas, brigadasCompletas) => {
  const doc = new jsPDF();

  // Encabezado
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(`Reporte de Brigadas`, 105, 15, { align: "center" });

  doc.setFontSize(14);
  doc.text(`Campaña: ${campania.nombre}`, 105, 25, { align: "center" });
  doc.text(`Centro: ${zona.centro}`, 105, 35, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.text("Lista de Brigadas Generadas:", 10, 50);

  // Crear la tabla de brigadas (incluyendo contraseñas para nuevas brigadas)
  const tableBody = [
    ...brigadasNuevas.map((brigada, index) => [
      index + 1, // Continuar numeración
      brigada.nombre, // Nombre de usuario
      brigada.password, // Contraseña generada
    ]),
  ];

  autoTable(doc, {
    startY: 55, // Ajusta la posición de inicio según lo necesites
    head: [["#", "Usuario", "Contraseña"]],
    body: tableBody.map((row, index) => [index + 1, row[1], row[2]]), // Mapear filas y agregar índices
    styles: {
      fontSize: 10,
      cellPadding: 5,
      valign: "middle",
      halign: "center",
    },
    headStyles: {
      fillColor: [22, 160, 133], // Verde suave para encabezados
      textColor: [255, 255, 255], // Blanco para el texto del encabezado
      fontSize: 12,
    },
    alternateRowStyles: {
      fillColor: [230, 240, 248], // Color suave para filas alternadas
    },
  });


  // Pie de página
  const date = new Date().toLocaleDateString();
  doc.setFontSize(10);
  doc.text(`Generado el ${date}`, 10, doc.internal.pageSize.height - 10);

  doc.save(`Brigadas_${campania.nombre}_${zona.centro}.pdf`);
};


const filterZonas = (val, update) => {
  update(() => {
    const term = val.toLowerCase();
    filteredZonas.value = filteredZonas.value.filter((zona) =>
      zona.centro.toLowerCase().includes(term)
    );
  });
};

// Limpiar el formulario de registro de campaña
const clearRegisterForm = () => {
  campaniaData.value = {
    nombre: "",
    fechaInicio: "",
    fechaFinal: "",
    estado: 0,
  };
};

// Limpiar el formulario de asignación de centro de salud
const clearHealthCenterForm = () => {
  selectedCentro.value = null;
  selectedJefeZona.value = null;
  formValidationActive.value = false;
  if (healthCenterForm.value) {
    healthCenterForm.value.resetValidation(); // Reiniciar validaciones
  }
};

// Limpiar el formulario de asignación de brigadas
const clearBrigadesForm = () => {
  selectedZona.value = null;
  numeroBrigadas.value = null;
  formValidationActive.value = false;
  if (brigadesForm.value) {
    brigadesForm.value.resetValidation(); // Reiniciar validaciones
  }
};


onMounted(() => {
  fetchCampanias();
  fetchCentros();
  fetchJefesZona();
});
</script>

<style scoped>
.tabla-campanias {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}

.q-btn--phase {
  font-weight: bold;
  border-radius: 4px;
  padding: 5px 15px;
  color: white;
}

@media (max-width: 768px) {
  .q-card {
    width: 100%;
    max-width: 90%;
    padding: 1rem;
  }
}
</style>

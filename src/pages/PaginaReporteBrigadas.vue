<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white">
        <div class="text-h6">Reporte de Brigadas por Campaña</div>
      </q-card-section>

      <!-- Sección de selección de campaña mejorada para móviles -->
      <q-card-section>
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-8">
            <q-select v-model="campaniaSeleccionada" :options="campanias" option-label="nombre" option-value="id"
              label="Selecciona una campaña" emit-value map-options @update:model-value="cargarBrigadas" outlined
              use-input input-debounce="0" @filter="filtrarCampanias" :filter-function="() => true" clearable
              class="full-width">
              <template v-slot:append>
                <q-icon v-if="campaniaSeleccionada" name="close" class="cursor-pointer"
                  @click.stop="limpiarSeleccionCampania" />
              </template>
            </q-select>
          </div>
          <div class="col-12 col-sm-4 q-mt-sm q-mt-sm-none">
            <q-btn color="warning" icon="refresh" label="Nueva selección" @click="limpiarSeleccionCampania"
              :disable="!campaniaSeleccionada" class="full-width" />
          </div>
        </div>
      </q-card-section>

      <!-- Botones de descarga reorganizados para móviles -->
      <q-card-section v-if="brigadas.length">
        <div class="row q-col-gutter-sm">
          <!-- Botones de descarga en móviles se apilan -->
          <div class="col-12 col-md-4">
            <q-btn label="Descargar solo brigadas" icon="download" color="primary" @click="descargarSoloBrigadas"
              class="full-width q-mb-sm" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn label="Descargar todas con miembros" icon="group_add" color="secondary"
              @click="descargarBrigadasConMiembros" class="full-width q-mb-sm" />
          </div>
          <div class="col-12 col-md-4">
            <q-btn label="Descargar seleccionadas" icon="assignment" color="accent" @click="descargarSeleccionadas"
              :disable="!seleccionadas.length" class="full-width q-mb-sm" />
          </div>
          <!-- Botón para limpiar selección en una nueva fila -->
          <div class="col-12" v-if="seleccionadas.length">
            <q-btn label="Limpiar selección" flat dense color="warning" icon="clear_all" @click="seleccionadas = []"
              class="full-width" />
          </div>
        </div>

        <!-- Buscador independiente para mejor visualización en móviles -->
        <div class="row q-mt-md">
          <div class="col-12">
            <q-input v-model="busqueda" outlined dense placeholder="Buscar brigadas o zonas..." class="full-width"
              clearable debounce="300">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
        </div>

        <!-- Tabla responsiva -->
        <div class="q-mt-md">
          <!-- Versión desktop de la tabla -->
          <div class="desktop-only">
            <q-table :rows="brigadasFiltradas" :columns="columnas" row-key="id" selection="multiple"
              :selected="seleccionadas" @update:selected="seleccionadas = $event" :pagination="paginacion"
              @request="onRequest" :loading="loading" flat bordered class="my-sticky-header-table">
              <template v-slot:header="props">
                <q-tr :props="props">
                  <q-th auto-width />
                  <q-th v-for="col in props.cols" :key="col.name" :props="props" class="text-weight-bold">
                    {{ col.label }}
                  </q-th>
                </q-tr>
              </template>

              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td auto-width>
                    <q-checkbox v-model="props.selected" />
                  </q-td>
                  <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    <div v-if="col.name !== 'miembros'">{{ col.value }}</div>
                    <q-btn v-else dense flat icon="groups" @click="verMiembros(props.row)" color="primary"
                      label="Ver miembros" class="no-wrap" />
                  </q-td>
                </q-tr>
              </template>

              <template v-slot:no-data>
                <div class="full-width row flex-center text-accent q-gutter-sm q-pa-lg">
                  <q-icon size="2em" name="search" />
                  <span>No se encontraron brigadas que coincidan con la búsqueda</span>
                </div>
              </template>
            </q-table>
          </div>

          <!-- Versión móvil de la tabla usando q-list -->
          <div class="mobile-only q-mt-md">
            <q-list bordered separator>
              <q-item v-for="brigada in brigadasPaginadas" :key="brigada.id" class="q-py-md">
                <q-item-section avatar>
                  <q-checkbox v-model="seleccionadas" :val="brigada" />
                </q-item-section>

                <q-item-section>
                  <q-item-label class="text-weight-bold">{{ brigada.nombre }}</q-item-label>
                  <q-item-label caption>Zona: {{ brigada.centro }}</q-item-label>
                  <q-item-label caption class="text-primary">
                    <q-icon name="people" size="xs" /> Miembros: {{ brigada.miembros?.length || 0 }}
                  </q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-btn dense flat icon="groups" @click="verMiembros(brigada)" color="primary" round>
                    <q-tooltip>Ver miembros</q-tooltip>
                  </q-btn>
                </q-item-section>
              </q-item>

              <q-item v-if="!brigadasFiltradas.length" class="text-center">
                <q-item-section>
                  <div class="row flex-center text-accent q-gutter-sm q-pa-lg">
                    <q-icon size="2em" name="search" />
                    <span>No se encontraron brigadas</span>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>

            <div class="row justify-between items-center q-mt-md">
              <div class="col-auto">
                <q-pagination v-model="paginacion.page"
                  :max="Math.ceil(brigadasFiltradas.length / paginacion.rowsPerPage)" :max-pages="3" boundary-numbers
                  direction-links size="sm" />
              </div>
              <div class="col-auto">
                <q-select v-model="paginacion.rowsPerPage" :options="[5, 10, 20]" dense outlined label="Filas"
                  style="width: 85px" />
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Diálogo de miembros optimizado -->
    <q-dialog v-model="dialogoMiembros" persistent>
      <q-card style="width: 90vw; max-width: 500px">
        <q-card-section class="bg-primary text-white">
          <div class="row items-center">
            <div class="col text-h6">
              Miembros de {{ brigadaActual?.nombre }}
            </div>
            <div class="col-auto">
              <q-btn flat round dense icon="close" v-close-popup />
            </div>
          </div>
        </q-card-section>

        <q-card-section class="q-pa-none">
          <!-- Versión desktop de la tabla de miembros -->
          <div class="desktop-only">
            <q-table :rows="brigadaActual?.miembros || []" :columns="columnasMiembros" row-key="id" flat bordered
              dense />
          </div>

          <!-- Versión móvil de la tabla de miembros -->
          <div class="mobile-only">
            <q-list bordered separator>
              <q-item v-for="miembro in brigadaActual?.miembros || []" :key="miembro.id" class="q-py-sm">
                <q-item-section>
                  <q-item-label class="text-weight-bold">
                    {{ miembro.persona.nombres }} {{ miembro.persona.apellidos }}
                  </q-item-label>
                  <q-item-label caption>
                    CI: {{ miembro.persona.ci }}
                  </q-item-label>
                  <q-item-label caption>
                    Teléfono: {{ miembro.persona.telefono }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="!brigadaActual?.miembros?.length" class="text-center">
                <q-item-section>
                  <div class="row flex-center text-accent q-pa-md">
                    <q-icon size="2em" name="groups_off" />
                    <span class="q-ml-sm">No hay miembros en esta brigada</span>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, getCurrentInstance, computed } from 'vue'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const { appContext } = getCurrentInstance()
const $api = appContext.config.globalProperties.$api

const campanias = ref([])
const campaniasFiltradas = ref([])
const campaniaSeleccionada = ref(null)
const brigadas = ref([])
const seleccionadas = ref([])
const dialogoMiembros = ref(false)
const brigadaActual = ref(null)
const busqueda = ref('')
const loading = ref(false)

const paginacion = ref({
  page: 1,
  rowsPerPage: 10,
  sortBy: 'nombre',
  descending: false
})

const columnas = [
  { name: 'nombre', label: 'Brigada', field: 'nombre', align: 'left', sortable: true },
  { name: 'centro', label: 'Zona', field: 'centro', align: 'left', sortable: true },
  { name: 'miembros', label: 'Miembros', field: row => row.miembros?.length || 0, align: 'center', sortable: true }
]

const columnasMiembros = [
  { name: 'nombres', label: 'Nombre', field: row => `${row.persona.nombres} ${row.persona.apellidos}`, align: 'left' },
  { name: 'ci', label: 'CI', field: row => row.persona.ci, align: 'left' },
  { name: 'telefono', label: 'Teléfono', field: row => row.persona.telefono, align: 'left' }
]

// Filtra las brigadas según la búsqueda
const brigadasFiltradas = computed(() => {
  if (!busqueda.value) return brigadas.value

  const textoBusqueda = busqueda.value.toLowerCase()
  return brigadas.value.filter(b =>
    b.nombre.toLowerCase().includes(textoBusqueda) ||
    b.centro.toLowerCase().includes(textoBusqueda)
  )
})

// Función para filtrar campañas al escribir en el selector
const filtrarCampanias = (val, update) => {
  if (val === '') {
    update(() => {
      campaniasFiltradas.value = campanias.value
    })
    return
  }

  update(() => {
    const needle = val.toLowerCase()
    campaniasFiltradas.value = campanias.value.filter(
      v => v.nombre.toLowerCase().indexOf(needle) > -1
    )
  })
}

onMounted(async () => {
  loading.value = true
  try {
    const { data } = await $api.get('/campanias')
    campanias.value = data
    campaniasFiltradas.value = data
  } catch (error) {
    console.error('Error al cargar campañas:', error)
  } finally {
    loading.value = false
  }
})

const limpiarSeleccionCampania = () => {
  campaniaSeleccionada.value = null
  brigadas.value = []
  seleccionadas.value = []
}

const cargarBrigadas = async (idCampania) => {
  if (!idCampania) {
    brigadas.value = []
    seleccionadas.value = []
    return
  }

  loading.value = true
  seleccionadas.value = []

  try {
    const { data } = await $api.get(`/campanias/${idCampania}/brigadas-con-miembros`)
    brigadas.value = data
  } catch (error) {
    console.error('Error al cargar brigadas:', error)
  } finally {
    loading.value = false
  }
}

const verMiembros = (brigada) => {
  brigadaActual.value = brigada
  dialogoMiembros.value = true
}

const onRequest = (props) => {
  paginacion.value.sortBy = props.pagination.sortBy
  paginacion.value.descending = props.pagination.descending
  paginacion.value.page = props.pagination.page
  paginacion.value.rowsPerPage = props.pagination.rowsPerPage
}

// Funciones mejoradas para generar PDFs
const descargarSoloBrigadas = () => {
  const doc = new jsPDF()

  // Título con estilo
  doc.setFillColor(41, 128, 185) // Color primario
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F')
  doc.setTextColor(255)
  doc.setFontSize(18)
  doc.text("Reporte de Brigadas por Campaña", doc.internal.pageSize.getWidth() / 2, 13, { align: "center" })

  // Subtítulo
  doc.setTextColor(0)
  doc.setFontSize(12)
  const campania = campanias.value.find(c => c.id === campaniaSeleccionada.value)
  doc.text(`Campaña: ${campania?.nombre || ''}`, 14, 30)

  // Tabla con estilo
  const rows = brigadas.value.map(b => [b.nombre, b.centro])
  autoTable(doc, {
    head: [['Brigada', 'Zona']],
    body: rows,
    startY: 35,
    headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    margin: { top: 35 }
  })

  // Pie de página
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(150)
    doc.text(
      `Página ${i} de ${pageCount} - Generado el ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    )
  }

  doc.save('brigadas.pdf')
}

const descargarBrigadasConMiembros = () => {
  const doc = new jsPDF()

  // Título con estilo
  doc.setFillColor(41, 128, 185) // Color primario
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F')
  doc.setTextColor(255)
  doc.setFontSize(18)
  doc.text("Brigadas y Miembros", doc.internal.pageSize.getWidth() / 2, 13, { align: "center" })

  // Subtítulo
  doc.setTextColor(0)
  doc.setFontSize(12)
  const campania = campanias.value.find(c => c.id === campaniaSeleccionada.value)
  doc.text(`Campaña: ${campania?.nombre || ''}`, 14, 25)

  let pageHeight = doc.internal.pageSize.getHeight()
  let y = 35
  let pageNumber = 1

  brigadas.value.forEach((b, index) => {
    if (y > pageHeight - 60) {
      doc.addPage()
      pageNumber++
      y = 20
    }

    // Título de la brigada con estilo
    doc.setFillColor(52, 152, 219) // Color secundario
    doc.rect(14, y, doc.internal.pageSize.getWidth() - 28, 10, 'F')
    doc.setTextColor(255)
    doc.setFontSize(12)
    doc.text(`Brigada: ${b.nombre} - Zona: ${b.centro}`, doc.internal.pageSize.getWidth() / 2, y + 7, { align: "center" })

    // Tabla de miembros
    const miembrosData = b.miembros.map(m => [
      `${m.persona.nombres} ${m.persona.apellidos}`,
      m.persona.ci,
      m.persona.telefono
    ])

    autoTable(doc, {
      head: [['Nombre', 'CI', 'Teléfono']],
      body: miembrosData,
      startY: y + 12,
      headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 20, right: 20 }
    })

    y = doc.lastAutoTable.finalY + 20
  })

  // Pie de página
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(150)
    doc.text(
      `Página ${i} de ${pageCount} - Generado el ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    )
  }

  doc.save('brigadas_con_miembros.pdf')
}

const descargarSeleccionadas = () => {
  if (!seleccionadas.value.length) return

  const doc = new jsPDF()

  // Título con estilo
  doc.setFillColor(156, 39, 176) // Color acento
  doc.rect(0, 0, doc.internal.pageSize.getWidth(), 20, 'F')
  doc.setTextColor(255)
  doc.setFontSize(18)
  doc.text("Brigadas Seleccionadas y Miembros", doc.internal.pageSize.getWidth() / 2, 13, { align: "center" })

  // Subtítulo
  doc.setTextColor(0)
  doc.setFontSize(12)
  const campania = campanias.value.find(c => c.id === campaniaSeleccionada.value)
  doc.text(`Campaña: ${campania?.nombre || ''} - Seleccionadas: ${seleccionadas.value.length} brigadas`, 14, 25)

  let pageHeight = doc.internal.pageSize.getHeight()
  let y = 35
  let pageNumber = 1

  seleccionadas.value.forEach((b, index) => {
    if (y > pageHeight - 60) {
      doc.addPage()
      pageNumber++
      y = 20
    }

    // Título de la brigada con estilo
    doc.setFillColor(156, 39, 176, 0.7) // Color acento con transparencia
    doc.rect(14, y, doc.internal.pageSize.getWidth() - 28, 10, 'F')
    doc.setTextColor(255)
    doc.setFontSize(12)
    doc.text(`Brigada: ${b.nombre} - Zona: ${b.centro}`, doc.internal.pageSize.getWidth() / 2, y + 7, { align: "center" })

    // Tabla de miembros
    const miembrosData = b.miembros.map(m => [
      `${m.persona.nombres} ${m.persona.apellidos}`,
      m.persona.ci,
      m.persona.telefono
    ])

    autoTable(doc, {
      head: [['Nombre', 'CI', 'Teléfono']],
      body: miembrosData,
      startY: y + 12,
      headStyles: { fillColor: [156, 39, 176], textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 20, right: 20 }
    })

    y = doc.lastAutoTable.finalY + 20
  })

  // Pie de página
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(10)
    doc.setTextColor(150)
    doc.text(
      `Página ${i} de ${pageCount} - Generado el ${new Date().toLocaleDateString()}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    )
  }

  doc.save('brigadas_seleccionadas.pdf')
}
const brigadasPaginadas = computed(() => {
  const start = (paginacion.value.page - 1) * paginacion.value.rowsPerPage
  const end = start + paginacion.value.rowsPerPage
  return brigadasFiltradas.value.slice(start, end)
})
</script>

<style>
.my-card {
  width: 100%;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.my-sticky-header-table {
  /* height or max-height is important */
  max-height: 500px;
}

.my-sticky-header-table .q-table__top,
.my-sticky-header-table .q-table__bottom,
.my-sticky-header-table thead tr:first-child th {
  background-color: white;
}

.my-sticky-header-table thead tr th {
  position: sticky;
  z-index: 1;
}

.my-sticky-header-table thead tr:first-child th {
  top: 0;
}

/* Reglas para manejo de vistas móviles y desktop */
@media (max-width: 599px) {
  .desktop-only {
    display: none !important;
  }
}

@media (min-width: 600px) {
  .mobile-only {
    display: none !important;
  }
}

/* Eliminar el fondo amarillo */
html,
body {
  background-color: white !important;
}

/* Estilo global para toda la aplicación */
#q-app {
  background-color: white !important;
}

/* Asegurarse de que el contenedor principal no tenga fondo amarillo */
.q-layout,
.q-page-container,
.q-page {
  background-color: white !important;
}

/* Asegurar que los botones tengan un buen espaciado en móvil */
.q-btn {
  min-height: 36px;
}

/* Mejorar visualización de tablas en móvil */
.q-table__container {
  border-radius: 8px !important;
  overflow: hidden;
}
</style>

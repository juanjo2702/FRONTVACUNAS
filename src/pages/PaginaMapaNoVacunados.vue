<template>
  <div class="pagina-no-vacunados">
    <div id="map" class="mapa"></div>

    <div class="acciones">
      <q-btn label="Descargar PDF" color="primary" icon="download" @click="generarPDF" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, getCurrentInstance, ref } from 'vue'
import L from 'leaflet'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

const { appContext } = getCurrentInstance()
const $api = appContext.config.globalProperties.$api

const propietarios = ref([])

onMounted(async () => {
  const map = L.map('map').setView([-17.3935, -66.1570], 12)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  try {
    const { data } = await $api.get('/propietarios-no-vacunados')
    propietarios.value = data

    data.forEach(p => {
      if (p.latitud && p.longitud) {
        const nombre = `${p.persona?.nombres || ''} ${p.persona?.apellidos || ''}`
        const mascotas = p.mascotas.map(m => `${m.nombre} (${m.especie})`).join('<br>')

        L.marker([p.latitud, p.longitud])
          .addTo(map)
          .bindPopup(`<strong>${nombre}</strong><br>Mascotas sin vacunar:<br>${mascotas}`)
      }
    })
  } catch (error) {
    console.error("Error al obtener datos del backend:", error)
  }
})

function generarPDF() {
  const doc = new jsPDF()
  doc.text("Propietarios con Mascotas Sin Vacunar", 14, 15)

  const rows = propietarios.value.map(p => {
    const nombre = `${p.persona?.nombres || ''} ${p.persona?.apellidos || ''}`
    return [nombre, p.latitud, p.longitud]
  })

  autoTable(doc, {
    head: [['Propietario', 'Latitud', 'Longitud']],
    body: rows,
    startY: 20
  })

  doc.save('PropietariosNoVacunados.pdf')
}
</script>

<style>
@import "leaflet/dist/leaflet.css";

.pagina-no-vacunados {
  background-color: white;
  padding: 10px;
  min-height: 100vh; /* ✅ Asegura que la página cubra toda la altura */
}

.mapa {
  height: 600px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
}

.acciones {
  display: flex;
  justify-content: center;
}
</style>

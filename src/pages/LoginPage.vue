<template>
  <q-page class="q-pa-md login-page">
    <div class="login-container">
      <q-card class="login-card">
        <q-card-section class="row justify-center q-py-none">
          <q-icon name="medical_services" color="primary" size="64px" />
        </q-card-section>

        <q-card-section class="text-center">
          <div class="text-h5 text-primary q-mb-md">Sistema de Campañas</div>
          <p class="q-mb-lg">Accede para gestionar campañas de vacunación</p>

          <q-form @submit.prevent="onSubmit" class="q-gutter-md">
            <q-input filled v-model="nombre" label="Nombre de Usuario" outlined dense
              :rules="[val => !!val || 'El nombre de usuario es obligatorio']" clearable class="login-field">
              <template v-slot:prepend>
                <q-icon name="account_circle" />
              </template>
            </q-input>

            <q-input filled v-model="password" label="Contraseña" outlined dense
              :rules="[val => !!val || 'La contraseña es obligatoria']" :type="passwordVisible ? 'text' : 'password'"
              clearable class="login-field">
              <template v-slot:prepend>
                <q-icon name="lock" />
              </template>
              <template v-slot:append>
                <q-icon :name="passwordVisible ? 'visibility' : 'visibility_off'" class="cursor-pointer"
                  @click="togglePasswordVisibility" />
              </template>
            </q-input>

            <div class="button-group">
              <q-btn label="Iniciar Sesión" type="submit" color="primary" size="md" :disable="!canSubmit"
                class="button" />
              <q-btn label="Limpiar Campos" flat color="secondary" size="md" @click="resetFields" class="button" />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'boot/axios';
export default {
  name: 'LoginPage',
  setup() {
    const $q = useQuasar();
    const nombre = ref('');
    const password = ref('');
    const passwordVisible = ref(false);
    const router = useRouter(); // Accede al router

    // Validar si se puede hacer submit
    const canSubmit = computed(() => nombre.value && password.value);

    // Mostrar/ocultar la contraseña
    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };

    // Función para resetear los campos
    const resetFields = () => {
      nombre.value = '';
      password.value = '';
    };

    // Función para manejar el login
    const onSubmit = async () => {
      console.log("Intentando iniciar sesión con:", { nombre: nombre.value, password: password.value });

      if (!canSubmit.value) {
        $q.notify({
          color: 'red-5',
          textColor: 'white',
          icon: 'error',
          message: 'Por favor completa todos los campos',
          position: 'top',
          timeout: 3000
        });
        return;
      }

      // Datos del formulario de login
      const loginData = {
        nombre: nombre.value,
        password: password.value
      };

      try {
        // Hacer login
        const response = await api.post('/login', loginData);
        console.log(response.data); // Verificar el contenido de la respuesta del login

        if (response.data.success) {
          const userId = response.data.user.id;
          const roleId = response.data.user?.rol_id; // Cambié `role_id` por `rol_id` según la estructura de la respuesta de Postman
          // Obtiene el role_id del usuario autenticado
          console.log("Role ID obtenido:", roleId);


          // Guardar token, nombre de usuario y role_id
          localStorage.setItem('authToken', response.data.token);
          localStorage.setItem('userName', nombre.value);
          localStorage.setItem('userRoleId', roleId);

          // Verificar si el usuario está en la tabla 'brigadas' usando el usuario_id
          const brigadaResponse = await api.get(`/brigadas/usuario/${userId}`);

          if (brigadaResponse.data.exists) {
            const brigadaId = brigadaResponse.data.brigada_id; // API devuelve el ID de la brigada
            localStorage.setItem('brigadaUserId', brigadaId);
            console.log('Usuario es parte de brigadas, ID de brigada guardado en localStorage:', brigadaId);
          } else {
            console.log('Usuario no está en brigadas');
          }

          console.log("Login exitoso, redirigiendo...");

          // Redirigir según el role_id del usuario
          switch (parseInt(roleId)) {
            case 3: // Administrador
              router.push('/PaginaRegistroZona'); // Página para administrador
              break;
            case 2: // Jefe de Zona
              router.push('/PaginaRegistroJefeZona'); // Página para jefe de zona
              break;
            case 1: // Brigada
              router.push('/PaginaConsultaVacunas'); // Página para brigada
              break;
            default:
              $q.notify({
                type: 'negative',
                message: 'Rol desconocido, no se puede redirigir'
              });
          }

        } else {
          $q.notify({
            type: 'negative',
            message: 'Credenciales incorrectas'
          });
        }
      } catch (error) {
        console.error("Error en la solicitud de login:", error);
        $q.notify({
          type: 'negative',
          message: 'Error en el servidor'
        });
      }
    };

    return {
      nombre,
      password,
      passwordVisible,
      canSubmit,
      togglePasswordVisibility,
      resetFields,
      onSubmit
    };
  }
};
</script>


<style scoped>
.login-page {
  background: linear-gradient(to bottom right, #3c8dbc, #f3f3f3);
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-container {
  max-width: 400px;
  width: 100%;
}

.login-card {
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 20px;
}

.login-field {
  font-size: 16px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
}

.button {
  flex: 1;
  margin: 0 5px;
}

.button:first-child {
  margin-left: 0;
}

.button:last-child {
  margin-right: 0;
}

@media (max-width: 500px) {
  .button-group {
    flex-direction: column;
  }

  .button {
    margin: 5px 0;
  }
}
</style>

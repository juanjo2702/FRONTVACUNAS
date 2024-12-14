import { boot } from 'quasar/wrappers'
import axios from 'axios'

/* const api = axios.create({ baseURL: 'https://backvacunas.xpertiabo.com/api' })
const storage = axios.create({ baseURL: 'https://backvacunas.xpertiabo.com/storage' }) */
const api = axios.create({ baseURL: 'http://localhost:8000/api' })
const storage = axios.create({ baseURL: 'http://localhost:8000/storage' })
const customAxios = axios.create({
  baseURL: 'http://127.0.0.1:8000'
});
export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
  app.config.globalProperties.$storage = storage
  app.config.globalProperties.$customAxios = customAxios;
})

export { api, storage, customAxios }

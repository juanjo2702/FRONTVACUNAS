import { boot } from 'quasar/wrappers'
import axios from 'axios'

const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const backendBaseURL = isDev ? 'http://127.0.0.1:8000' : 'https://api.vacunas.xpertiaplus.com';

const api = axios.create({ baseURL: `${backendBaseURL}/api` })
const storage = axios.create({ baseURL: `${backendBaseURL}/storage` })
const customAxios = axios.create({
  baseURL: backendBaseURL
});

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
  app.config.globalProperties.$storage = storage
  app.config.globalProperties.$customAxios = customAxios;
})

export { api, storage, customAxios }

import axios from 'axios'

const TOKEN_STORAGE_KEY = 'ticketflow_token'

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    return
  }

  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

export const clearAuthToken = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_STORAGE_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthToken()

      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance

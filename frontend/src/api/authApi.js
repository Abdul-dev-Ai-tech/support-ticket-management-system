import axiosInstance from './axiosInstance'

export const register = async (data) => {
  const response = await axiosInstance.post('/api/auth/register', data)
  return response.data
}

export const login = async (data) => {
  const response = await axiosInstance.post('/api/auth/login', data)
  return response.data
}

export const getMe = async () => {
  const response = await axiosInstance.get('/api/auth/me')
  return response.data
}

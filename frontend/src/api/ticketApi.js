import axiosInstance from './axiosInstance'

export const getTickets = async (params = {}) => {
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, value]) => value !== undefined && value !== null && value !== '')
  )

  const response = await axiosInstance.get('/api/tickets/', { params: cleanParams })
  return response.data
}

export const getTicketById = async (id) => {
  const response = await axiosInstance.get(`/api/tickets/${id}`)
  return response.data
}

export const createTicket = async (data) => {
  const response = await axiosInstance.post('/api/tickets/', data)
  return response.data
}

export const updateTicket = async (id, data) => {
  const response = await axiosInstance.patch(`/api/tickets/${id}`, data)
  return response.data
}

export const deleteTicket = async (id) => {
  const response = await axiosInstance.delete(`/api/tickets/${id}`)
  return response.data
}

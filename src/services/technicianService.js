import axios from "axios"
import { API_URL } from "../config"

// Get all technicians
export const getAllTechnicians = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/api/technicians`)
    return data
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch technicians"
  }
}

// Get technician by ID
export const getTechnicianById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/technicians/${id}`)
    return data
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch technician"
  }
}

// Create a new technician (admin only)
export const createTechnician = async (technicianData, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const { data } = await axios.post(`${API_URL}/api/technicians`, technicianData, config)
    return data
  } catch (error) {
    throw error.response?.data?.message || "Failed to create technician"
  }
}

// Update technician (admin only)
export const updateTechnician = async (id, technicianData, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const { data } = await axios.put(`${API_URL}/api/technicians/${id}`, technicianData, config)
    return data
  } catch (error) {
    throw error.response?.data?.message || "Failed to update technician"
  }
}

// Delete technician (admin only)
export const deleteTechnician = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const { data } = await axios.delete(`${API_URL}/api/technicians/${id}`, config)
    return data
  } catch (error) {
    throw error.response?.data?.message || "Failed to delete technician"
  }
}

// Get technician stats (admin only)
export const getTechnicianStats = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const { data } = await axios.get(`${API_URL}/api/technicians/${id}/stats`, config)
    return data
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch technician stats"
  }
}


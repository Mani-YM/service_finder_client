import axios from "axios"
import { API_URL } from "../config"

// Create a new request
export const createRequest = async (requestData, token) => {
  const config = token
    ? {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    : {
        headers: {
          "Content-Type": "application/json",
        },
      }

  try {
    const { data } = await axios.post(`${API_URL}/api/requests`, requestData, config)
    return data
  } catch (error) {
    throw error.response?.data?.message || "Failed to create request"
  }
}

// Get request by ID
export const getRequestById = async (id) => {
  try {
    const { data } = await axios.get(`${API_URL}/api/requests/${id}`)
    return data
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch request"
  }
}

// Get user's requests
export const getMyRequests = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const { data } = await axios.get(`${API_URL}/api/requests/myRequests`, config)
    return data
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      throw error.response.data.message
    }
    throw "Failed to fetch your requests. Please try again."
  }
}

// Get user's requests
// export const getMyRequests = async (token) => {
//   const config = {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   }

//   try {
//     const { data } = await axios.get(`${API_URL}/api/requests/myRequests`, config)
//     return data
//   } catch (error) {
//     throw error.response?.data?.message || "Failed to fetch requests"
//   }
// }

// Get all requests (admin only)
export const getAllRequests = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const { data } = await axios.get(`${API_URL}/api/requests`, config)
    return data
  } catch (error) {
    throw error.response?.data?.message || "Failed to fetch requests"
  }
}

// Update request status (admin only)
export const updateRequestStatus = async (id, statusData, token) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }

  try {
    const { data } = await axios.put(`${API_URL}/api/requests/${id}/status`, statusData, config)
    return data
  } catch (error) {
    throw error.response?.data?.message || "Failed to update request status"
  }
}


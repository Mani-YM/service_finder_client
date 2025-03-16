"use client"

import { createContext, useState, useEffect } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { API_URL } from "../config"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Load user from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  // Register user
  const register = async (userData) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/register`, userData)
      setUser(data)
      localStorage.setItem("user", JSON.stringify(data))
      return data
    } catch (error) {
      throw error.response?.data?.message || "Registration failed"
    }
  }

  // Login user
  const login = async (email, password) => {
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password })
      setUser(data)
      localStorage.setItem("user", JSON.stringify(data))
      return data
    } catch (error) {
      throw error.response?.data?.message || "Login failed"
    }
  }

  // Logout user
  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    navigate("/")
  }

  // Update user profile
  const updateProfile = async (userData) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }

      const { data } = await axios.put(`${API_URL}/api/auth/profile`, userData, config)
      setUser(data)
      localStorage.setItem("user", JSON.stringify(data))
      return data
    } catch (error) {
      throw error.response?.data?.message || "Update failed"
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext


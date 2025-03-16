"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/admin/login" />
  }

  return children
}

export default AdminRoute


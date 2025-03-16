"use client"

import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import AuthContext from "../context/AuthContext"

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userData = await login(formData.email, formData.password)

      if (userData.role !== "admin") {
        toast.error("Not authorized as admin")
        return
      }

      toast.success("Admin login successful!")
      navigate("/admin/dashboard")
    } catch (error) {
      toast.error(error || "Login failed. Please check your credentials.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016zM12 9v2m0 4h.01"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-gray-600">Enter your admin credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="admin@gmail.com"
                required
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="form-input"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mt-6 space-y-4">
            <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Log in"}
            </button>
            <div className="text-center text-sm">
              <Link to="/" className="text-blue-600 hover:underline">
                Return to home page
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginPage


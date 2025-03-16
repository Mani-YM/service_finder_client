"use client"

import { useState, useEffect, useContext } from "react"
import { toast } from "react-toastify"
import AuthContext from "../context/AuthContext"
import { getAllTechnicians, createTechnician, updateTechnician, deleteTechnician } from "../services/technicianService"

const AdminTechniciansPage = () => {
  const { user } = useContext(AuthContext)
  const [technicians, setTechnicians] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [currentTechnician, setCurrentTechnician] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    mobile: "",
    email: "",
    specialization: "",
  })

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const data = await getAllTechnicians()
        setTechnicians(data)
      } catch (error) {
        toast.error("Failed to load technicians. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTechnicians()
  }, [])

  const handleSearch = (e) => {
    setSearchTerm(e.target.value)
  }

  const filteredTechnicians = technicians.filter(
    (tech) =>
      tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tech.specialization.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddTechnician = async () => {
    try {
      const newTechnician = await createTechnician(formData, user.token)
      setTechnicians([...technicians, newTechnician])
      setFormData({
        name: "",
        city: "",
        mobile: "",
        email: "",
        specialization: "",
      })
      setIsAddDialogOpen(false)
      toast.success(`${formData.name} has been added successfully.`)
    } catch (error) {
      toast.error(error || "Failed to add technician. Please try again.")
    }
  }

  const handleEditClick = (technician) => {
    setCurrentTechnician(technician)
    setFormData({
      name: technician.name,
      city: technician.city,
      mobile: technician.mobile,
      email: technician.email,
      specialization: technician.specialization,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateTechnician = async () => {
    try {
      const updatedTechnician = await updateTechnician(currentTechnician._id, formData, user.token)

      setTechnicians(technicians.map((tech) => (tech._id === currentTechnician._id ? updatedTechnician : tech)))

      setIsEditDialogOpen(false)
      toast.success(`${formData.name}'s information has been updated.`)
    } catch (error) {
      toast.error(error || "Failed to update technician. Please try again.")
    }
  }

  const handleDeleteTechnician = async (id) => {
    try {
      await deleteTechnician(id, user.token)
      setTechnicians(technicians.filter((tech) => tech._id !== id))
      toast.success("Technician removed successfully.")
    } catch (error) {
      toast.error(error || "Failed to delete technician. Please try again.")
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active"
      const updatedTechnician = await updateTechnician(id, { status: newStatus }, user.token)

      setTechnicians(technicians.map((tech) => (tech._id === id ? updatedTechnician : tech)))

      toast.success(`Technician is now ${newStatus}.`)
    } catch (error) {
      toast.error(error || "Failed to update technician status. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading technicians...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manage Technicians</h1>
          <p className="text-gray-600">Add, update, or remove technicians</p>
        </div>
        <button className="btn btn-primary flex items-center gap-2" onClick={() => setIsAddDialogOpen(true)}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Technician
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            placeholder="Search technicians by name, city, or specialization..."
            className="form-input pl-10"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filteredTechnicians.length > 0 ? (
          filteredTechnicians.map((technician) => (
            <div key={technician._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="font-medium text-gray-600">
                      {technician.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-medium">{technician.name}</h3>
                    <p className="text-sm text-gray-600">{technician.specialization}</p>
                    <div className="flex items-center mt-1">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          technician.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {technician.status.charAt(0).toUpperCase() + technician.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={() => handleEditClick(technician)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleToggleStatus(technician._id, technician.status)}
                  >
                    {technician.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    className="btn btn-sm bg-red-600 text-white hover:bg-red-700"
                    onClick={() => handleDeleteTechnician(technician._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <p className="text-sm font-medium">{technician.city}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mobile</p>
                  <p className="text-sm font-medium">{technician.mobile}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-sm font-medium">{technician.email}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-gray-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <h3 className="text-lg font-medium">No technicians found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or add a new technician</p>
          </div>
        )}
      </div>

      {/* Add Technician Dialog */}
      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Technician</h2>
            <p className="text-gray-600 mb-4">Enter the details of the new technician below.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="form-label">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="city" className="form-label">
                  City
                </label>
                <input
                  id="city"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="New York"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="mobile" className="form-label">
                  Mobile Number
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  className="form-input"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="555-123-4567"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="specialization" className="form-label">
                  Specialization
                </label>
                <input
                  id="specialization"
                  name="specialization"
                  className="form-input"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Plumbing, Electrical, etc."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="btn btn-secondary" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddTechnician}>
                Add Technician
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Technician Dialog */}
      {isEditDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit Technician</h2>
            <p className="text-gray-600 mb-4">Update the technician's information.</p>
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="edit-name" className="form-label">
                  Full Name
                </label>
                <input
                  id="edit-name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-city" className="form-label">
                  City
                </label>
                <input
                  id="edit-city"
                  name="city"
                  className="form-input"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-mobile" className="form-label">
                  Mobile Number
                </label>
                <input
                  id="edit-mobile"
                  name="mobile"
                  className="form-input"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-email" className="form-label">
                  Email
                </label>
                <input
                  id="edit-email"
                  name="email"
                  type="email"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-specialization" className="form-label">
                  Specialization
                </label>
                <input
                  id="edit-specialization"
                  name="specialization"
                  className="form-input"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button className="btn btn-secondary" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleUpdateTechnician}>
                Update Technician
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminTechniciansPage


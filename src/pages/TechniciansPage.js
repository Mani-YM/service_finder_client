"use client"

import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { getAllTechnicians } from "../services/technicianService"

const TechniciansPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [technicians, setTechnicians] = useState([])
  const [filteredTechnicians, setFilteredTechnicians] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTechnicians = async () => {
      try {
        const data = await getAllTechnicians()
        setTechnicians(data)
        setFilteredTechnicians(data)
      } catch (error) {
        toast.error("Failed to load technicians. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTechnicians()
  }, [])

  const handleSearch = (e) => {
    const term = e.target.value
    setSearchTerm(term)

    if (term.trim() === "") {
      setFilteredTechnicians(technicians)
    } else {
      const filtered = technicians.filter(
        (tech) =>
          tech.name.toLowerCase().includes(term.toLowerCase()) ||
          tech.city.toLowerCase().includes(term.toLowerCase()) ||
          tech.specialization.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredTechnicians(filtered)
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
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Available Technicians</h1>
          <p className="text-gray-600">Browse our qualified technicians ready to assist you</p>
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
              placeholder="Search by name, city, or specialization..."
              className="form-input pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {filteredTechnicians.length > 0 ? (
            filteredTechnicians.map((technician) => (
              <div key={technician._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{technician.name}</h3>
                      <p className="flex items-center mt-1 text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {technician.city}
                      </p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm font-medium">
                      {technician.specialization}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                    <span>{technician.mobile}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{technician.email}</span>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center">
                      <div className="text-yellow-500 mr-1">★</div>
                      <span className="font-medium">4.8</span>
                      <span className="text-gray-600 text-sm ml-1">rating</span>
                    </div>
                    <button className="btn btn-secondary btn-sm">Request Service</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
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
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default TechniciansPage


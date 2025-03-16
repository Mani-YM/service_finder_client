"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import AuthContext from "../context/AuthContext"
import { getAllRequests, updateRequestStatus } from "../services/requestService"
import { getAllTechnicians } from "../services/technicianService"

const AdminDashboardPage = () => {
  const { user } = useContext(AuthContext)
  const [requests, setRequests] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsData, techniciansData] = await Promise.all([getAllRequests(user.token), getAllTechnicians()])
        setRequests(requestsData)
        setTechnicians(techniciansData)
      } catch (error) {
        toast.error("Failed to load dashboard data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user.token])

  const filteredRequests = activeTab === "all" ? requests : requests.filter((request) => request.status === activeTab)

  const handleAssignTechnician = async (requestId, technicianId) => {
    try {
      await updateRequestStatus(requestId, { status: "assigned", technicianId }, user.token)

      // Update local state
      setRequests(
        requests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "assigned",
                technician: technicians.find((tech) => tech._id === technicianId),
                assignmentDate: new Date(),
              }
            : request,
        ),
      )

      toast.success("Technician assigned successfully!")
    } catch (error) {
      toast.error("Failed to assign technician. Please try again.")
    }
  }

  const handleMarkCompleted = async (requestId) => {
    try {
      await updateRequestStatus(requestId, { status: "completed" }, user.token)

      // Update local state
      setRequests(
        requests.map((request) =>
          request._id === requestId
            ? {
                ...request,
                status: "completed",
                completionDate: new Date(),
              }
            : request,
        ),
      )

      toast.success("Request marked as completed!")
    } catch (error) {
      toast.error("Failed to update request status. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage service requests and technicians</p>
        </div>
        <div className="flex gap-2">
          <Link to="/admin/technicians" className="btn btn-secondary flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
            Manage Technicians
          </Link>
          <Link to="/admin/reports" className="btn btn-secondary flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            Reports
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Requests</h3>
          <div className="text-3xl font-bold">{requests.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending Requests</h3>
          <div className="text-3xl font-bold">{requests.filter((r) => r.status === "pending").length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Active Technicians</h3>
          <div className="text-3xl font-bold">{technicians.filter((t) => t.status === "active").length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Completed Requests</h3>
          <div className="text-3xl font-bold">{requests.filter((r) => r.status === "completed").length}</div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Recent Service Requests</h2>
          <p className="text-gray-600 mb-4">Manage and assign service requests to technicians</p>
          <div className="space-y-4">
            {requests.slice(0, 3).map((request) => (
              <div key={request._id} className="flex items-start p-3 border rounded-lg">
                <div className="mr-4">
                  {request.status === "pending" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  ) : request.status === "assigned" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-8 w-8 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{request.requestInfo}</h4>
                      <p className="text-sm text-gray-600">ID: {request._id}</p>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "assigned"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {request.user ? request.user.name : "Anonymous"} • {request.contact.email}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-600">{new Date(request.createdAt).toLocaleDateString()}</p>
                    {request.status === "pending" ? (
                      <select
                        className="form-input h-8 py-0 text-sm"
                        defaultValue=""
                        onChange={(e) => {
                          if (e.target.value) {
                            handleAssignTechnician(request._id, e.target.value)
                          }
                        }}
                      >
                        <option value="" disabled>
                          Assign Technician
                        </option>
                        {technicians
                          .filter((tech) => tech.status === "active")
                          .map((tech) => (
                            <option key={tech._id} value={tech._id}>
                              {tech.name}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <div className="text-sm">
                        {request.technician && (
                          <span className="text-blue-600 font-medium">{request.technician.name}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button className="btn btn-secondary w-full">View All Requests</button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-2">Technician Overview</h2>
          <p className="text-gray-600 mb-4">Monitor technician availability and workload</p>
          <div className="space-y-4">
            {technicians.slice(0, 4).map((technician) => (
              <div key={technician._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    <span className="font-medium text-gray-600">
                      {technician.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">{technician.name}</p>
                    <p className="text-xs text-gray-600">{technician.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4 text-right">
                    <p className="text-sm font-medium">
                      {
                        requests.filter(
                          (r) => r.technician && r.technician._id === technician._id && r.status === "assigned",
                        ).length
                      }
                    </p>
                    <p className="text-xs text-gray-600">Assigned</p>
                  </div>
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${
                      technician.status === "active" ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link to="/admin/technicians" className="btn btn-secondary w-full block text-center">
              Manage Technicians
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b mb-4">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "all"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              All Requests
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab("assigned")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "assigned"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Assigned
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "completed"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Completed
            </button>
          </nav>
        </div>

        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <AdminRequestCard
                key={request._id}
                request={request}
                technicians={technicians.filter((tech) => tech.status === "active")}
                onAssign={handleAssignTechnician}
                onComplete={handleMarkCompleted}
              />
            ))
          ) : (
            <div className="text-center py-8">
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium">No requests found</h3>
              <p className="text-gray-600">
                There are no {activeTab !== "all" ? activeTab : ""} service requests at the moment.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AdminRequestCard = ({ request, technicians, onAssign, onComplete }) => {
  const [selectedTechnician, setSelectedTechnician] = useState("")

  const handleAssign = () => {
    if (selectedTechnician) {
      onAssign(request._id, selectedTechnician)
      setSelectedTechnician("")
    }
  }

  return (
    <div className="bg-white border rounded-lg shadow-sm p-6">
      <div className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{request.requestInfo}</h3>
            <p className="text-gray-600">Request ID: {request._id}</p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              request.status === "assigned"
                ? "bg-blue-100 text-blue-800"
                : request.status === "completed"
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </div>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{request.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm font-medium">Customer</p>
          <p className="text-sm">{request.user ? request.user.name : "Anonymous"}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Email</p>
          <p className="text-sm">{request.contact.email}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Submission Date</p>
          <p className="text-sm">{new Date(request.createdAt).toLocaleDateString()}</p>
        </div>
        <div>
          <p className="text-sm font-medium">Technician</p>
          <p className="text-sm">{request.technician ? request.technician.name : "Not assigned"}</p>
        </div>
      </div>

      {request.status === "pending" && (
        <div className="mt-4">
          <label htmlFor={`assign-${request._id}`} className="form-label">
            Assign Technician
          </label>
          <div className="flex gap-2 mt-1">
            <select
              id={`assign-${request._id}`}
              className="form-input"
              value={selectedTechnician}
              onChange={(e) => setSelectedTechnician(e.target.value)}
            >
              <option value="">Select a technician</option>
              {technicians.map((tech) => (
                <option key={tech._id} value={tech._id}>
                  {tech.name} - {tech.specialization}
                </option>
              ))}
            </select>
            <button className="btn btn-primary" onClick={handleAssign} disabled={!selectedTechnician}>
              Assign
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <button className="btn btn-secondary btn-sm flex items-center gap-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          View Details
        </button>
        {request.status === "assigned" && (
          <button className="btn btn-primary btn-sm" onClick={() => onComplete(request._id)}>
            Mark Completed
          </button>
        )}
      </div>
    </div>
  )
}

export default AdminDashboardPage


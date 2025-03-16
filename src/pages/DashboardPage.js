"use client"

import { useState, useEffect, useContext } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import AuthContext from "../context/AuthContext"
import { getMyRequests } from "../services/requestService"

const DashboardPage = () => {
  const { user } = useContext(AuthContext)
  const [requests, setRequests] = useState([])
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // useEffect(() => {
  //   const fetchRequests = async () => {
  //     try {
  //       const data = await getMyRequests(user.token)
  //       setRequests(data)
  //     } catch (error) {
  //       toast.error("Failed to load your requests. Please try again later.")
  //     } finally {
  //       setIsLoading(false)
  //     }
  //   }

  //   fetchRequests()
  // }, [user.token])

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setIsLoading(true)
        const data = await getMyRequests(user.token)
        console.log("Requests data received:", data)
        setRequests(data)
      } catch (error) {
        console.error("Error fetching requests:", error)
        toast.error(typeof error === "string" ? error : "Failed to load your requests. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
  
    if (user && user.token) {
      fetchRequests()
    }
  }, [user])
  
  const filteredRequests = activeTab === "all" ? requests : requests.filter((request) => request.status === activeTab)

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600">Manage your service requests</p>
        </div>
        <Link to="/requests/new" className="btn btn-primary flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Request
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Total Requests</h3>
          <div className="text-3xl font-bold">{requests.length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Pending</h3>
          <div className="text-3xl font-bold">{requests.filter((r) => r.status === "pending").length}</div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-sm font-medium text-gray-600 mb-2">Completed</h3>
          <div className="text-3xl font-bold">{requests.filter((r) => r.status === "completed").length}</div>
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
            filteredRequests.map((request) => <RequestCard key={request._id} request={request} />)
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
              <p className="text-gray-600 mb-4">
                You don't have any {activeTab !== "all" ? activeTab : ""} service requests yet.
              </p>
              <Link to="/requests/new" className="btn btn-primary">
                Submit a Request
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const RequestCard = ({ request }) => {
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
      <div className="flex items-center text-sm text-gray-600">
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
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Submitted on {new Date(request.createdAt).toLocaleDateString()}</span>
      </div>
      {request.technician && (
        <div className="flex items-center text-sm text-gray-600 mt-1">
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
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>Assigned to {request.technician.name}</span>
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
          Details
        </button>
        {request.status === "pending" && <button className="btn btn-primary btn-sm">Check Status</button>}
      </div>
    </div>
  )
}

export default DashboardPage


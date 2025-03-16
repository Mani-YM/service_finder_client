"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify"
import { getRequestById } from "../services/requestService"

const RequestStatusPage = () => {
  const [requestId, setRequestId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [requestData, setRequestData] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const data = await getRequestById(requestId)
      setRequestData(data)
    } catch (error) {
      toast.error("Could not find request with the provided ID. Please check and try again.")
      setRequestData(null)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Check Request Status</h1>
          <p className="text-gray-600">Enter your request ID to check the current status</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-4">Request Status Lookup</h2>
              <p className="text-gray-600 mb-4">
                Enter the request ID you received when submitting your service request
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="requestId" className="form-label">
                Request ID
              </label>
              <div className="flex gap-2">
                <input
                  id="requestId"
                  placeholder="Enter your request ID"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  required
                  className="form-input"
                />
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? "Checking..." : "Check"}
                </button>
              </div>
            </div>
          </form>
        </div>

        {requestData && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Request #{requestData._id}</h2>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    requestData.status === "assigned"
                      ? "bg-blue-100 text-blue-800"
                      : requestData.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {requestData.status.charAt(0).toUpperCase() + requestData.status.slice(1)}
                </div>
              </div>
              <p className="text-gray-600">{requestData.requestInfo}</p>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-600">{requestData.description}</p>
              </div>

              {requestData.status === "assigned" && requestData.technician ? (
                <div className="border rounded-md p-4">
                  <h3 className="font-medium flex items-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-blue-600"
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
                    Assigned Technician
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{requestData.technician.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium">{requestData.technician.mobile}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-600">Assignment Date</p>
                      <p className="font-medium">{new Date(requestData.assignmentDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border rounded-md p-4 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-3 text-yellow-500"
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
                  <div>
                    <h3 className="font-medium">Awaiting Assignment</h3>
                    <p className="text-sm text-gray-600">
                      Your request is pending assignment to a technician. You can view our available technicians below.
                    </p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-between mt-6">
              {requestData.status === "pending" && (
                <Link to="/technicians" className="btn btn-secondary">
                  View Technicians
                </Link>
              )}
              <Link to="/requests/new" className="btn btn-secondary">
                Submit Another Request
              </Link>
              <Link to="/dashboard" className="btn btn-primary">
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RequestStatusPage


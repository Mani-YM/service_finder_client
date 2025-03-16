"use client"
import { useSearchParams, Link } from "react-router-dom"

const RequestSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const requestId = searchParams.get("id") || "Unknown"

  return (
    <div className="container mx-auto flex items-center justify-center min-h-screen py-8">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 text-green-500"
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
          </div>
          <h1 className="text-2xl font-bold">Request Submitted!</h1>
          <p className="text-gray-600">Your service request has been successfully submitted</p>
        </div>
        <div className="space-y-4">
          <div className="p-4 bg-gray-100 rounded-md text-center">
            <p className="text-sm text-gray-600 mb-1">Your Request ID</p>
            <p className="text-2xl font-bold">{requestId}</p>
          </div>
          <p className="text-center text-gray-600">
            Please save this ID for tracking your request status. You will need it to check the progress of your service
            request.
          </p>
        </div>
        <div className="mt-6 space-y-2">
          <Link to="/requests/status" className="btn btn-primary w-full block text-center">
            Check Request Status
          </Link>
          <Link to="/dashboard" className="btn btn-secondary w-full block text-center">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RequestSuccessPage


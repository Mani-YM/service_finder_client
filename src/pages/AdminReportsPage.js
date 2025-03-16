"use client"

import { useState, useEffect, useContext } from "react"
import { toast } from "react-toastify"
import AuthContext from "../context/AuthContext"
import { getAllRequests } from "../services/requestService"
import { getAllTechnicians } from "../services/technicianService"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const AdminReportsPage = () => {
  const { user } = useContext(AuthContext)
  const [requests, setRequests] = useState([])
  const [technicians, setTechnicians] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [date, setDate] = useState(null)
  const [period, setPeriod] = useState("all-time")
  const [status, setStatus] = useState("all")
  const [technician, setTechnician] = useState("all")
  const [activeTab, setActiveTab] = useState("service-orders")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [requestsData, techniciansData] = await Promise.all([getAllRequests(user.token), getAllTechnicians()])
        setRequests(requestsData)
        setTechnicians(techniciansData)
      } catch (error) {
        toast.error("Failed to load report data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user.token])

  // Filter service orders based on selected filters
  const filteredOrders = requests.filter((order) => {
    // Filter by status
    if (status !== "all" && order.status !== status) {
      return false
    }

    // Filter by technician
    if (technician !== "all" && (!order.technician || order.technician._id !== technician)) {
      return false
    }

    // Filter by period
    if (period === "this-week") {
      const orderDate = new Date(order.createdAt)
      const today = new Date()
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()))
      return orderDate >= weekStart
    } else if (period === "this-month") {
      const orderDate = new Date(order.createdAt)
      const today = new Date()
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
      return orderDate >= monthStart
    } else if (period === "custom" && date) {
      const orderDate = new Date(order.createdAt).toDateString()
      const selectedDate = new Date(date).toDateString()
      return orderDate === selectedDate
    }

    return true
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading reports...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Reports</h1>
        <p className="text-gray-600">Generate and view service order reports</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="border-b mb-4">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab("service-orders")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "service-orders"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Service Orders
            </button>
            <button
              onClick={() => setActiveTab("technician-performance")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "technician-performance"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Technician Performance
            </button>
            <button
              onClick={() => setActiveTab("customer-analytics")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "customer-analytics"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Customer Analytics
            </button>
          </nav>
        </div>

        {activeTab === "service-orders" && (
          <div>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="w-full md:w-1/4">
                <label className="form-label">Time Period</label>
                <select className="form-input mt-1" value={period} onChange={(e) => setPeriod(e.target.value)}>
                  <option value="all-time">All Time</option>
                  <option value="this-week">This Week</option>
                  <option value="this-month">This Month</option>
                  <option value="custom">Custom Date</option>
                </select>
              </div>

              {period === "custom" && (
                <div className="w-full md:w-1/4">
                  <label className="form-label">Date</label>
                  <DatePicker
                    selected={date}
                    onChange={(date) => setDate(date)}
                    className="form-input mt-1 w-full"
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Select a date"
                  />
                </div>
              )}

              <div className="w-full md:w-1/4">
                <label className="form-label">Status</label>
                <select className="form-input mt-1" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="assigned">Assigned</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="w-full md:w-1/4">
                <label className="form-label">Technician</label>
                <select className="form-input mt-1" value={technician} onChange={(e) => setTechnician(e.target.value)}>
                  <option value="all">All Technicians</option>
                  {technicians.map((tech) => (
                    <option key={tech._id} value={tech._id}>
                      {tech.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Service Orders ({filteredOrders.length})</h3>
              <div className="flex gap-2">
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
                      d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                    />
                  </svg>
                  Print
                </button>
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
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>

            <div className="border rounded-md overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Request Info
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Technician
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Assignment Date
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Completion Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.requestInfo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user ? order.user.name : "Anonymous"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.technician ? order.technician.name : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.assignmentDate ? new Date(order.assignmentDate).toLocaleDateString() : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : order.status === "assigned"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.completionDate ? new Date(order.completionDate).toLocaleDateString() : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "technician-performance" && (
          <div className="text-center py-12">
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
            <h3 className="text-lg font-medium">Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Technician performance analytics will be available in a future update. This will include metrics like
              average completion time, customer satisfaction ratings, and more.
            </p>
          </div>
        )}

        {activeTab === "customer-analytics" && (
          <div className="text-center py-12">
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
            <h3 className="text-lg font-medium">Coming Soon</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Customer analytics will be available in a future update. This will include metrics like repeat service
              requests, customer satisfaction scores, and regional service distribution.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminReportsPage


"use client"

import { Link } from "react-router-dom"

const TermsPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Welcome to Service Finder. By using our platform, you agree to these Terms of Service. Please read them carefully.
          </p>
          <h2 className="text-xl font-semibold mb-2">Use of Service</h2>
          <p className="text-gray-600 mb-4">
            You may use Service Finder to request services and connect with technicians. You agree to provide accurate information and use the platform responsibly.
          </p>
          <h2 className="text-xl font-semibold mb-2">User Responsibilities</h2>
          <p className="text-gray-600 mb-4">
            You are responsible for maintaining the confidentiality of your account and for all activities under your account.
          </p>
          <h2 className="text-xl font-semibold mb-2">Limitation of Liability</h2>
          <p className="text-gray-600 mb-4">
            Service Finder is not liable for any disputes between users and technicians or for the quality of services provided.
          </p>
          <Link to="/" className="btn btn-primary mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
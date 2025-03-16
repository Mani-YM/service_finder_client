"use client"

import { Link } from "react-router-dom"

const AboutPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Service Finder</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            Welcome to Service Finder, your one-stop platform for connecting with skilled technicians to address your service needs efficiently and reliably.
          </p>
          <p className="text-gray-600 mb-4">
            Our mission is to streamline the process of requesting and managing services by providing an intuitive interface for users to submit requests, track their status, and connect with qualified professionals. Whether you need a quick fix or a specialized service, we’re here to help.
          </p>
          <p className="text-gray-600 mb-4">
            Founded in 2025, Service Finder leverages modern technology to bridge the gap between customers and service providers, ensuring transparency, quality, and satisfaction.
          </p>
          <Link to="/" className="btn btn-primary mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
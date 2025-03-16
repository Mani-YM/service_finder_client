"use client"

import { Link } from "react-router-dom"

const PrivacyPage = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-600 mb-4">
            At Service Finder, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data.
          </p>
          <h2 className="text-xl font-semibold mb-2">Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect information you provide when registering, submitting service requests, or contacting us, including your name, email, address, and contact details.
          </p>
          <h2 className="text-xl font-semibold mb-2">How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            Your data is used to process service requests, connect you with technicians, and improve our services. We do not sell or share your information with third parties except as required to fulfill your requests.
          </p>
          <h2 className="text-xl font-semibold mb-2">Data Security</h2>
          <p className="text-gray-600 mb-4">
            We implement industry-standard security measures to protect your data, though no system is completely immune to risks.
          </p>
          <Link to="/" className="btn btn-primary mt-4 inline-block">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
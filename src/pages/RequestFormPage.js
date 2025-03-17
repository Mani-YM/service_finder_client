"use client";

import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import { createRequest } from "../services/requestService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RequestFormPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [preferredDate, setPreferredDate] = useState(new Date());
  const [formData, setFormData] = useState({
    requestInfo: "",
    description: "",
    address: {
      line1: "",
      line2: "",
      city: "",
      state: "",
      zipCode: "",
    },
    contact: {
      email: user ? user.email : "",
      mobile: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Ensure user is logged in and token exists
    if (!user || !user.token) {
      toast.error("Please log in to submit a request.");
      setIsLoading(false);
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }

    try {
      const requestData = {
        ...formData,
        preferredDate,
      };

      const response = await createRequest(requestData, user.token);

      const requestId = response._id || Math.floor(100000 + Math.random() * 900000).toString();
      toast.success("Request submitted successfully!");
      navigate(`/requests/success?id=${requestId}`);
    } catch (error) {
      toast.error(error.message || "Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Submit a Service Request</h1>
          <p className="text-gray-600">Fill out the form below to submit a new service request</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Request Details</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="requestInfo" className="form-label">
                    Request Information
                  </label>
                  <input
                    id="requestInfo"
                    name="requestInfo"
                    placeholder="Brief title for your request"
                    required
                    className="form-input"
                    value={formData.requestInfo}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="description" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Detailed description of the service needed"
                    rows={4}
                    required
                    className="form-input"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Address Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="address.line1" className="form-label">
                    Address Line 1
                  </label>
                  <input
                    id="address.line1"
                    name="address.line1"
                    placeholder="Street address"
                    required
                    className="form-input"
                    value={formData.address.line1}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="address.line2" className="form-label">
                    Address Line 2
                  </label>
                  <input
                    id="address.line2"
                    name="address.line2"
                    placeholder="Apartment, suite, unit, etc. (optional)"
                    className="form-input"
                    value={formData.address.line2}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="address.city" className="form-label">
                      City
                    </label>
                    <input
                      id="address.city"
                      name="address.city"
                      required
                      className="form-input"
                      value={formData.address.city}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address.state" className="form-label">
                      State
                    </label>
                    <input
                      id="address.state"
                      name="address.state"
                      required
                      className="form-input"
                      value={formData.address.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="address.zipCode" className="form-label">
                      ZIP Code
                    </label>
                    <input
                      id="address.zipCode"
                      name="address.zipCode"
                      required
                      className="form-input"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="contact.email" className="form-label">
                    Email
                  </label>
                  <input
                    id="contact.email"
                    name="contact.email"
                    type="email"
                    required
                    className="form-input"
                    value={formData.contact.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="contact.mobile" className="form-label">
                    Mobile Number
                  </label>
                  <input
                    id="contact.mobile"
                    name="contact.mobile"
                    type="tel"
                    required
                    className="form-input"
                    value={formData.contact.mobile}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="space-y-2">
                <label className="form-label">Preferred Service Date</label>
                <DatePicker
                  selected={preferredDate}
                  onChange={(date) => setPreferredDate(date)}
                  minDate={new Date()}
                  className="form-input w-full"
                  dateFormat="MMMM d, yyyy"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isLoading}>
                {isLoading ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestFormPage;
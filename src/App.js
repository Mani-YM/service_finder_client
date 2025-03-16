import { Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// Layout Components
import Header from "./components/layout/Header"
import Footer from "./components/layout/Footer"

// Public Pages
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AdminLoginPage from "./pages/AdminLoginPage"
import TechniciansPage from "./pages/TechniciansPage"
import RequestFormPage from "./pages/RequestFormPage"
import RequestStatusPage from "./pages/RequestStatusPage"
import RequestSuccessPage from "./pages/RequestSuccessPage"
import AboutPage from "./pages/AboutPage.js" 
import ContactPage from "./pages/ContactPage.js" 
import PrivacyPage from "./pages/PrivacyPage.js" 
import TermsPage from "./pages/TermsPage.js" 

// Protected Pages
import DashboardPage from "./pages/DashboardPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import AdminTechniciansPage from "./pages/AdminTechniciansPage"
import AdminReportsPage from "./pages/AdminReportsPage"

// Route Protection
import PrivateRoute from "./components/routing/PrivateRoute"
import AdminRoute from "./components/routing/AdminRoute"

function App() {
  return (
    <>
      <Header />
      <main className="min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/technicians" element={<TechniciansPage />} />
          <Route path="/requests/new" element={<RequestFormPage />} />
          <Route path="/requests/status" element={<RequestStatusPage />} />
          <Route path="/requests/success" element={<RequestSuccessPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          {/* Protected Routes - Requester */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <DashboardPage />
              </PrivateRoute>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/technicians"
            element={
              <AdminRoute>
                <AdminTechniciansPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminRoute>
                <AdminReportsPage />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App


"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../../context/AuthContext"

const Header = () => {
  const { user, logout } = useContext(AuthContext)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <header className="bg-blue-600 text-white py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            Service Finder
          </Link>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/technicians" className="hover:text-blue-200">
              Technicians
            </Link>
            <Link to="/requests/new" className="hover:text-blue-200">
              Submit Request
            </Link>
            <Link to="/requests/status" className="hover:text-blue-200">
              Check Status
            </Link>

            {user ? (
              <>
                <Link to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"} className="hover:text-blue-200">
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-sm bg-white text-blue-600 hover:bg-blue-50">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm bg-white text-blue-600 hover:bg-blue-50">
                  Login
                </Link>
                <Link to="/register" className="btn btn-sm bg-blue-700 text-white hover:bg-blue-800">
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-2">
            <nav className="flex flex-col space-y-3">
              <Link to="/technicians" className="hover:text-blue-200" onClick={toggleMenu}>
                Technicians
              </Link>
              <Link to="/requests/new" className="hover:text-blue-200" onClick={toggleMenu}>
                Submit Request
              </Link>
              <Link to="/requests/status" className="hover:text-blue-200" onClick={toggleMenu}>
                Check Status
              </Link>

              {user ? (
                <>
                  <Link
                    to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
                    className="hover:text-blue-200"
                    onClick={toggleMenu}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      toggleMenu()
                    }}
                    className="text-left hover:text-blue-200"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="hover:text-blue-200" onClick={toggleMenu}>
                    Login
                  </Link>
                  <Link to="/register" className="hover:text-blue-200" onClick={toggleMenu}>
                    Register
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header


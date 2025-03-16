import { Link } from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-gray-100 border-t py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold">Service Finder</h2>
            <p className="text-gray-600">Streamlining service request management</p>
          </div>
          <div className="flex gap-8">
            <Link to="/about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
          </div>
        </div>
        <div className="mt-4 text-center text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} Service Finder. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer


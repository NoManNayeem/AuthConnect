// components/Footer.jsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50 py-6 border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} AuthConnect. All rights reserved.
            </p>
          </div>
          <div className="flex space-x-6">
            <Link href="/" className="text-sm text-gray-600 hover:text-blue-800">
              Home
            </Link>
            <Link href="/register" className="text-sm text-gray-600 hover:text-blue-800">
              Register
            </Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-blue-800">
              Login
            </Link>
            <Link href="/demo" className="text-sm text-gray-600 hover:text-blue-800">
              Demo
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
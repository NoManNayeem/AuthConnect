// components/Navbar.jsx
'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  
  return (
    <nav className="bg-white shadow-sm py-4">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-blue-800">
            AuthConnect
          </Link>
          <div className="flex space-x-4">
            <Link 
              href="/register" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/register' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Register
            </Link>
            <Link 
              href="/login" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/login' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Login
            </Link>
            <Link 
              href="/demo" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === '/demo' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Demo
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
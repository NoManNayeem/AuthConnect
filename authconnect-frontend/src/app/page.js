// app/page.jsx
import Link from 'next/link';
import Layout from './components/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-136px)] flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-16">
        <div className="max-w-md text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-800 mb-4">AuthConnect</h1>
          <p className="text-xl text-gray-600 mb-10">Authenticate and access protected routes with ease!</p>
          
          <div className="flex justify-center gap-4">
            <Link href="/register" className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-300 shadow-sm">
              Get Started
            </Link>
            <Link href="/login" className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-200 hover:bg-gray-50 transition duration-300 shadow-sm">
              Sign In
            </Link>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Secure Authentication</h2>
            <p className="text-gray-600">
              Industry-standard JWT authentication with password hashing ensures your data remains protected at all times.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Protected Routes</h2>
            <p className="text-gray-600">
              Control access to sensitive parts of your application with token-based authentication verification.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Rate Limiting</h2>
            <p className="text-gray-600">
              Built-in rate limiting for public users helps protect your API from overuse and potential attacks.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Modern Tech Stack</h2>
            <p className="text-gray-600">
              Built with Next.js frontend and FastAPI backend for optimal performance and developer experience.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
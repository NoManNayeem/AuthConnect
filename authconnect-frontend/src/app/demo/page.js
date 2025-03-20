'use client'

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from '../components/Layout';

export default function Demo() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchingDemo, setFetchingDemo] = useState(false);
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    // Check if user is authenticated
    if (token) {
      setIsAuthenticated(true);
      
      // Try to get user info if available in the JWT
      try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          if (payload.sub) {
            setUsername(payload.sub);
          }
        }
      } catch (error) {
        console.log('Could not parse token');
      }
    } else {
      // For public users, we don't redirect anymore
      setIsAuthenticated(false);
    }
    
    setIsLoading(false);
  }, []);

  const fetchDemoData = async () => {
    setFetchingDemo(true);
    const token = localStorage.getItem('token');
    
    try {
      let response;
      if (token) {
        // Authenticated user request
        response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/demo`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Public user request
        response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/demo`);
        
        // Update remaining requests for public users
        if (response.data.message) {
          const match = response.data.message.match(/You have (\d+) requests left/);
          if (match && match[1]) {
            setRemainingRequests(parseInt(match[1]));
          }
        }
      }
      
      setMessage(response.data.message);
    } catch (error) {
      if (error.response?.status === 401 && isAuthenticated) {
        // Handle expired token
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        toast.error('Session expired. Please log in again.');
      } else if (error.response?.status === 403) {
        // Public user limit reached
        setRemainingRequests(0);
        toast.error('You have reached the request limit. Please create an account for unlimited access.');
      } else {
        toast.error(error.response?.data?.detail || 'Failed to fetch data');
      }
    } finally {
      setFetchingDemo(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername('');
    setMessage('');
    toast.success('Logged out successfully');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[calc(100vh-136px)] flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-[calc(100vh-136px)] flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md border border-gray-100 p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Demo Page</h1>
            {isAuthenticated ? (
              <div className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 py-1.5 px-4 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="font-medium">{username}</span>
              </div>
            ) : (
              <div className="bg-gray-100 text-gray-600 py-1.5 px-4 rounded-full text-sm">
                Public User
              </div>
            )}
          </div>
          
          {!isAuthenticated && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-3 mb-6">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-yellow-700">
                  Public access is limited to 5 requests. {remainingRequests !== null && remainingRequests !== undefined && (
                    <span>You have <strong>{remainingRequests}</strong> {remainingRequests === 1 ? 'request' : 'requests'} left.</span>
                  )}
                </p>
              </div>
            </div>
          )}
          
          {message && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
              <h2 className="text-lg font-semibold mb-2 text-gray-800">Server Response:</h2>
              <div className="bg-white p-4 rounded-md border border-blue-100">
                <p className="text-gray-700">{message}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col space-y-4">
            <button 
              onClick={fetchDemoData}
              disabled={fetchingDemo || (!isAuthenticated && remainingRequests === 0)}
              className={`py-3 px-4 rounded-lg flex items-center justify-center font-medium shadow-sm ${
                !isAuthenticated && remainingRequests === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              } transition duration-300`}
            >
              {fetchingDemo ? (
                <span className="inline-flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Fetching...
                </span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  {!isAuthenticated && remainingRequests === 0 
                    ? "Request limit reached" 
                    : "Get Demo Data"}
                </>
              )}
            </button>
            
            {isAuthenticated ? (
              <button 
                onClick={handleLogout}
                className="bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition duration-300 font-medium flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-4-4H3zm6.293 11.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 111.414 1.414L7 11h6a1 1 0 110 2H7l2.293 2.293z" clipRule="evenodd" />
                </svg>
                Sign Out
              </button>
            ) : (
              <div className="grid grid-cols-2 gap-4 mt-2">
                <Link 
                  href="/login"
                  className="bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition duration-300 font-medium text-center"
                >
                  Login
                </Link>
                <Link 
                  href="/register"
                  className="bg-green-100 text-green-700 py-3 px-4 rounded-lg hover:bg-green-200 transition duration-300 font-medium text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </Layout>
  );
}
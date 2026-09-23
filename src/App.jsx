import './App.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import News from './components/News.jsx';
import SOSRequest from './components/SOSRequest.jsx';
import SafeZones from './components/SafeZones.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { Toaster } from "react-hot-toast"
import { useEffect, useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function App() {
  useEffect(() => {
    const checkAuth = async () => {
      const pathname = window.location.pathname;
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/user/check-auth`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          method: "GET"
        });

        const data = await res.json();
        if (data.success && pathname === '/login') {
          window.location.href = "/";
        } else if (!data.success) {
          // Token expired or invalid -> clean up credentials
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          if (pathname !== "/" && pathname !== "/login") {
            window.location.href = "/login";
          }
        }
      } catch (error) {
        console.log("Auth check error:", error);
      }
    };

    checkAuth();
  }, []);

  const router = createBrowserRouter([
    {
      path: "/login",
      element: (
        <div className="w-full">
          <Login />
        </div>
      )
    },
    // Home tab: Publicly accessible to everyone
    {
      path: "/",
      element: (
        <div className="w-full">
          <Navbar />
          <Home />
          <Footer />
        </div>
      )
    },
    // Secured routes: Only logged-in users can access
    {
      path: "/news",
      element: (
        <ProtectedRoute>
          <div className="w-full">
            <Navbar />
            <News />
            <Footer />
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/sosrequests",
      element: (
        <ProtectedRoute>
          <div className="w-full">
            <Navbar />
            <SOSRequest />
            <Footer />
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/safezones",
      element: (
        <ProtectedRoute>
          <div className="w-full">
            <Navbar />
            <SafeZones />
            <Footer />
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <div className="w-full">
            <Navbar />
            <Dashboard />
            <Footer />
          </div>
        </ProtectedRoute>
      )
    },
    {
      path: "*",
      element: <Navigate to="/" replace />
    }
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 w-full">
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-panel text-slate-900 font-medium',
          style: {
            background: '#ffffff',
            color: '#0f172a',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)',
          },
          success: {
            iconTheme: {
              primary: '#059669',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#e11d48',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}

export default App

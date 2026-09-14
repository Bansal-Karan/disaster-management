import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import News from './components/News.jsx';
import SOSRequest from './components/SOSRequest.jsx';
import SafeZones from './components/SafeZones.jsx';
import Login from './components/Login.jsx';
import Dashboard from './components/Dashboard.jsx';
import { Toaster } from "react-hot-toast"
import { useEffect, useState } from 'react';


function App() {


  useEffect(() => {
    const checkAuth = async () => {
      const pathname = window.location.pathname;
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch('http://localhost:5000/api/user/check-auth', {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          method: "GET"
        });

        const data = await res.json();
        if (data.success && pathname === '/login') {
          window.location.href = "/";
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
        < div className="w-full" >
          <Login />
        </div >)
    },
    {
      path: "/",
      element: (<div className="w-full">
        <Navbar />
        <Home />
        <Footer />
      </div>)
    },
    {
      path: "/news",
      element: (<div className="w-full">
        <Navbar />
        <News />
        <Footer />
      </div>)
    },
    {
      path: "/sosrequests",
      element: (<div className="w-full">
        <Navbar />
        <SOSRequest />
        <Footer />
      </div>)
    },
    {
      path: "/safezones",
      element: (<div className="w-full">
        <Navbar />
        <SafeZones />
        <Footer />
      </div>)
    },
    {
      path: "/dashboard",
      element: (<div className="w-full">
        <Navbar />
        <Dashboard />
        <Footer />
      </div>)
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#171a2e] text-slate-100">
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'glass-panel text-white font-medium',
          style: {
            background: 'rgba(30, 36, 70, 0.95)',
            color: '#f8fafc',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
}

export default App

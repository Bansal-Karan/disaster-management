import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import News from './components/News.jsx';
import SOSRequest from './components/SOSRequest.jsx';

function App() {

  const router = createBrowserRouter([
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
  ]);

  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App

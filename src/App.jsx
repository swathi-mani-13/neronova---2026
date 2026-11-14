import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SpiderEvilEye from './components/SpiderEvilEye';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Domains from './pages/Domains';
import Rules from './pages/Rules';
import Schedule from './pages/Schedule';
import Prizes from './pages/Prizes';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Register from './pages/Register';

// Admin Portal Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';

// Scroll to top on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-[#090909] text-white flex flex-col font-rajdhani relative selection:bg-[#E50914] selection:text-white">
      <ScrollToTop />

      {/* Futuristic Spider with Glowing Evil Eye: Displayed on every public page; NEVER inside /admin */}
      {!isAdminRoute && <SpiderEvilEye />}

      {/* Public Navbar (Hidden inside Admin portal) */}
      {!isAdminRoute && <Navbar />}

      {/* Main Content Area */}
      <div className="flex-grow">
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/prizes" element={<Prizes />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Fallback to Home */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      {/* Public Footer (Hidden inside Admin portal) */}
      {!isAdminRoute && <Footer />}
    </div>
  );
}

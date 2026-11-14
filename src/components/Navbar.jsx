import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield, ChevronRight, Zap } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Domains', path: '/domains' },
    { name: 'Rules', path: '/rules' },
    { name: 'Schedule', path: '/schedule' },
    { name: 'Prizes', path: '/prizes' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#090909]/90 backdrop-blur-md border-b border-[#E50914]/30 shadow-[0_4px_25px_rgba(0,0,0,0.8)]">
      {/* Top accent cyber line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E50914] to-[#FF3030]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: NERONOVA 2026 Branding + College Logo Space */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              {/* Glowing N Logo */}
              <div className="w-10 h-10 relative flex items-center justify-center">
                <img 
                  src="/logo.svg" 
                  alt="NERONOVA" 
                  className="w-full h-full filter drop-shadow-[0_0_8px_rgba(229,9,20,0.7)] group-hover:drop-shadow-[0_0_15px_rgba(255,48,48,0.9)] transition-all duration-300 transform group-hover:scale-105" 
                />
              </div>

              {/* Title & Badge */}
              <div className="flex flex-col">
                <div className="flex items-center space-x-1.5">
                  <span className="font-orbitron font-black text-xl md:text-2xl tracking-widest text-white group-hover:text-[#FF3030] transition-colors">
                    NERONOVA
                  </span>
                  <span className="font-orbitron font-bold text-lg md:text-xl text-[#E50914] cyber-glow-red">
                    2026
                  </span>
                </div>
                <span className="text-[9px] tracking-[0.25em] text-gray-400 uppercase font-mono">
                  INNOVATE • CODE • TRANSFORM
                </span>
              </div>
            </Link>

            {/* Designated College Logo Space (Empty reserved slot as specified) */}
            <div 
              className="hidden xl:flex items-center justify-center border border-dashed border-red-500/20 hover:border-red-500/40 rounded px-2.5 py-1 bg-black/40 text-[10px] text-gray-500 font-mono tracking-wider transition-colors"
              title="Reserved Space for College Logo"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500/50 mr-1.5 animate-pulse"></span>
              COLLEGE LOGO SPACE
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 text-sm font-semibold tracking-wide uppercase transition-all duration-200 relative ${
                    active
                      ? 'text-[#FF3030] font-bold'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#E50914] shadow-[0_0_8px_#FF3030]"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right: Register Now Action Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/register"
              className="relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-orbitron font-bold tracking-wider uppercase text-white bg-gradient-to-r from-[#E50914] to-[#b30009] hover:from-[#FF3030] hover:to-[#E50914] cyber-chamfer-btn shadow-neon-red hover:shadow-neon-red-lg transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group"
            >
              <Zap className="w-4 h-4 mr-2 text-white animate-pulse" />
              <span>Register Now</span>
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center space-x-3">
            <Link
              to="/register"
              className="px-3 py-1.5 text-xs font-orbitron font-bold text-white bg-[#E50914] rounded shadow-neon-red"
            >
              Register
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-[#FF3030]" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090909]/98 border-b border-[#E50914]/40 px-4 pt-3 pb-6 space-y-2 backdrop-blur-xl animate-fadeIn">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 text-base font-semibold uppercase tracking-wider rounded ${
                  active
                    ? 'bg-[#E50914]/20 text-[#FF3030] border-l-4 border-[#FF3030]'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          
          <div className="pt-3 border-t border-white/10">
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center px-4 py-3 text-center font-orbitron font-bold uppercase text-white bg-gradient-to-r from-[#E50914] to-[#FF3030] rounded shadow-neon-red"
            >
              Register Now <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="pt-2 text-center">
            <Link
              to="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex items-center text-xs text-gray-400 hover:text-[#FF3030] transition-colors py-1 font-mono"
            >
              <Shield className="w-3.5 h-3.5 mr-1" /> Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

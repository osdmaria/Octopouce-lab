import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark-slate-900/90 backdrop-blur-md border-b border-cyber-cyan-500/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-cyan-400 to-deep-blue-600 rounded-lg flex items-center justify-center group-hover:animate-pulse">
              <span className="text-dark-slate-900 font-cyber font-bold text-lg">🐙</span>
            </div>
            <div className="flex flex-col">
              <span className="text-cyber-cyan-100 font-cyber font-bold text-xl group-hover:text-glow transition-all duration-300">
                OctoLab
              </span>
              <span className="text-cyber-cyan-400 text-xs font-tech tracking-wider">
                CLASSIFIED
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {!isAuthenticated ? (
              <>
                <button
                  onClick={() => scrollToSection('accueil')}
                  className="nav-link font-tech"
                >
                  Accueil
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="nav-link font-tech"
                >
                  À propos
                </button>
                <button
                  onClick={() => scrollToSection('team')}
                  className="nav-link font-tech"
                >
                  Équipe
                </button>
                <button
                  onClick={() => scrollToSection('research')}
                  className="nav-link font-tech"
                >
                  Recherches
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="nav-link font-tech"
                >
                  Contact
                </button>
                <Link to="/login" className="btn-cyber">
                  Connexion
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="nav-link font-tech">
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-cyber-cyan-300 font-tech">
                    {user.name}
                  </span>
                  <span className="text-xs bg-cyber-cyan-600 text-dark-slate-900 px-2 py-1 rounded font-tech">
                    Niveau {user.clearanceLevel}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="btn-cyber text-sm"
                  >
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Menu Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-cyber-cyan-400 hover:text-cyber-cyan-300 transition-colors"
            >
              {isMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Menu Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-dark-slate-800/95 backdrop-blur-sm border-t border-cyber-cyan-500/30">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {!isAuthenticated ? (
                <>
                  <button
                    onClick={() => scrollToSection('accueil')}
                    className="block w-full text-left px-3 py-2 text-cyber-cyan-300 hover:text-cyber-cyan-100 font-tech transition-colors"
                  >
                    Accueil
                  </button>
                  <button
                    onClick={() => scrollToSection('about')}
                    className="block w-full text-left px-3 py-2 text-cyber-cyan-300 hover:text-cyber-cyan-100 font-tech transition-colors"
                  >
                    À propos
                  </button>
                  <button
                    onClick={() => scrollToSection('team')}
                    className="block w-full text-left px-3 py-2 text-cyber-cyan-300 hover:text-cyber-cyan-100 font-tech transition-colors"
                  >
                    Équipe
                  </button>
                  <button
                    onClick={() => scrollToSection('research')}
                    className="block w-full text-left px-3 py-2 text-cyber-cyan-300 hover:text-cyber-cyan-100 font-tech transition-colors"
                  >
                    Recherches
                  </button>
                  <button
                    onClick={() => scrollToSection('contact')}
                    className="block w-full text-left px-3 py-2 text-cyber-cyan-300 hover:text-cyber-cyan-100 font-tech transition-colors"
                  >
                    Contact
                  </button>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-cyber-cyan-400 hover:text-cyber-cyan-100 font-tech transition-colors"
                  >
                    Connexion
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 text-cyber-cyan-300 hover:text-cyber-cyan-100 font-tech transition-colors"
                  >
                    Dashboard
                  </Link>
                  <div className="px-3 py-2 text-cyber-cyan-300 font-tech">
                    {user.name} - Niveau {user.clearanceLevel}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-cyber-cyan-400 hover:text-cyber-cyan-100 font-tech transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
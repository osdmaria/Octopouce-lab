import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  LockClosedIcon,
  UserIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Erreur de connexion');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 octo-pattern"></div>
      
      {/* Particules flottantes */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-cyber-cyan-400 rounded-full animate-float opacity-20`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${5 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-cyan-400 to-deep-blue-600 rounded-lg flex items-center justify-center animate-pulse">
              <LockClosedIcon className="h-6 w-6 text-dark-slate-900" />
            </div>
            <div>
              <h1 className="text-3xl font-cyber font-bold text-glow">
                Accès Sécurisé
              </h1>
              <p className="text-cyber-cyan-400 font-tech text-sm">
                SYSTÈME D'AUTHENTIFICATION
              </p>
            </div>
          </div>
          
          <div className="bg-yellow-600/20 border border-yellow-500/50 rounded-lg p-3 mb-6">
            <div className="flex items-center space-x-2">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 flex-shrink-0" />
              <div className="text-left">
                <p className="text-yellow-300 font-tech text-sm font-semibold">
                  Zone d'accès restreint
                </p>
                <p className="text-yellow-400 font-tech text-xs">
                  Seul le personnel autorisé peut accéder à cette section
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Formulaire de connexion */}
        <div className="card-cyber">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-cyber-cyan-300 font-tech mb-2 text-sm">
                Identifiant de sécurité
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-cyan-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-cyber pl-10"
                  placeholder="votre.email@octolab.org"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-cyber-cyan-300 font-tech mb-2 text-sm">
                Code d'accès
              </label>
              <div className="relative">
                <LockClosedIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-cyber-cyan-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-cyber pl-10 pr-10"
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-cyan-400 hover:text-cyber-cyan-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Erreur */}
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 animate-fade-in">
                <div className="flex items-center space-x-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-300 font-tech text-sm">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-cyber-primary relative overflow-hidden ${
                loading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-dark-slate-900"></div>
                  <span>Authentification...</span>
                </div>
              ) : (
                <span>Accéder au système</span>
              )}
            </button>
          </form>
        </div>

        {/* Retour à l'accueil */}
        <div className="text-center mt-8">
          <Link 
            to="/" 
            className="text-cyber-cyan-400 hover:text-cyber-cyan-300 font-tech text-sm transition-colors"
          >
            ← Retour au site principal
          </Link>
        </div>

        {/* Footer de sécurité */}
        <div className="text-center mt-8 text-xs text-cyber-cyan-500 font-tech">
          <p>Système sécurisé OctoLab v2.1</p>
          <p>Toute tentative d'accès non autorisé sera enregistrée et signalée</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
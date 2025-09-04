import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { 
  BeakerIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  EnvelopeIcon,
  ExclamationTriangleIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

function Home() {
  const [team, setTeam] = useState([]);
  const [projects, setProjects] = useState([]);
  const [articles, setArticles] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [teamRes, projectsRes, articlesRes] = await Promise.all([
        axios.get('/api/team'),
        axios.get('/api/projects'),
        axios.get('/api/articles')
      ]);
      
      setTeam(teamRes.data.team || []);
      setProjects(projectsRes.data.projects || []);
      setArticles(articlesRes.data.articles || []);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('Message envoyé ! Nous vous recontacterons bientôt.');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormStatus(''), 5000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="pt-16">
      {/* Section Accueil */}
      <section id="accueil" className="section-cyber min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 octo-pattern"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <div className="animate-fade-in">
            <h1 className="text-6xl md:text-8xl font-cyber font-bold text-glow-strong mb-6">
              OctoLab
            </h1>
            <div className="text-cyber-cyan-400 text-xl md:text-2xl font-tech mb-8 tracking-wider">
              [ LABORATOIRE CLASSIFIÉ ]
            </div>
            <p className="text-2xl md:text-4xl font-tech text-cyber-cyan-200 mb-12 animate-pulse-slow">
              Explorer les frontières de l'intelligence biologique
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link to="#about" className="btn-cyber-primary text-lg px-8 py-4">
                Découvrir nos recherches
              </Link>
              <div className="flex items-center space-x-2 text-cyber-cyan-400">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span className="font-tech text-sm">Accès restreint - Niveau de sécurité élevé</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Particules flottantes */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 bg-cyber-cyan-400 rounded-full animate-float opacity-30`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${4 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </section>

      {/* Section À propos */}
      <section id="about" className="section-cyber bg-dark-slate-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cyber font-bold text-glow mb-6">
              À propos d'OctoLab
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyber-cyan-400 to-deep-blue-500 mx-auto mb-8"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <div className="card-cyber">
                <BeakerIcon className="h-16 w-16 text-cyber-cyan-400 mb-6" />
                <h3 className="text-2xl font-cyber font-bold text-cyber-cyan-200 mb-4">
                  Mission Classifiée
                </h3>
                <p className="text-cyber-cyan-300 font-tech leading-relaxed mb-4">
                  OctoLab est un laboratoire de recherche de pointe spécialisé dans l'étude 
                  des créatures hybrides parasitaires connues sous le nom d'"Octopouces". 
                  Ces entités fascinantes défient notre compréhension traditionnelle de 
                  l'intelligence biologique.
                </p>
                <p className="text-cyber-cyan-400 font-tech leading-relaxed">
                  Nos recherches explorent les mécanismes de symbiose, d'adaptation et 
                  de communication inter-espèces, ouvrant de nouvelles perspectives sur 
                  l'évolution de la conscience.
                </p>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="card-cyber">
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">🧬</div>
                  <h3 className="text-2xl font-cyber font-bold text-cyber-cyan-200">
                    Recherche Avancée
                  </h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyber-cyan-400 rounded-full"></div>
                    <span className="text-cyber-cyan-300 font-tech">Analyse génétique des spécimens</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyber-cyan-400 rounded-full"></div>
                    <span className="text-cyber-cyan-300 font-tech">Étude comportementale avancée</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyber-cyan-400 rounded-full"></div>
                    <span className="text-cyber-cyan-300 font-tech">Protocoles de communication</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyber-cyan-400 rounded-full"></div>
                    <span className="text-cyber-cyan-300 font-tech">Intelligence artificielle biologique</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Équipe */}
      <section id="team" className="section-cyber">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cyber font-bold text-glow mb-6">
              Notre Équipe
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyber-cyan-400 to-deep-blue-500 mx-auto mb-8"></div>
            <p className="text-cyber-cyan-400 font-tech text-lg max-w-2xl mx-auto">
              Des experts de renommée mondiale unis par une passion commune pour l'inconnu
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card-cyber group hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div 
                    className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-dark-slate-900 animate-pulse"
                    style={{ backgroundColor: member.avatar_color }}
                  >
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <h3 className="text-xl font-cyber font-bold text-cyber-cyan-200 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-cyber-cyan-400 font-tech text-sm mb-3">
                    {member.role}
                  </p>
                  <div className="text-xs bg-cyber-cyan-600/20 text-cyber-cyan-300 px-3 py-1 rounded-full inline-block mb-4">
                    {member.specialization}
                  </div>
                  <p className="text-cyber-cyan-300 font-tech text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Travaux Récents */}
      <section id="research" className="section-cyber bg-dark-slate-900/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cyber font-bold text-glow mb-6">
              Travaux Récents
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyber-cyan-400 to-deep-blue-500 mx-auto mb-8"></div>
          </div>
          
          {/* Projets de recherche */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {projects.map((project, index) => (
              <div key={index} className="card-cyber">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-cyber font-bold text-cyber-cyan-200">
                    {project.name}
                  </h3>
                  <span className="text-xs bg-cyber-cyan-600 text-dark-slate-900 px-2 py-1 rounded font-tech">
                    {project.progress}%
                  </span>
                </div>
                <p className="text-cyber-cyan-300 font-tech mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-cyber-cyan-400 font-tech">
                    Responsable: {project.lead_researcher}
                  </span>
                  <span className={`px-2 py-1 rounded text-xs font-tech ${
                    project.status === 'active' 
                      ? 'bg-green-600/20 text-green-400' 
                      : 'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    {project.status.toUpperCase()}
                  </span>
                </div>
                <div className="mt-4 bg-dark-slate-800 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyber-cyan-500 to-deep-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          

        </div>
      </section>

      {/* Section Contact */}
      <section id="contact" className="section-cyber">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-cyber font-bold text-glow mb-6">
              Contact Sécurisé
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyber-cyan-400 to-deep-blue-500 mx-auto mb-8"></div>
            <p className="text-cyber-cyan-400 font-tech text-lg">
              Communications chiffrées uniquement - Toute tentative d'intrusion sera tracée
            </p>
          </div>
          
          <div className="card-cyber max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-cyber-cyan-300 font-tech mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input-cyber"
                  placeholder="Votre identité"
                  required
                />
              </div>
              
              <div>
                <label className="block text-cyber-cyan-300 font-tech mb-2">
                  Adresse email sécurisée
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-cyber"
                  placeholder="votre.email@domaine.com"
                  required
                />
              </div>
              
              <div>
                <label className="block text-cyber-cyan-300 font-tech mb-2">
                  Message chiffré
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="input-cyber resize-none"
                  placeholder="Votre message sera automatiquement chiffré..."
                  required
                ></textarea>
              </div>
              
              <button type="submit" className="btn-cyber-primary w-full">
                <EnvelopeIcon className="h-5 w-5 inline mr-2" />
                Transmettre le message
              </button>
              
              {formStatus && (
                <div className="text-center text-green-400 font-tech animate-fade-in">
                  {formStatus}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-slate-950 border-t border-cyber-cyan-500/30 py-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-cyber-cyan-400 to-deep-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-dark-slate-900 font-cyber font-bold">🐙</span>
            </div>
            <span className="text-cyber-cyan-100 font-cyber font-bold text-xl">
              OctoLab
            </span>
          </div>
          <p className="text-cyber-cyan-400 font-tech mb-4">
            Laboratoire de Recherche Classifié OctoLab
          </p>
          <div className="text-cyber-cyan-500 font-tech text-sm">
            © 2025 OctoLab. Tous droits réservés. 
            <br className="md:hidden" />
            <span className="md:ml-2">Toute reproduction interdite sans autorisation.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
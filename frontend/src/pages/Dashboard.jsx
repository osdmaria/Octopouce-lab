import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import {
  DocumentTextIcon,
  BeakerIcon,
  ChartBarIcon,
  UserGroupIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ClockIcon,
  ShieldCheckIcon,
  CpuChipIcon,
  SignalIcon
} from '@heroicons/react/24/outline';

function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projets');
  const [dashboardData, setDashboardData] = useState({
    stats: {},
    projects: [],
    monitoring: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, projectsRes, monitoringRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/dashboard/data'),
        axios.get('/api/dashboard/monitoring')
      ]);

      setDashboardData({
        stats: statsRes.data,
        projects: projectsRes.data.projects,
        monitoring: monitoringRes.data.monitoring
      });
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'projets', name: 'Projets', icon: BeakerIcon },
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon }
  ];

  const renderProjectsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardData.projects.map((project, index) => (
          <div key={index} className="card-cyber">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  project.classification === 'TOP SECRET' ? 'bg-red-600/20 border border-red-500/50' :
                  project.classification === 'CONFIDENTIEL' ? 'bg-yellow-600/20 border border-yellow-500/50' :
                  'bg-green-600/20 border border-green-500/50'
                }`}>
                  <BeakerIcon className="h-5 w-5 text-cyber-cyan-400" />
                </div>
                <div>
                  <h3 className="font-cyber font-semibold text-cyber-cyan-200">
                    {project.title}
                  </h3>
                  <p className="text-xs font-tech text-cyber-cyan-400">
                    ID: {project.id}
                  </p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-tech ${
                project.classification === 'TOP SECRET' ? 'bg-red-600/20 text-red-300 border border-red-500/50' :
                project.classification === 'CONFIDENTIEL' ? 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/50' :
                'bg-green-600/20 text-green-300 border border-green-500/50'
              }`}>
                {project.classification}
              </span>
            </div>
            <p className="text-cyber-cyan-300 font-tech text-sm mb-4">
              {project.description}
            </p>
            <div className="flex items-center justify-between text-xs font-tech text-cyber-cyan-400">
              <span>Statut: {project.status}</span>
              <span>{project.progress}% complété</span>
            </div>
            <div className="w-full bg-dark-slate-700 rounded-full h-2 mt-2">
              <div 
                className="bg-gradient-to-r from-cyber-cyan-500 to-deep-blue-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderDocumentsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Documents récents */}
        <div className="card-cyber">
          <h3 className="font-cyber font-semibold text-cyber-cyan-200 mb-4 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2" />
            Documents récents
          </h3>
          <div className="space-y-3">
            {[
              { name: 'Rapport_Octopus_Alpha.pdf', date: '2024-01-15', classification: 'TOP SECRET' },
              { name: 'Analyse_Parasitaire_Beta.docx', date: '2024-01-14', classification: 'CONFIDENTIEL' },
              { name: 'Protocole_Containment_v3.pdf', date: '2024-01-13', classification: 'RESTREINT' },
              { name: 'Notes_Terrain_Gamma.txt', date: '2024-01-12', classification: 'CONFIDENTIEL' }
            ].map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-dark-slate-800/50 rounded-lg border border-cyber-cyan-500/20 hover:border-cyber-cyan-400/40 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <DocumentTextIcon className="h-4 w-4 text-cyber-cyan-400" />
                  <div>
                    <p className="font-tech text-sm text-cyber-cyan-200">{doc.name}</p>
                    <p className="font-tech text-xs text-cyber-cyan-400">{doc.date}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-tech ${
                  doc.classification === 'TOP SECRET' ? 'bg-red-600/20 text-red-300' :
                  doc.classification === 'CONFIDENTIEL' ? 'bg-yellow-600/20 text-yellow-300' :
                  'bg-green-600/20 text-green-300'
                }`}>
                  {doc.classification}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages cryptés */}
        <div className="card-cyber">
          <h3 className="font-cyber font-semibold text-cyber-cyan-200 mb-4 flex items-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Messages cryptés
          </h3>
          <div className="space-y-3">
            {[
              { from: 'Agent_Alpha', message: 'QWN0aXZhdGlvbiBkdSBwcm90b2NvbGUgT21lZ2E=', time: '14:32' },
              { from: 'Dr_Tentacle', message: 'TGVzIHNww6ljaW1lbnMgc29udCBwcsOqdHM=', time: '13:45' },
              { from: 'Base_Command', message: 'TWlzc2lvbiBhY2NvbXBsaWU=', time: '12:18' }
            ].map((msg, index) => (
              <div key={index} className="p-3 bg-dark-slate-800/50 rounded-lg border border-cyber-cyan-500/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-tech text-sm text-cyber-cyan-300">{msg.from}</span>
                  <span className="font-tech text-xs text-cyber-cyan-400">{msg.time}</span>
                </div>
                <p className="font-mono text-xs text-cyber-cyan-200 bg-dark-slate-900/50 p-2 rounded break-all">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );



  if (loading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyber-cyan-400 mx-auto mb-4"></div>
          <p className="text-cyber-cyan-300 font-tech">Chargement des données sécurisées...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-dark-slate-900 via-dark-slate-800 to-deep-blue-900">
      {/* Background pattern */}
      <div className="absolute inset-0 octo-pattern opacity-5"></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="bg-dark-slate-800/80 backdrop-blur-sm border-b border-cyber-cyan-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-cyber font-bold text-glow mb-2">
                  Centre de Contrôle OctoLab
                </h1>
                <div className="flex items-center space-x-4 text-sm font-tech">
                  <div className="flex items-center space-x-2">
                    <UserGroupIcon className="h-4 w-4 text-cyber-cyan-400" />
                    <span className="text-cyber-cyan-300">Agent: {user?.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ShieldCheckIcon className="h-4 w-4 text-cyber-cyan-400" />
                    <span className="text-cyber-cyan-300">Niveau: {user?.clearanceLevel}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="h-4 w-4 text-cyber-cyan-400" />
                    <span className="text-cyber-cyan-300">{new Date().toLocaleString('fr-FR')}</span>
                  </div>
                </div>
              </div>
              
              {/* Statistiques rapides */}
              <div className="hidden lg:flex space-x-6">
                {[
                  { label: 'Projets actifs', value: dashboardData.stats.activeProjects || 0, icon: BeakerIcon },
                  { label: 'Alertes', value: dashboardData.stats.alerts || 0, icon: ExclamationTriangleIcon },
                  { label: 'Systèmes', value: dashboardData.stats.systems || 0, icon: CpuChipIcon }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <stat.icon className="h-4 w-4 text-cyber-cyan-400" />
                      <span className="text-2xl font-cyber font-bold text-cyber-cyan-200">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-xs font-tech text-cyber-cyan-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation des onglets */}
        <div className="bg-dark-slate-800/60 backdrop-blur-sm border-b border-cyber-cyan-500/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-tech text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-cyber-cyan-400 text-cyber-cyan-300'
                        : 'border-transparent text-cyber-cyan-500 hover:text-cyber-cyan-400 hover:border-cyber-cyan-500'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activeTab === 'projets' && renderProjectsTab()}
          {activeTab === 'documents' && renderDocumentsTab()}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
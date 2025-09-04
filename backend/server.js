const express = require('express');
const cors = require('cors');
const path = require('path');
const { initDatabase } = require('./database/init');
const { router: authRoutes } = require('./routes/auth');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Headers de sécurité (ironiquement pour un lab "clandestin")
app.use((req, res, next) => {
  res.setHeader('X-Powered-By', 'OctoLab-Core-v2.1');
  res.setHeader('X-Lab-Status', 'CLASSIFIED');
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api', apiRoutes);

// Route de base
app.get('/', (req, res) => {
  res.json({
    message: 'OctoLab API Server',
    status: 'OPERATIONAL',
    version: '2.1.0',
    warning: 'Accès non autorisé détecté et enregistré'
  });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint non trouvé',
    message: 'Cette ressource n\'existe pas dans nos archives',
    code: 'RESOURCE_NOT_FOUND'
  });
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur:', err.stack);
  res.status(500).json({
    error: 'Erreur interne du serveur',
    message: 'Une anomalie a été détectée dans le système',
    code: 'INTERNAL_ERROR'
  });
});

// Initialisation de la base de données et démarrage du serveur
initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`🐙 OctoLab API Server démarré sur le port ${PORT}`);
    console.log(`📡 Endpoint principal: http://localhost:${PORT}`);
    console.log(`🔬 Statut du laboratoire: OPÉRATIONNEL`);
    console.log(`⚠️  Niveau de sécurité: CLASSIFIÉ`);
  });
}).catch(err => {
  console.error('❌ Erreur lors de l\'initialisation de la base de données:', err);
  process.exit(1);
});
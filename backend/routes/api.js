const express = require('express');
const { getDatabase } = require('../database/init');
const { authenticateToken } = require('./auth');

const router = express.Router();

// Route pour récupérer l'article intercepté
router.get('/articles', (req, res) => {
  const db = getDatabase();
  
  db.all(
    'SELECT * FROM articles WHERE leaked = 1 ORDER BY created_at DESC',
    [],
    (err, articles) => {
      if (err) {
        console.error('Erreur lors de la récupération des articles:', err);
        return res.status(500).json({
          error: 'Erreur système',
          message: 'Impossible d\'accéder aux archives'
        });
      }
      
      res.json({
        success: true,
        articles: articles.map(article => ({
          id: article.id,
          title: article.title,
          content: article.content,
          type: article.type,
          author: article.author,
          created_at: article.created_at
        }))
      });
    }
  );
});

// Route pour récupérer les projets de recherche (publics)
router.get('/projects', (req, res) => {
  const db = getDatabase();
  
  db.all(
    'SELECT name, description, status, lead_researcher, progress FROM research_projects WHERE status != "classified" ORDER BY created_at DESC',
    [],
    (err, projects) => {
      if (err) {
        console.error('Erreur lors de la récupération des projets:', err);
        return res.status(500).json({
          error: 'Erreur système',
          message: 'Accès aux données de recherche impossible'
        });
      }
      
      res.json({
        success: true,
        projects
      });
    }
  );
});

// Route pour récupérer les membres de l'équipe
router.get('/team', (req, res) => {
  const db = getDatabase();
  
  db.all(
    'SELECT name, role, specialization, avatar_color, bio FROM team_members WHERE status = "active" ORDER BY id',
    [],
    (err, team) => {
      if (err) {
        console.error('Erreur lors de la récupération de l\'équipe:', err);
        return res.status(500).json({
          error: 'Erreur système',
          message: 'Impossible d\'accéder aux données du personnel'
        });
      }
      
      res.json({
        success: true,
        team
      });
    }
  );
});

// Route VOLONTAIREMENT VULNÉRABLE pour le challenge éducatif
// ⚠️ ATTENTION: Cette route contient une injection SQL intentionnelle
router.get('/research', (req, res) => {
  const { id } = req.query;
  
  if (!id) {
    return res.status(400).json({
      error: 'Paramètre manquant',
      message: 'ID de recherche requis'
    });
  }
  
  const db = getDatabase();
  
  // VULNÉRABILITÉ INTENTIONNELLE: Injection SQL
  // En production, il faudrait utiliser des requêtes préparées
  const query = `SELECT * FROM research_projects WHERE id = ${id}`;
  
  console.log(`🔍 Requête exécutée: ${query}`);
  
  db.all(query, [], (err, results) => {
    if (err) {
      console.error('Erreur SQL:', err.message);
      return res.status(500).json({
        error: 'Erreur de requête',
        message: 'Requête malformée ou données corrompues',
        sql_error: err.message // Fuite d'information pour le challenge
      });
    }
    
    if (results.length === 0) {
      return res.status(404).json({
        error: 'Recherche non trouvée',
        message: 'Aucun projet correspondant à cet ID'
      });
    }
    
    res.json({
      success: true,
      data: results,
      query_executed: query // Information de debug (mauvaise pratique)
    });
  });
});

// Routes protégées pour le dashboard
router.get('/dashboard/stats', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  // Statistiques générales
  const queries = [
    'SELECT COUNT(*) as total_projects FROM research_projects',
    'SELECT COUNT(*) as active_projects FROM research_projects WHERE status = "active"',
    'SELECT COUNT(*) as total_articles FROM articles',
    'SELECT COUNT(*) as team_members FROM team_members WHERE status = "active"'
  ];
  
  let stats = {};
  let completed = 0;
  
  queries.forEach((query, index) => {
    db.get(query, [], (err, result) => {
      if (err) {
        console.error('Erreur stats:', err);
        return;
      }
      
      const key = Object.keys(result)[0];
      stats[key] = result[key];
      completed++;
      
      if (completed === queries.length) {
        res.json({
          success: true,
          stats,
          user_clearance: req.user.clearanceLevel
        });
      }
    });
  });
});

// Route pour les données du dashboard
router.get('/dashboard/data', authenticateToken, (req, res) => {
  const db = getDatabase();
  
  // Données selon le niveau d'habilitation
  const clearanceLevel = req.user.clearanceLevel;
  
  let projectQuery = 'SELECT * FROM research_projects';
  if (clearanceLevel < 4) {
    projectQuery += ' WHERE status != "classified"';
  }
  
  db.all(projectQuery, [], (err, projects) => {
    if (err) {
      console.error('Erreur données dashboard:', err);
      return res.status(500).json({
        error: 'Erreur système',
        message: 'Impossible de charger les données'
      });
    }
    
    // Messages cryptés fictifs
    const messages = [
      {
        id: 1,
        from: 'Dr. Deep',
        subject: 'Rapport Spécimen Alpha-7',
        preview: 'Les derniers tests révèlent des comportements...',
        encrypted: true,
        timestamp: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        from: 'Système de Sécurité',
        subject: 'Alerte: Accès non autorisé détecté',
        preview: 'Tentative d\'intrusion sur le serveur principal...',
        encrypted: false,
        timestamp: '2024-01-14T22:15:00Z'
      },
      {
        id: 3,
        from: 'Dr. [CENSURÉ]',
        subject: '[CLASSIFIÉ] Protocole Symbiose',
        preview: clearanceLevel >= 5 ? 'Phase 3 approuvée. Procéder aux tests...' : '[ACCÈS REFUSÉ]',
        encrypted: true,
        timestamp: '2024-01-13T14:45:00Z'
      }
    ];
    
    res.json({
      success: true,
      projects,
      messages,
      clearance_level: clearanceLevel
    });
  });
});

// Route pour simuler des données de monitoring
router.get('/dashboard/monitoring', authenticateToken, (req, res) => {
  // Données fictives de monitoring
  const monitoringData = {
    system_status: 'OPERATIONAL',
    containment_levels: {
      sector_a: 'SECURE',
      sector_b: 'SECURE',
      sector_c: 'CAUTION',
      sector_d: req.user.clearanceLevel >= 4 ? 'BREACH_DETECTED' : 'CLASSIFIED'
    },
    specimen_count: {
      active: 23,
      dormant: 7,
      escaped: req.user.clearanceLevel >= 5 ? 2 : 0
    },
    last_update: new Date().toISOString()
  };
  
  res.json({
    success: true,
    monitoring: monitoringData
  });
});

module.exports = router;
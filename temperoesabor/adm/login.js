/**
 * Login Page - Tempero & Sabor Admin
 */

import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { auth } from '../firebase-config.js';

const loginForm = document.getElementById('login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const errorMessage = document.getElementById('login-error');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    
    errorMessage.style.display = 'none';
    
    // Validação básica
    if (!email || !password) {
        errorMessage.textContent = 'Por favor, preencha todos os campos.';
        errorMessage.style.display = 'block';
        return;
    }
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // Redirecionar para admin
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Erro no login:', error);
        let errorMsg = 'Erro ao fazer login. ';
        
        switch (error.code) {
            case 'auth/user-not-found':
                errorMsg += 'Usuário não encontrado.';
                break;
            case 'auth/wrong-password':
                errorMsg += 'Senha incorreta.';
                break;
            case 'auth/invalid-email':
                errorMsg += 'Email inválido.';
                break;
            case 'auth/too-many-requests':
                errorMsg += 'Muitas tentativas. Tente novamente mais tarde.';
                break;
            case 'auth/invalid-credential':
                errorMsg += 'Email ou senha incorretos.';
                break;
            default:
                errorMsg += error.message;
        }
        
        errorMessage.textContent = errorMsg;
        errorMessage.style.display = 'block';
    }
});


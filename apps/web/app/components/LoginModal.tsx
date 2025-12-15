import React, { useState } from 'react';
import { Modal } from './Modal';
import styles from './AuthModal.module.css';
import api from '../lib/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export function LoginModal({ isOpen, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onLogin();
      onClose();
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h1 className={styles.title}>Sign in to X</h1>
        
        <button className={styles.socialButton}>
          <svg viewBox="0 0 24 24" className={styles.icon}>
            <g>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
            </g>
          </svg>
          Sign in with Google
        </button>
        
        <button className={styles.socialButton}>
          <svg viewBox="0 0 24 24" className={styles.icon} fill="currentColor">
            <g>
              <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.01-.06-.04-.22-.04-.39 0-1.15.572-2.27 1.206-2.98.804-.94 2.142-1.64 3.248-1.64.03 0 .05.01.05.01zm-3.215 4.54c-1.586 0-2.75.89-3.32 1.88-.45 1.17-.52 2.54.46 4.24.9 1.55 2.25 3.55 3.71 3.55.76 0 1.16-.41 1.83-.41.67 0 1.09.41 1.83.41.85 0 2.25-1.33 2.96-2.91-.65-.32-1.69-1.44-1.73-2.55-.04-1.48 1.29-2.23 1.35-2.27-1.02-1.3-2.6-1.94-3.52-1.94h-.01z"></path>
            </g>
          </svg>
          Sign in with Apple
        </button>

        <div className={styles.divider}>
          <div className={styles.line}></div>
          <span>or</span>
          <div className={styles.line}></div>
        </div>

        <input 
          type="text" 
          placeholder="Email" 
          className={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className={styles.input}
          style={{ marginTop: 12 }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}

        <button className={styles.nextButton} onClick={handleSubmit}>Log in</button>
        
        <button className={styles.forgotButton}>Forgot password?</button>
        
        <div className={styles.footer}>
          Don't have an account? <span className={styles.link}>Sign up</span>
        </div>
      </div>
    </Modal>
  );
}

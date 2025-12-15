import React, { useState } from 'react';
import { Modal } from './Modal';
import styles from './AuthModal.module.css';
import api from '../lib/api';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignup: () => void;
}

export function SignupModal({ isOpen, onClose, onSignup }: SignupModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await api.post('/auth/signup', { 
        email, 
        password, 
        name,
        username: username || email.split('@')[0] 
      });
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      onSignup();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        <h1 className={styles.title}>Create your account</h1>
        
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="Name" 
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        
        <div className={styles.inputGroup}>
          <input 
            type="text" 
            placeholder="Email" 
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <input 
            type="password" 
            placeholder="Password" 
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className={styles.dobSection}>
          <h3 className={styles.dobTitle}>Date of birth</h3>
          <p className={styles.dobDesc}>This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>
          
          <div className={styles.dobSelects}>
            <select className={styles.select} defaultValue="">
              <option value="" disabled>Month</option>
              <option>January</option>
              {/* Add months */}
            </select>
            <select className={styles.select} defaultValue="">
              <option value="" disabled>Day</option>
              <option>1</option>
              {/* Add days */}
            </select>
            <select className={styles.select} defaultValue="">
              <option value="" disabled>Year</option>
              <option>2024</option>
              {/* Add years */}
            </select>
          </div>
        </div>

        <div className={styles.spacer}></div>
        
        <button className={styles.nextButton} onClick={handleSubmit}>Sign up</button>
      </div>
    </Modal>
  );
}

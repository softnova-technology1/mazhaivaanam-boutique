import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button/Button';
import styles from './Login.module.css';

export const Login = ({ setCurrentTab, initialIsRegistering = false }) => {
  const { login, register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(initialIsRegistering);

  // Update state if prop changes (e.g. user navigates from nav again)
  React.useEffect(() => {
    setIsRegistering(initialIsRegistering);
  }, [initialIsRegistering]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      let result;
      if (isRegistering) {
        result = await register({
          firstName: username.trim(),
          lastName: 'Customer',
          email: email.trim(),
          password: password.trim()
        });
      } else {
        result = await login(email.trim() || username.trim(), password.trim());
      }
      setLoading(false);
      if (result.success) {
        setCurrentTab('shop');
      } else {
        setError(result.message || 'Authentication failed');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication error');
    }
  };

  return (
    <div className={`${styles['login-page']} container`}>
      <div className={`${styles['login-card']} glass-card`}>
        <h2>{isRegistering ? 'Create an Account' : 'Welcome Back'}</h2>
        <p className={styles['login-subtitle']}>
          {isRegistering ? 'Create your Mazhai Vaanam Boutique account' : 'Login to your Mazhai Vaanam Boutique account'}
        </p>

        {error && <div className={styles['auth-error-alert']}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles['login-form']}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>

          {isRegistering && (
            <div className="form-group">
              <label htmlFor="email">Email ID</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email id"
                required
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password (min 4 chars)"
              required
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            loading={loading}
            className={styles['login-submit-btn']}
          >
            {isRegistering ? 'Create an Account' : 'Login'}
          </Button>
        </form>

        <p className={styles['toggle-text']}>
          {isRegistering ? 'Already have an account? ' : "Don't have an account? "}
          <span 
            onClick={() => {
              setIsRegistering(!isRegistering);
              setCurrentTab(!isRegistering ? 'register' : 'login');
            }} 
            className={styles['toggle-link']}
          >
            {isRegistering ? 'Login' : 'Create an Account'}
          </span>
        </p>
      </div>
    </div>
  );
};
export default Login;

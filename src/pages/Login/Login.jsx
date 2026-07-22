import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common/Button/Button';
import styles from './Login.module.css';

export const Login = ({ setCurrentTab }) => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate login delay
    setTimeout(() => {
      const result = login(username, password);
      setLoading(false);
      if (result.success) {
        setCurrentTab('shop');
      } else {
        setError(result.message);
      }
    }, 600);
  };

  return (
    <div className={`${styles['login-page']} container`}>
      <div className={`${styles['login-card']} glass-card`}>
        <h2>Welcome Back</h2>
        <p className={styles['login-subtitle']}>Sign in to your Mazhai Vaanam Boutique account</p>

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
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};
export default Login;

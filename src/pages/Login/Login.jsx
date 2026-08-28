import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  CheckCircle2,
  X
} from 'lucide-react';
import styles from './Login.module.css';

export const Login = ({ setCurrentTab, initialIsRegistering = false }) => {
  const { login, register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(initialIsRegistering);

  // Update state if prop changes
  React.useEffect(() => {
    setIsRegistering(initialIsRegistering);
  }, [initialIsRegistering]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (!username.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim()) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
      }
    }

    setLoading(true);

    try {
      let result;
      if (isRegistering) {
        result = await register({
          firstName: username.trim(),
          lastName: 'Patron',
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
        setError(result.message || 'Authentication failed. Please check your credentials.');
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Authentication error occurred');
    }
  };

  return (
    <div className={styles['auth-page-container']}>
      <div className={styles['auth-card']}>
        <button className={styles['close-btn']} onClick={() => { if (setCurrentTab) setCurrentTab('shop'); }} aria-label="Close">
          <X size={24} />
        </button>
        
        {/* Luxury Top Badge */}
        <div className={styles['brand-badge-pill']}>
          <Sparkles size={13} className={styles['badge-sparkle-icon']} />
          <span>MAZHAI VAANAM PATRON PORTAL</span>
        </div>

        {/* Tab Toggle Switch */}
        <div className={styles['tab-switch-container']}>
          <button 
            type="button"
            className={`${styles['switch-tab-btn']} ${!isRegistering ? styles['active-tab'] : ''}`}
            onClick={() => {
              setIsRegistering(false);
              setError('');
              if (setCurrentTab) setCurrentTab('login');
            }}
          >
            Sign In
          </button>
          <button 
            type="button"
            className={`${styles['switch-tab-btn']} ${isRegistering ? styles['active-tab'] : ''}`}
            onClick={() => {
              setIsRegistering(true);
              setError('');
              if (setCurrentTab) setCurrentTab('register');
            }}
          >
            Create Account
          </button>
        </div>

        {/* Main Title & Subtitle */}
        <h2 className={styles['auth-title']}>
          {isRegistering ? 'Create Your Account' : 'Welcome Back'}
        </h2>
        <p className={styles['auth-subtitle']}>
          {isRegistering 
            ? 'Join our circle of connoisseurs for private handloom previews and privilege points.'
            : 'Access your private trousseau, order tracking, and exclusive handloom collections.'}
        </p>

        {/* Error Alert Box */}
        {error && (
          <div className={styles['auth-error-box']}>
            <span>{error}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className={styles['auth-form']}>
          
          {/* Username Input */}
          <div className={styles['input-group-container']}>
            <label className={styles['input-label']}>
              {isRegistering ? 'FULL NAME' : 'USERNAME OR EMAIL'}
            </label>
            <div className={styles['input-with-icon']}>
              <User size={16} className={styles['field-icon']} />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isRegistering ? "e.g. Radhika Sundaram" : "Enter username or email"}
                className={styles['auth-input']}
                required
                autoComplete="username"
              />
            </div>
          </div>

          {/* Email Input for Registration */}
          {isRegistering && (
            <div className={styles['input-group-container']}>
              <label className={styles['input-label']}>EMAIL ADDRESS</label>
              <div className={styles['input-with-icon']}>
                <Mail size={16} className={styles['field-icon']} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={styles['auth-input']}
                  required
                  autoComplete="email"
                />
              </div>
            </div>
          )}

          {/* Password Input */}
          <div className={styles['input-group-container']}>
            <div className={styles['label-row']}>
              <label className={styles['input-label']}>PASSWORD</label>
              {!isRegistering && (
                <span 
                  className={styles['forgot-password-link']}
                  onClick={() => alert("Password reset link will be sent to your registered email address.")}
                >
                  Forgot?
                </span>
              )}
            </div>
            <div className={styles['input-with-icon']}>
              <Lock size={16} className={styles['field-icon']} />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className={styles['auth-input']}
                required
                autoComplete={isRegistering ? "new-password" : "current-password"}
              />
              <button
                type="button"
                className={styles['password-toggle-btn']}
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className={styles['auth-submit-btn']}
          >
            {loading ? (
              <span className={styles['loading-text']}>AUTHENTICATING...</span>
            ) : (
              <>
                <span>{isRegistering ? 'CREATE MY ACCOUNT' : 'SIGN IN TO ACCOUNT'}</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Benefits Checklist in Registration Mode */}
        {isRegistering && (
          <div className={styles['member-benefits-box']}>
            <div className={styles['benefit-item']}>
              <CheckCircle2 size={13} className={styles['benefit-check-icon']} />
              <span>Earn 10% Silk Rewards on all pure zari orders</span>
            </div>
            <div className={styles['benefit-item']}>
              <CheckCircle2 size={13} className={styles['benefit-check-icon']} />
              <span>Early access to limited weaver drops & festive collections</span>
            </div>
          </div>
        )}

        {/* Bottom Toggle Prompt */}
        <p className={styles['switch-prompt-text']}>
          {isRegistering ? 'Already part of our circle? ' : "New to Mazhai Vaanam? "}
          <button 
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
              if (setCurrentTab) setCurrentTab(!isRegistering ? 'register' : 'login');
            }} 
            className={styles['switch-prompt-btn']}
          >
            {isRegistering ? 'Sign in to your account' : 'Create an Account'}
          </button>
        </p>

        {/* SSL Security Assurance */}
        <div className={styles['security-footer-badge']}>
          <ShieldCheck size={14} className={styles['security-icon']} />
          <span>256-Bit SSL Encrypted • 100% Handloom Verified</span>
        </div>

      </div>
    </div>
  );
};

export default Login;

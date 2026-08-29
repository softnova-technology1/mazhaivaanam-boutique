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
  X,
  Phone
} from 'lucide-react';
import styles from './Login.module.css';

export const Login = ({ setCurrentTab, initialIsRegistering = false }) => {
  const { login, register } = useAuth();
  const [loginId, setLoginId] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      if (!firstName.trim()) {
        setError('Please enter your first name.');
        return;
      }
      if (!lastName.trim()) {
        setError('Please enter your last name.');
        return;
      }
      if (!email.trim()) {
        setError('Please enter a valid email address.');
        return;
      }
      if (!phone.trim()) {
        setError('Please enter a valid mobile number.');
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
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password: password.trim()
        });
      } else {
        result = await login(loginId.trim(), password.trim());
      }
      setLoading(false);
      if (result.success) {
        const nextTab = localStorage.getItem('post_login_redirect') || 'shop';
        localStorage.removeItem('post_login_redirect');
        setCurrentTab(nextTab);
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
          
          {/* Name Inputs for Registration */}
          {isRegistering && (
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className={styles['input-group-container']} style={{ flex: 1, marginBottom: 0 }}>
                <label className={styles['input-label']}>FIRST NAME</label>
                <div className={styles['input-with-icon']}>
                  <User size={16} className={styles['field-icon']} />
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Radhika"
                    className={styles['auth-input']}
                    required
                    autoComplete="given-name"
                  />
                </div>
              </div>
              <div className={styles['input-group-container']} style={{ flex: 1, marginBottom: 0 }}>
                <label className={styles['input-label']}>LAST NAME</label>
                <div className={styles['input-with-icon']}>
                  <User size={16} className={styles['field-icon']} />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Sundaram"
                    className={styles['auth-input']}
                    required
                    autoComplete="family-name"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Username/Email Input for Login */}
          {!isRegistering && (
            <div className={styles['input-group-container']}>
              <label className={styles['input-label']}>USERNAME OR EMAIL</label>
              <div className={styles['input-with-icon']}>
                <User size={16} className={styles['field-icon']} />
                <input
                  type="text"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  placeholder="Enter username or email"
                  className={styles['auth-input']}
                  required
                  autoComplete="username"
                />
              </div>
            </div>
          )}

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

          {/* Mobile Number Input for Registration */}
          {isRegistering && (
            <div className={styles['input-group-container']}>
              <label className={styles['input-label']}>MOBILE NUMBER</label>
              <div className={styles['input-with-icon']}>
                <Phone size={16} className={styles['field-icon']} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className={styles['auth-input']}
                  required
                  autoComplete="tel"
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

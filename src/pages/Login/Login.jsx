import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  ArrowRight,
  X,
  Phone,
  Info,
  Check
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
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(initialIsRegistering);

  // Update state if prop changes
  React.useEffect(() => {
    setIsRegistering(initialIsRegistering);
  }, [initialIsRegistering]);

  // Essential password metrics
  const passMinLength = password.length >= 8;
  const passHasUpper = /[A-Z]/.test(password);
  const passHasNumber = /\d/.test(password);
  const isPasswordStrong = passMinLength && passHasUpper && passHasNumber;
  const strengthScore = [passMinLength, passHasUpper, passHasNumber].filter(Boolean).length;

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
      if (!isPasswordStrong) {
        setError('Please create a password that meets the security requirements below.');
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <label className={styles['input-label']}>PASSWORD</label>
                {isRegistering && (
                  <button
                    type="button"
                    className={styles['info-trigger-btn']}
                    onMouseEnter={() => setShowPasswordTooltip(true)}
                    onMouseLeave={() => setShowPasswordTooltip(false)}
                    onClick={() => setShowPasswordTooltip(!showPasswordTooltip)}
                    aria-label="Password requirements info"
                  >
                    <Info size={13} />
                  </button>
                )}
              </div>

              {!isRegistering ? (
                <span 
                  className={styles['forgot-password-link']}
                  onClick={() => alert("Password reset link will be sent to your registered email address.")}
                >
                  Forgot?
                </span>
              ) : (
                password.length > 0 && (
                  <span className={`${styles['req-badge']} ${strengthScore === 3 ? styles['badge-strong'] : strengthScore === 2 ? styles['badge-medium'] : styles['badge-weak']}`}>
                    {strengthScore === 3 ? 'Strong' : strengthScore >= 2 ? 'Medium' : 'Weak'}
                  </span>
                )
              )}
            </div>

            <div className={styles['password-input-wrapper']}>
              <div className={styles['input-with-icon']}>
                <Lock size={16} className={styles['field-icon']} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="Enter your password"
                  className={styles['auth-input']}
                  required
                  autoComplete={isRegistering ? "new-password" : "current-password"}
                />
                <button
                  type="button"
                  className={styles['password-toggle-btn']}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Innovative Interactive Requirements Card */}
              {isRegistering && (isPasswordFocused || showPasswordTooltip) && (
                <div className={styles['password-requirements-card']}>
                  <div className={styles['req-header']}>
                    <div className={styles['req-title-wrap']}>
                      <ShieldCheck size={14} color="#8C7A5B" />
                      <span>Security Strength</span>
                    </div>
                    <span className={`${styles['req-badge']} ${strengthScore === 3 ? styles['badge-strong'] : strengthScore === 2 ? styles['badge-medium'] : styles['badge-weak']}`}>
                      {strengthScore === 3 ? (
                        <>
                          <Check size={11} strokeWidth={3} />
                          <span>Strong</span>
                        </>
                      ) : strengthScore === 2 ? (
                        <span>Medium</span>
                      ) : (
                        <span>Weak</span>
                      )}
                    </span>
                  </div>

                  {/* 3-Segment Progress Bar */}
                  <div className={styles['segments-track']}>
                    <div className={`${styles['segment-bar']} ${strengthScore >= 1 ? (strengthScore === 3 ? styles['segment-active-strong'] : strengthScore === 2 ? styles['segment-active-medium'] : styles['segment-active-weak']) : ''}`} />
                    <div className={`${styles['segment-bar']} ${strengthScore >= 2 ? (strengthScore === 3 ? styles['segment-active-strong'] : styles['segment-active-medium']) : ''}`} />
                    <div className={`${styles['segment-bar']} ${strengthScore >= 3 ? styles['segment-active-strong'] : ''}`} />
                  </div>

                  {/* Interactive Modern Pill Badges */}
                  <div className={styles['req-pills-row']}>
                    <div className={`${styles['req-pill']} ${passMinLength ? styles['req-pill-active'] : ''}`}>
                      <span className={styles['req-pill-icon']}>
                        {passMinLength ? <Check size={11} strokeWidth={3} /> : <span className={styles['req-pill-dot']} />}
                      </span>
                      <span>8+ Characters</span>
                    </div>

                    <div className={`${styles['req-pill']} ${passHasNumber ? styles['req-pill-active'] : ''}`}>
                      <span className={styles['req-pill-icon']}>
                        {passHasNumber ? <Check size={11} strokeWidth={3} /> : <span className={styles['req-pill-dot']} />}
                      </span>
                      <span>1 Number (0-9)</span>
                    </div>

                    <div className={`${styles['req-pill']} ${passHasUpper ? styles['req-pill-active'] : ''}`}>
                      <span className={styles['req-pill-icon']}>
                        {passHasUpper ? <Check size={11} strokeWidth={3} /> : <span className={styles['req-pill-dot']} />}
                      </span>
                      <span>1 Uppercase (A-Z)</span>
                    </div>
                  </div>
                </div>
              )}
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

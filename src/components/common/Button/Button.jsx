import styles from './Button.module.css';

export const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  className = ''
}) => {
  const variantClass = styles[`btn-${variant}`] || '';
  const loadingClass = loading ? styles['btn-loading'] : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${styles.btn} ${variantClass} ${loadingClass} ${className}`}
    >
      {loading ? (
        <span className={styles['btn-spinner']}></span>
      ) : (
        children
      )}
    </button>
  );
};

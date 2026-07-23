import React from 'react';
import styles from './Privacy.module.css';

export const Privacy = () => {
  return (
    <div className={styles.policyContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.subtitle}>Our policies and procedures on the collection, use and disclosure of Your information.</p>
      </div>

      <div className={styles.content}>
        <section className={styles.policySection}>
          <p>Your privacy is important to <strong>Mazhai Vaanam</strong>.</p>
        </section>

        <section className={styles.policySection}>
          <h2>Information We Collect</h2>
          <ul>
            <li>Name</li>
            <li>Mobile number</li>
            <li>Email address</li>
            <li>Shipping and billing address</li>
            <li>Order and payment details</li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To process and deliver your orders</li>
            <li>To provide customer support</li>
            <li>To send order updates</li>
            <li>To improve our products and services</li>
            <li>To share promotional offers (only where applicable)</li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Data Security</h2>
          <p>We use secure systems to protect your personal information. Your payment details are processed securely through trusted payment gateways.</p>
        </section>

        <section className={styles.policySection}>
          <h2>Information Sharing</h2>
          <p>We do not sell or rent your personal information. We share only the necessary details with trusted logistics and payment partners to complete your order.</p>
        </section>

        <section className={styles.policySection}>
          <h2>Contact Us</h2>
          <p>For any privacy-related questions, please contact our customer support team.</p>
        </section>

      </div>
    </div>
  );
};

export default Privacy;

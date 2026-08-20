import React from 'react';
import styles from './ShippingPolicy.module.css';

export const ShippingPolicy = () => {
  return (
    <div className={styles.policyContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Shipping Policy</h1>
        <p className={styles.subtitle}>Welcome to Mazhai Vaanam. We are committed to delivering your orders safely and on time.</p>
      </div>

      <div className={styles.content}>
        <section className={styles.policySection}>
          <h2>Order Processing</h2>
          <ul>
            <li>Orders are processed within <strong>1–2 business days</strong> after successful payment.</li>
            <li>Orders placed on Sundays or public holidays will be processed on the next business day.</li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Delivery Timeline</h2>
          <ul>
            <li>Tamil Nadu: <strong>2–4 business days</strong></li>
            <li>Other states in India: <strong>4–7 business days</strong></li>
            <li>Delivery timelines may vary during festivals, sales, or due to courier delays.</li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Shipping Charges</h2>
          <ul>
            <li>Shipping charges, if applicable, will be displayed at checkout before payment.</li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Order Tracking</h2>
          <p>Once your order is shipped, you will receive a tracking number via email or WhatsApp.</p>
        </section>

        <section className={styles.policySection}>
          <h2>Delivery</h2>
          <p>Please ensure your shipping address and contact number are accurate. Mazhai Vaanam is not responsible for delays caused by incorrect address details.</p>
          <p>For any shipping-related assistance, please contact our customer support.</p>
        </section>
      </div>
    </div>
  );
};

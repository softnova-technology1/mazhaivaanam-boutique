import React from 'react';
import styles from './Returns.module.css';

export const Returns = () => {
  return (
    <div className={styles.policyContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Return & Refund Policy</h1>
        <p className={styles.subtitle}>At Mazhai Vaanam, customer satisfaction is important to us.</p>
      </div>

      <div className={styles.content}>
        <section className={styles.policySection}>
          <h2>Returns</h2>
          <ul>
            <li>Returns are accepted only if the product received is damaged, defective, or incorrect.</li>
            <li>Any issue must be reported within <strong>24 hours</strong> of delivery with clear photos and unboxing video (Uncut).</li>
            <li>Products must be unused, unwashed, and returned with original packaging and tags.</li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Non-Returnable Items</h2>
          <ul>
            <li>Products purchased during clearance or special sale.</li>
            <li>Items damaged due to customer handling.</li>
            <li>Color variations caused by screen settings are not considered defects.</li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Refunds</h2>
          <ul>
            <li>Refunds usually take 7–15 Banking Business days to reflect in your account (the days may increase or decrease based on your bank)</li>
            <li>In case of failed transactions where the payment is deducted but the order is not placed, the amount will be automatically refunded as per your bank’s policy. Since the payment is not received by us, we are unable to process such refunds manually.</li>
          </ul>
        </section>

        <section className={styles.policySection}>
          <h2>Exchanges</h2>
          <p>Exchanges are subject to product availability.</p>
        </section>
      </div>
    </div>
  );
};

export default Returns;

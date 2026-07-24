import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './Support.module.css';

export const Support = () => {
  const [activeFaqId, setActiveFaqId] = useState(null);

  const faqs = [
    {
      id: 1,
      q: "How do I place an order?",
      a: "To place an order, simply browse our product catalog, select the items you want, and add them to your cart. Once you're ready, proceed to the checkout, provide the necessary information, and complete your purchase."
    },
    {
      id: 2,
      q: "Can I modify or cancel my order after placing it?",
      a: "Unfortunately, we are unable to modify or cancel orders once they have been placed. Please double-check your order before confirming your purchase."
    },
    {
      id: 3,
      q: "What payment methods do you accept?",
      a: "We accept Razorpay, UPI, Google Pay, Netbanking, and major credit/debit cards."
    },
    {
      id: 4,
      q: "Is it safe to shop on your website?",
      a: "Yes, shopping on our website is secure. We use industry-standard encryption and security protocols to protect your personal and financial information."
    },
    {
      id: 5,
      q: "How can I track my order?",
      a: "Once your order has been shipped, you will receive a confirmation email with a tracking number and a link to track your package."
    },
    {
      id: 6,
      q: "What is your return policy?",
      a: "Our return policy allows you to return eligible items within 24 hours of delivery. Please review our Returns & Refunds Policy for detailed information on the process."
    },
    {
      id: 7,
      q: "Do you offer international shipping?",
      a: "Yes, we offer international shipping. Shipping costs and delivery times may vary depending on your location. Please refer to our Shipping Information for more details."
    },
    {
      id: 8,
      q: "How do I contact customer support?",
      a: "You can reach our customer support team via the WhatsApp icon on the screen, or visit our Contact Us page for additional contact options."
    },
    {
      id: 9,
      q: "Do you have a size guide?",
      a: "Yes, we provide a size guide to help you choose the right fit for our products."
    },
    {
      id: 10,
      q: "What should I do if I encounter issues with the website or my account?",
      a: "If you experience any technical issues or have concerns about your account, please contact our support team, and we'll be happy to assist you."
    },
    {
      id: 11,
      q: "Can I modify my shipping address after placing an order?",
      a: "Unfortunately, we are unable to modify shipping addresses once an order has been placed. Please ensure your shipping information is accurate before confirming your purchase."
    },
    {
      id: 12,
      q: "How do I apply a discount code to my order?",
      a: "During the checkout process, you'll find a field to enter your discount code. Once entered, the discount will be applied to your order total."
    },
    {
      id: 13,
      q: "Are my personal details and payment information secure?",
      a: "Yes, we take the security of your personal and payment information seriously. Our website uses AES-256 encryption and secure payment gateways to ensure a secure shopping experience."
    },
    {
      id: 14,
      q: "What is the per transaction fee for Razorpay?",
      a: "For domestic cards, netbanking and wallets the payment gateway fee charged is always 2% along with 18% GST on the fee. For international, Diners and Amex cards the payment gateway fee charged is 3% along with 18% GST on the fee. Note: In both the cases, the GST of 18% is charged only on the payment gateway fees."
    }
  ];

  return (
    <div className={styles.policyContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Customer Support</h1>
        <p className={styles.subtitle}>Frequently Asked Questions (FAQs)</p>
      </div>

      <div className={styles.content}>
        <div className={styles.accordionStack}>
          {faqs.map((faq) => {
            const isOpen = activeFaqId === faq.id;
            return (
              <div 
                key={faq.id} 
                className={`${styles.accordionItem} ${isOpen ? styles.accordionOpen : ''}`}
              >
                <div 
                  onClick={() => setActiveFaqId(isOpen ? null : faq.id)}
                  className={styles.accordionHeader}
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className={`${styles.chevronIcon} ${isOpen ? styles.chevronRotated : ''}`} />
                </div>
                {isOpen && (
                  <div className={styles.accordionBody}>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Editorial FAQ Grid */}
        <section className={styles.editorialFaqSection}>
          <div className={styles.editorialGrid}>
            
            {/* Shopping Guide */}
            <div id="shopping" className={styles.editorialCol}>
              <h3 className={styles.editorialHeaderNum}>01 / Shopping Guide</h3>
              <h4 className={styles.editorialColHeadline}>Discovering Heritage</h4>
              <ul className={styles.editorialLinksStack}>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Silk fabrics guides loaded."); }}>How to choose the right silk for your occasion</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Weaving techniques details."); }}>Understanding our weaving techniques</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("GI Tags certificates."); }}>Authenticity certificates &amp; GI Tags</a></li>
              </ul>
            </div>

            {/* Orders */}
            <div id="orders" className={styles.editorialCol}>
              <h3 className={styles.editorialHeaderNum}>02 / Orders &amp; Delivery</h3>
              <h4 className={styles.editorialColHeadline}>Timely Elegance</h4>
              <ul className={styles.editorialLinksStack}>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Custom orders settings."); }}>Modifying your custom order</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Bridal wear expedited shipping."); }}>Expedited shipping for bridal wear</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Secure courier insurance."); }}>Insurance and safe handling during transit</a></li>
              </ul>
            </div>

            {/* Payments */}
            <div id="payments" className={styles.editorialCol}>
              <h3 className={styles.editorialHeaderNum}>03 / Payments</h3>
              <h4 className={styles.editorialColHeadline}>Secure Transactions</h4>
              <ul className={styles.editorialLinksStack}>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Global payment details."); }}>Accepted payment methods globally</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Instalments setups."); }}>Interest-free bespoke installment plans</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Duties and tax info."); }}>Tax and customs duties for global orders</a></li>
              </ul>
            </div>

            {/* Returns */}
            <div id="returns" className={styles.editorialCol}>
              <h3 className={styles.editorialHeaderNum}>04 / Returns</h3>
              <h4 className={styles.editorialColHeadline}>Graceful Exchanges</h4>
              <ul className={styles.editorialLinksStack}>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Ready to wear returns policy."); }}>Eligibility for returns on ready-to-wear</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Pickups scheduled."); }}>Return shipping process and pick-ups</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); alert("Exchanges guidelines."); }}>Exchange policy for non-bespoke items</a></li>
              </ul>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
};

export default Support;

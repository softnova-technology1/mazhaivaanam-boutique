const fs = require('fs');
let content = fs.readFileSync('src/pages/About/About.jsx', 'utf8');

const principles = `      {/* Our Philosophy (Principles) */}
      <section className={styles.principlesSection}>
        <div className={styles.principlesHeader}>
          <h3 className={styles.principlesMainTitle}>Our Curated Collections</h3>
        </div>

        <div className={styles.principlesGrid}>

          {/* Card 1 */}
          <div className={styles.principleCard}>
            <div className={styles.principleImgFrame}>
              <img
                src="/Images/silk.webp"
                alt="Premium Silk Saree"
              />
            </div>
            <h4 className={styles.principleCardTitle}>Silk Sarees</h4>
            <p className={styles.principleCardDesc}>Discover our majestic pure silk sarees, featuring intricate zari borders and rich traditional motifs.</p>
          </div>

          {/* Card 2 */}
          <div className={\`\${styles.principleCard} \${styles.pushedCard}\`}>
            <div className={styles.principleImgFrame}>
              <img
                src="/Images/cotton3.jpg"
                alt="Cotton Saree"
              />
            </div>
            <h4 className={styles.principleCardTitle}>Cotton Sarees</h4>
            <p className={styles.principleCardDesc}>Breathable, lightweight handloomed cottons offering unparalleled comfort and everyday elegance.</p>
          </div>

          {/* Card 3 */}
          <div className={styles.principleCard}>
            <div className={styles.principleImgFrame}>
              <img
                src="/Images/fancy.jpg"
                alt="Festival Saree Collection"
              />
            </div>
            <h4 className={styles.principleCardTitle}>Festival Collection</h4>
            <p className={styles.principleCardDesc}>Vibrant and grand drapes specially curated to add a touch of royal splendor to your celebrations.</p>
          </div>

          {/* Card 4 */}
          <div className={\`\${styles.principleCard} \${styles.pushedCard}\`}>
            <div className={styles.principleImgFrame}>
              <img
                src="/Images/kanchi.png"
                alt="Black Love Saree Collection"
              />
            </div>
            <h4 className={styles.principleCardTitle}>Black Love</h4>
            <p className={styles.principleCardDesc}>A striking collection of bold, beautiful black sarees that make a powerful statement for any occasion.</p>
          </div>

        </div>
      </section>`;

const badSnippet = `              <p>
          <p className={styles.sareeJourneySub}>The meticulous seven-step journey of your handcrafted masterpiece.</p>`;
const goodSnippet = `              <p>
                Mazhai Vaanam is more than a boutique—it’s where tradition, beauty, and timeless style come together.
              </p>
              <div className={styles.storyTaglineBox}>
                <span className={styles.taglineLine}></span>
                <p className={styles.storyTagline}>Wear Elegance. Celebrate Tradition.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

` + principles + `

      {/* Journey of a Saree (Horizontal Timeline - Luxury Stepper) */}
      <section className={styles.sareeJourneySection}>
        <div className={styles.sareeJourneyBackgroundGlow}></div>

        <div className={styles.sareeJourneyHeader}>
          <span className={styles.sareeJourneyBadge}>ARTISANAL CRAFTSMANSHIP</span>
          <h3 className={styles.sareeJourneyTitle}>From Loom to Love</h3>
          <div className={styles.goldDivider}></div>
          <p className={styles.sareeJourneySub}>The meticulous seven-step journey of your handcrafted masterpiece.</p>`;

content = content.replace(badSnippet, goodSnippet);
fs.writeFileSync('src/pages/About/About.jsx', content);
console.log('Fixed About.jsx');

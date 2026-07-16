---
name: Heritage Editorial
colors:
  surface: '#fcf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fcf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1b'
  on-surface-variant: '#554244'
  inverse-surface: '#313030'
  inverse-on-surface: '#f3f0ef'
  outline: '#887174'
  outline-variant: '#dbc0c2'
  surface-tint: '#a13b51'
  primary: '#490017'
  on-primary: '#ffffff'
  primary-container: '#6b102a'
  on-primary-container: '#f1798f'
  inverse-primary: '#ffb2bc'
  secondary: '#775a04'
  on-secondary: '#ffffff'
  secondary-container: '#fed579'
  on-secondary-container: '#785b05'
  tertiary: '#6c5d35'
  on-tertiary: '#ffffff'
  tertiary-container: '#bcaa7c'
  on-tertiary-container: '#4b3e1a'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9dd'
  primary-fixed-dim: '#ffb2bc'
  on-primary-fixed: '#400013'
  on-primary-fixed-variant: '#82233a'
  secondary-fixed: '#ffdf9b'
  secondary-fixed-dim: '#e9c168'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5b4300'
  tertiary-fixed: '#f5e1af'
  tertiary-fixed-dim: '#d8c595'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#534520'
  background: '#fcf9f8'
  on-background: '#1c1b1b'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 72px
    fontWeight: '400'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 44px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-xl:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.3'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 0.15em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 32px
  margin-desktop: 80px
  margin-mobile: 20px
  section-gap: 120px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

This design system embodies "Modern Heritage," a bridge between timeless Indian craftsmanship and contemporary high-fashion editorial aesthetics. The brand personality is sophisticated and exclusive, prioritizing grace over loudness. 

The design style is **Minimalist Luxury** with subtle **Glassmorphism** and **Tactile** accents. It leverages expansive whitespace to signify premium value—where "luxury is space." Visuals should feel like a digital atelier: airy, curated, and intentionally paced. 

**Key Principles:**
- **Curated Silence:** Use generous margins to allow product photography to breathe.
- **Modern Tradition:** Pair high-contrast, classical typography with a rigid, modern grid.
- **Tactile Softness:** Use subtle blurs and very soft shadows to mimic the fall of premium silk.

## Colors

The palette is rooted in the "Deep Maroon" of heritage textiles, balanced by "Antique Gold" accents that suggest hand-woven zari work.

- **Primary (Deep Maroon):** Reserved for core brand actions, headings, and high-emphasis elements.
- **Secondary & Tertiary (Gold Tones):** Used for interactive states, thin borders, and decorative flourishes.
- **Backgrounds:** The "Warm Ivory" base prevents the clinical feel of pure white, providing a "museum-wall" backdrop for the sarees.
- **Typography:** "Rich Charcoal" provides high legibility without the harshness of pure black.

## Typography

The typographic hierarchy relies on the high-contrast elegance of **Playfair Display**. It should be used with generous tracking in display settings to evoke an editorial feel.

- **Display & Headlines:** Use Playfair Display. Large sizes should use negative letter spacing (-0.01em to -0.02em), while sub-headlines benefit from standard spacing.
- **Body Text:** **Inter** provides a functional, neutral counterpoint to the serif headings. The line height is intentionally loose (1.6 - 1.7) to improve readability and sustain the "airy" brand feel.
- **Labels:** Use uppercase Inter with high letter spacing (0.15em) for category headers and utility text to create a sense of structure.

## Layout & Spacing

The layout utilizes a **12-column fixed grid** for desktop and a **4-column fluid grid** for mobile. 

- **The Power of the Void:** Maintain a `section-gap` of 120px between major content blocks on desktop to enforce the luxury narrative.
- **Asymmetric Balance:** Use offset grid positions for product imagery to mimic the layout of a fashion magazine.
- **Safe Zones:** Desktop margins are wide (80px) to frame the content like a piece of art. 
- **Reflow:** On tablet, reduce horizontal margins to 40px and stack vertical elements using `stack-lg`.

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Ambient Shadows** rather than heavy borders.

- **Surface Levels:** 
  - `Level 0 (Background)`: Warm Ivory (#FFFDF8).
  - `Level 1 (Surface)`: Pure White (#FFFFFF) cards or sections.
- **Shadows:** Use extremely diffused, low-opacity shadows. A typical shadow should be `0px 12px 32px rgba(26, 26, 26, 0.04)`. Avoid harsh, dark shadows.
- **Glassmorphism:** Use for navigation bars and product quick-views—Background Blur (20px) with a semi-transparent White (opacity 80%) overlay.
- **Outlines:** Use thin (1px) borders in `Border Gold (#F0E6D2)` for structural elements like inputs or product frames.

## Shapes

The design system uses a "Soft" corner logic to maintain a balance between architectural precision and organic grace.

- **Standard Elements:** 4px (0.25rem) radius for buttons and input fields.
- **Large Elements:** 8px (0.5rem) radius for product cards and modal containers.
- **Media:** Product photography should remain sharp-edged (0px) to preserve the "high-fashion" editorial look, or use a very minimal 4px radius if contained within a card.

## Components

### Buttons
- **Primary:** Solid Deep Maroon (#6B102A) with white text. Hover state: Antique Gold (#C8A34D). Transition should be slow (300ms) and graceful.
- **Secondary:** Transparent background with a 1px border of Deep Maroon. 
- **Tertiary/Ghost:** Text only in Rich Charcoal with an underline that appears on hover.

### Cards
- **Product Cards:** No background or border by default. Imagery is the focus. Details (Name, Price) are centered below the image in Playfair Display.
- **Feature Cards:** Pure White surface with a 1px border in #F0E6D2 and a soft ambient shadow.

### Inputs & Fields
- **Text Fields:** 1px bottom-border only in Antique Gold (#C8A34D) for a minimal, sophisticated look. Labels are small-caps Inter above the field.

### Interactive Elements
- **Chips/Filters:** Rounded-pill shape with a 1px #F0E6D2 border. Active state: Deep Maroon text with a subtle Champagne Gold background.
- **Lists:** High vertical padding (24px) with a 1px #F0E6D2 divider between items.

### Special Luxury Components
- **The Lookbook Slider:** Full-width imagery with minimal navigation arrows (thin Antique Gold lines).
- **The Craftsmanship Badge:** A circular floating element or seal in Antique Gold, used to highlight "Hand-woven" or "Pure Silk" credentials.
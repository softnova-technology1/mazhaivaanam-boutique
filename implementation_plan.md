# Implementation Plan - Boutique E-commerce Folder Restructuring with CSS Modules

This plan details the technical steps to properly organize the project's folder structure according to modern React and e-commerce project standards, using **CSS Modules (`.module.css`)** for all pages and components.

## Proposed Folder Structure

We will restructure the `src` directory as follows:

```
src/
├── assets/          # Static assets (images, icons, etc.)
├── components/      # Reusable UI components
│   ├── common/      # Generic elements (Button)
│   │   └── Button/
│   │       ├── Button.jsx
│   │       ├── Button.module.css
│   │       └── index.jsx
│   ├── layout/      # Layout structures (Navbar, Footer, Header)
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.module.css
│   │   │   └── index.jsx
│   │   ├── Footer/
│   │   │   ├── Footer.jsx
│   │   │   ├── Footer.module.css
│   │   │   └── index.jsx
│   │   └── Header/
│   │       ├── Header.jsx
│   │       ├── Header.module.css
│   │       └── index.jsx
│   └── product/     # Product-specific components
│       └── ProductCard/
│           ├── ProductCard.jsx
│           ├── ProductCard.module.css
│           └── index.jsx
├── context/         # React Contexts
│   ├── AuthContext.jsx
│   └── CartContext.jsx
├── hooks/           # Custom React hooks
│   ├── useAuth.js
│   └── useCart.js
├── pages/           # Pages folder containing sub-folders per page
│   ├── Home/
│   │   ├── Home.jsx
│   │   ├── Home.module.css
│   │   └── index.jsx
│   ├── Catalog/
│   │   ├── Catalog.jsx
│   │   ├── Catalog.module.css
│   │   └── index.jsx
│   ├── Lookbook/
│   │   ├── Lookbook.jsx
│   │   ├── Lookbook.module.css
│   │   └── index.jsx
│   ├── About/
│   │   ├── About.jsx
│   │   ├── About.module.css
│   │   └── index.jsx
│   ├── Contact/
│   │   ├── Contact.jsx
│   │   ├── Contact.module.css
│   │   └── index.jsx
│   ├── Cart/
│   │   ├── Cart.jsx
│   │   ├── Cart.module.css
│   │   └── index.jsx
│   └── Login/
│       ├── Login.jsx
│       ├── Login.module.css
│       └── index.jsx
├── services/        # Services (mock API, external calls)
│   └── api.js
├── styles/          # Global styles & variables
│   └── global.css
└── utils/           # Utility helpers
    └── formatters.js
```

## User Review Required

> [!IMPORTANT]
> - All CSS styles for components and pages will be converted to **CSS Modules** (e.g. `Home.module.css`, `Button.module.css`).
> - The JSX files will import styles as an object (e.g. `import styles from './Home.module.css'`) and apply class names dynamically (e.g. `className={styles.heroSectionOrganic}`).
> - Common base page styling (like `.page` and `.page-title`) and form controls (like `.form-group`) will be migrated to `src/styles/global.css` as global classes, while page-specific and component-specific styles will be locally scoped via CSS Modules.
> - We will use `index.jsx` files in all component/page folders to support clean imports.

## Proposed Changes

### 1. Global Styles

#### [MODIFY] [global.css](file:///d:/Softnova%20company%20project/Boutique/src/styles/global.css)
- Add base `.page`, `.page-title`, and `.form-group` styles to ensure forms and layouts remain consistent across all pages.

### 2. Components Co-location & CSS Modules Integration

For each component, we will create a dedicated subdirectory, co-locate it with its styles renamed to `.module.css`, and update the JSX to use CSS Module imports.

#### [NEW] [index.jsx (Button)](file:///d:/Softnova%20company%20project/Boutique/src/components/common/Button/index.jsx)
#### [NEW] [Button.module.css](file:///d:/Softnova%20company%20project/Boutique/src/components/common/Button/Button.module.css)
- Convert `Button.css` to CSS module, update classes in JSX.

#### [NEW] [index.jsx (Navbar)](file:///d:/Softnova%20company%20project/Boutique/src/components/layout/Navbar/index.jsx)
- Move existing `Navbar.jsx` and `Navbar.module.css` to `src/components/layout/Navbar/`.

#### [NEW] [index.jsx (Footer)](file:///d:/Softnova%20company%20project/Boutique/src/components/layout/Footer/index.jsx)
#### [NEW] [Footer.module.css](file:///d:/Softnova%20company%20project/Boutique/src/components/layout/Footer/Footer.module.css)
- Convert `Footer.css` to CSS module, update classes in JSX.

#### [NEW] [index.jsx (Header)](file:///d:/Softnova%20company%20project/Boutique/src/components/layout/Header/index.jsx)
#### [NEW] [Header.module.css](file:///d:/Softnova%20company%20project/Boutique/src/components/layout/Header/Header.module.css)
- Convert `Header.css` to CSS module, update classes in JSX.

#### [NEW] [index.jsx (ProductCard)](file:///d:/Softnova%20company%20project/Boutique/src/components/product/ProductCard/index.jsx)
#### [NEW] [ProductCard.module.css](file:///d:/Softnova%20company%20project/Boutique/src/components/product/ProductCard/ProductCard.module.css)
- Convert `ProductCard.css` to CSS module, update classes in JSX.

### 3. Pages Restructuring & CSS Module Partitioning

We will create page folders, split the monolithic `Pages.css` into individual `.module.css` files, and update each page's JSX to reference class names from the module object.

#### [NEW] [index.jsx (Home)](file:///d:/Softnova%20company%20project/Boutique/src/pages/Home/index.jsx)
#### [NEW] [Home.module.css](file:///d:/Softnova%20company%20project/Boutique/src/pages/Home/Home.module.css)
- Contains lines 7-896 of original `Pages.css` adapted to CSS module notation.

#### [NEW] [index.jsx (Catalog)](file:///d:/Softnova%20company%20project/Boutique/src/pages/Catalog/index.jsx)
#### [NEW] [Catalog.module.css](file:///d:/Softnova%20company%20project/Boutique/src/pages/Catalog/Catalog.module.css)
- Contains catalog styles from lines 1521-1880 and catalog media queries from lines 1881-1942.

#### [NEW] [index.jsx (Lookbook)](file:///d:/Softnova%20company%20project/Boutique/src/pages/Lookbook/index.jsx)
#### [NEW] [Lookbook.module.css](file:///d:/Softnova%20company%20project/Boutique/src/pages/Lookbook/Lookbook.module.css)
- Contains lookbook styles from lines 1314-1520 and lookbook media queries.

#### [NEW] [index.jsx (About)](file:///d:/Softnova%20company%20project/Boutique/src/pages/About/index.jsx)
#### [NEW] [About.module.css](file:///d:/Softnova%20company%20project/Boutique/src/pages/About/About.module.css)
- Contains about styles from lines 915-1120 and about media queries.

#### [NEW] [index.jsx (Contact)](file:///d:/Softnova%20company%20project/Boutique/src/pages/Contact/index.jsx)
#### [NEW] [Contact.module.css](file:///d:/Softnova%20company%20project/Boutique/src/pages/Contact/Contact.module.css)
- Contains contact styles from lines 1121-1313 and contact media queries.

#### [NEW] [index.jsx (Cart)](file:///d:/Softnova%20company%20project/Boutique/src/pages/Cart/index.jsx)
#### [NEW] [Cart.module.css](file:///d:/Softnova%20company%20project/Boutique/src/pages/Cart/Cart.module.css)
- Contains custom styling for cart page structure, empty cart layout, item list, and order summaries.

#### [NEW] [index.jsx (Login)](file:///d:/Softnova%20company%20project/Boutique/src/pages/Login/index.jsx)
#### [NEW] [Login.module.css](file:///d:/Softnova%20company%20project/Boutique/src/pages/Login/Login.module.css)
- Contains custom login page/card styles.

### 4. Code Cleanup & Deletions
We will remove the monolithic and old files once the new structure is verified.
#### [DELETE] `src/pages/Pages.css`
#### [DELETE] Old component and page files from their original locations.

## Verification Plan

### Automated Verification
- Run a production build of the project:
  ```powershell
  npm run build
  ```
- This ensures all relative imports and CSS Modules compile successfully.

### Manual Verification
- Verify the dev server runs without errors.
- Confirm the UI renders correctly in all main routes/pages (Home, Catalog, Lookbook, About, Contact, Cart, Login) and matches original appearance.

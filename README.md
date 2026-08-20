# Mazhai Vaanam Boutique (மழை வானம்)

A full-stack luxury Indian saree boutique e-commerce platform built with React, Vite, Express.js, and MongoDB.

---

## 📁 Clean 2-Folder Architecture

```
mazhaivaanam-boutique/
├── client/          👉 [DEPLOYMENT 1] Single Unified Frontend (Customer Store + Admin Panel)
│   ├── src/
│   │   ├── admin/   # Admin Dashboard, analytics, inventory, order management (accessible at /admin)
│   │   ├── pages/   # Customer Boutique pages: Home, Catalog, ProductDetail, Cart, Checkout, etc.
│   │   ├── components/
│   │   ├── context/
│   │   └── App.jsx  # Main Router (Routes / to Customer, /admin to Admin)
│   ├── public/
│   ├── package.json
│   ├── vercel.json  # SPA routing rewrites
│   └── vite.config.js
│
├── backend/         👉 [DEPLOYMENT 2] REST API Backend (Express.js + MongoDB)
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   ├── seed.js      # Database seed script
│   ├── server.js    # Entry point
│   └── package.json
│
├── package.json     # Workspace convenience runner
└── README.md
```

---

## 🚀 Quick Start (Local Development)

### 1. Run Frontend (Client)
```bash
npm run dev:client
# or
cd client && npm run dev
```
- **Customer Store**: [http://localhost:5173](http://localhost:5173)
- **Admin Dashboard**: [http://localhost:5173/admin](http://localhost:5173/admin)

### 2. Run Backend (API)
```bash
npm run dev:backend
# or
cd backend && npm run dev
```
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🌐 Production Deployment (Only 2 Deployments)

### 1. Frontend Deploy (Vercel / Netlify / Cloudflare Pages)
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Single URL**: 
  - Store: `https://yourdomain.com`
  - Admin: `https://yourdomain.com/admin`

### 2. Backend Deploy (Render / Railway / VPS)
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node server.js`
- **Environment Variables**: `PORT`, `MONGO_URI`, `JWT_SECRET`, `FRONTEND_URL`

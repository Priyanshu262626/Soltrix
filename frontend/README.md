# 👟 JutaHindustani — Frontend Client

A modern single-page application (SPA) powered by **React 19**, built using **Vite**, and styled with **Tailwind CSS v4**.

---

## 🛠️ Tech Stack & Libraries
* **Framework**: React 19 (Hooks, Context, State Management)
* **Build System**: Vite 8 (Hot Module Replacement)
* **Styling**: Tailwind CSS v4
* **Icons**: Lucide React
* **Forms**: React Hook Form
* **HTTP Client**: Axios (configured with interceptors to automatically append JWT bearer tokens)
* **Routing**: React Router DOM (v7)

---

## 📁 Folder Structure

```text
frontend/
├── public/                 # Static assets (images, logos, icons)
└── src/
    ├── api/                # Axios instance configuration and central API endpoints
    ├── assets/             # Global visual assets
    ├── components/         # Reusable presentation and layout components
    │   ├── cart/           # Cart-specific component widgets
    │   ├── common/         # Buttons, Inputs, Protected Route guards, Toasts
    │   └── layout/         # Header/Navbar and Footer
    ├── context/            # Authentication & Cart React Contexts
    ├── hooks/              # Custom reusable hooks
    ├── pages/              # Routed pages
    │   ├── admin/          # Admin dashboards and product inventory editors
    │   ├── auth/           # Login & Register views
    │   ├── cart/           # Cart overview page
    │   ├── checkout/       # Checkout form, order success, and past order history
    │   ├── home/           # Homepage banner and feature highlights
    │   └── products/       # Shop grid and product details page
    ├── routes/             # Client-side routing definitions
    ├── App.jsx             # Main routing hub and global layout provider wrapper
    ├── index.css           # Global Tailwind directives & styling utilities
    └── main.jsx            # Application mount point
```

---

## ⚡ Setup & Development

Ensure you have [Node.js](https://nodejs.org) installed on your system.

### Install dependencies
```bash
npm install
```
*(On Windows systems with execution policy limits, you can use `npm.cmd install`)*

### Run the development server
```bash
npm run dev
```
*(On Windows systems, you can use `npm.cmd run dev`)*

The server will initialize on standard port `http://localhost:5173`. Ensure your backend API server is running on `http://localhost:8080` for data loading and user authentication to function correctly.

### Production Build
To build the application for production deployment:
```bash
npm run build
```
This yields optimized static assets in the `dist` directory.

# GoCart — Full-Stack Multi-Vendor E-Commerce Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.3.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.1-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Redux Toolkit](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)

A modern, responsive, multi-vendor e-commerce web platform built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, **Redux Toolkit**, and **Prisma ORM**. GoCart provides an integrated digital marketplace ecosystem supporting customer storefronts, seller store management, and administrative platform controls.

---

## 📖 Table of Contents

- [Overview & Architecture](#-overview--architecture)
- [Technology Stack](#-technology-stack)
- [Application Modules](#-application-modules)
- [Prerequisites](#-prerequisites)
- [Getting Started & Installation](#-getting-started--installation)
- [Environment Configuration](#-environment-configuration)
- [Database Setup](#-database-setup)
- [Execution & Access](#-execution--access)
- [Advanced Engineering Debugging Challenge](#-advanced-engineering-debugging-challenge)
- [Student Expectations & Submission Guidelines](#-student-expectations--submission-guidelines)
- [Contributing & Code of Conduct](#-contributing--license)

---

## 🏗️ Overview & Architecture

GoCart is architected as a unified Next.js Full-Stack Application leveraging the App Router:

```mermaid
graph TD
    Client["Browser / Client Application"] --> AppRouter["Next.js 15 App Router"]
    
    subgraph Frontend ["Presentation & State"]
        AppRouter --> PublicStore["Customer Storefront /(public)"]
        AppRouter --> VendorDash["Vendor Portal /store"]
        AppRouter --> AdminPortal["Admin Dashboard /admin"]
        ReduxStore["Redux Toolkit Store (Cart, Address, Products, Ratings)"]
    end
    
    subgraph Backend ["Server & API Layer"]
        AppRouter --> APIRoutes["Next.js Route Handlers /api/..."]
        APIRoutes --> AuthModule["Auth & Security Services"]
        APIRoutes --> BusinessLogic["Order, Store & Product Services"]
        APIRoutes --> PrismaClient["Prisma ORM Client"]
    end
    
    subgraph Data ["Persistence Layer"]
        PrismaClient --> Database["Relational Database / Mock Engine"]
    end
```

### Key Architectural Characteristics
- **Unified Full-Stack Runtime:** Client components and server Route Handlers run seamlessly under the same Next.js process.
- **Client State Management:** Centralized Redux Toolkit slices handle dynamic cart actions, delivery addresses, product catalog caches, and order reviews.
- **Data Persistence:** Relational schema modeled in Prisma, featuring users, stores, products, order items, coupons, and ratings.
- **Design System:** Responsive, mobile-first utility layout built on Tailwind CSS v4 and Lucide React icons.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 15.3.5 (App Router, Server & Client Components) |
| **UI Library** | React 19.2.1 |
| **State Management** | Redux Toolkit 2.8.2, React-Redux 9.2.0 |
| **Styling & Icons** | Tailwind CSS v4, Lucide React |
| **Data Visualization** | Recharts 3.1.2 |
| **ORM & Database** | Prisma Client 5.22.0, PostgreSQL / Relational Schema |
| **Date & Formatting** | date-fns 4.1.0 |
| **Notifications** | react-hot-toast 2.5.2 |

---

## 📦 Application Modules

1. **Customer Storefront (`/`, `/shop`, `/product/[productId]`, `/cart`, `/orders`):**
   - Browse latest and best-selling tech gadgets and lifestyle products.
   - Filter, search, and inspect product specifications and verified ratings.
   - Manage persistent shopping cart, select delivery addresses, and apply promotional coupons.
   - Place orders via Cash On Delivery (COD) or Online Stripe checkout.
   - Track order progression and submit product reviews.

2. **Vendor / Seller Portal (`/store`, `/store/add-product`, `/store/manage-product`, `/store/orders`):**
   - Vendor analytics dashboard displaying store earnings, order volumes, and customer ratings.
   - Product catalog management (add new products, upload images, toggle in-stock availability).
   - Order fulfillment pipeline with customer delivery details and status updates.

3. **Platform Administration (`/admin`, `/admin/stores`, `/admin/approve`, `/admin/coupons`):**
   - Marketplace analytics, revenue metrics, and interactive daily order volume area charts.
   - Vendor application verification and store approval workflows.
   - Active store monitoring and platform-wide coupon generation.

---

## ⚙️ Prerequisites

Before getting started, ensure you have the following installed on your workstation:

- **Node.js:** v18.18.0 or higher (v20+ recommended)
- **Package Manager:** `npm` (v9 or v10), `yarn`, or `pnpm`
- **Git:** v2.30+
- Modern Web Browser (Chrome, Firefox, or Edge) with DevTools enabled

---

## 🚀 Getting Started & Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd Go-Cart-Project-Debugging
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

---

## 🔧 Environment Configuration

Copy the example environment file:
```bash
cp .env.example .env.local
```

### Environment Variables Reference
```env
# Currency Symbol displayed across UI
NEXT_PUBLIC_CURRENCY_SYMBOL = '$'

# Optional Database Connection (Prisma PostgreSQL)
# If omitted, application runs using built-in mock persistent storage
# DATABASE_URL = "postgresql://user:password@localhost:5432/gocart?schema=public"
# DIRECT_URL   = "postgresql://user:password@localhost:5432/gocart?schema=public"

# Authentication Secret
JWT_SECRET = "gocart-development-jwt-secret-key"
```

---

## 🗄️ Database Setup

The project uses Prisma ORM.

- If connecting to a live PostgreSQL instance, set `DATABASE_URL` in `.env.local` and apply migrations:
  ```bash
  npx prisma db push
  ```
- If running in standalone development mode without an external database, the platform provides seamless mock storage and pre-seeded catalog datasets out-of-the-box.

---

## 💻 Execution & Access

### Development Server
Start the development server with Turbopack:
```bash
npm run dev
```

### Production Build & Execution
Verify build integrity and start in production mode:
```bash
npm run build
npm run start
```

### Application URLs
Once running, open [http://localhost:3000](http://localhost:3000) in your browser:

- **Customer Storefront:** `http://localhost:3000/`
- **Product Catalog & Search:** `http://localhost:3000/shop`
- **Shopping Cart & Checkout:** `http://localhost:3000/cart`
- **Customer Order Tracking:** `http://localhost:3000/orders`
- **Seller Application:** `http://localhost:3000/create-store`
- **Seller Management Portal:** `http://localhost:3000/store`
- **Administrator Dashboard:** `http://localhost:3000/admin`
- **Admin Coupon Management:** `http://localhost:3000/admin/coupons`
- **Admin Store Verification:** `http://localhost:3000/admin/approve`

---

## 🎯 Advanced Engineering Debugging Challenge

> ### ⚠️ Attention Engineering Workshop Participants
> This codebase is part of an **Advanced Full-Stack Engineering Debugging Challenge**.  
> The application has been built and configured to run, but contains a series of **carefully engineered, hidden technical defects, architectural vulnerabilities, and logical flaws** distributed across the entire full-stack system.

### Your Objectives
As a full-stack engineer and software architect, you are tasked with auditing and debugging the platform:

1. **Architecture Exploration:** Deeply examine the frontend component hierarchy, Redux state synchronization, backend Route Handlers, database schemas, and integration contracts.
2. **Behavioral Investigation:** Exercise customer, vendor, and administrator journeys. Test edge cases, concurrent operations, form submissions, and data mutations.
3. **Issue Discovery:** Uncover hidden functional bugs, state management desynchronizations, performance bottlenecks, and security vulnerabilities.
4. **Root Cause Analysis (RCA):** Determine the exact technical mechanisms of failure. Do not settle for superficial workarounds or symptom masking.
5. **Implementation of Fixes:** Implement clean, production-grade solutions preserving the existing UI/UX, design system, and business workflows.
6. **Validation & Testing:** Write comprehensive test cases or reproduction scripts (curl, integration tests, or step-by-step browser validations) confirming that your fixes resolve the issues without introducing regressions.
7. **Documentation:** Document your investigation, root causes, code solutions, and verification evidence in a professional debugging report.

---

## 📋 Student Expectations & Submission Guidelines

### What You Should Submit
Your final submission must include:
1. **Source Code Repository:** A clean Git branch or pull request containing your verified bug fixes.
2. **Engineering Debugging Report (`DEBUGGING_REPORT.md`):**
   - For every discovered issue:
     - Clear description of the problem.
     - Step-by-step reproduction instructions.
     - In-depth Root Cause Analysis (why it failed).
     - Your code-level fix with before/after diffs.
     - Verification steps and test evidence.
     - Architectural takeaway / engineering concept learned.

### Evaluation Criteria
Submissions will be assessed based on:
- **Depth of Bug Discovery:** Discovering advanced backend, database, and security flaws in addition to frontend issues.
- **RCA Quality:** Demonstrating deep systems-level understanding rather than guessing.
- **Architectural Soundness:** Clean, idiomatic, robust fixes without breaking existing application aesthetics or features.
- **Verification Rigor:** Providing clear, reproducible validation evidence for every fix.

---

## 📜 Contributing & License

This project is licensed under the MIT License. See [LICENSE.md](./LICENSE.md) for full license details.

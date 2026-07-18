# ShopNest — Frontend

A full-stack jewelry e-commerce storefront and admin panel, built with React, Redux Toolkit, and Tailwind CSS. Designed to integrate directly with the existing ShopNest Express/MongoDB backend.

## Tech Stack

- **React 18** (Vite)
- **Redux Toolkit** + **React Redux** — global state (auth, cart, wishlist, products, orders)
- **React Router v6** — routing, protected routes, admin routes
- **Axios** — API calls, with a JWT-attaching interceptor
- **Tailwind CSS** — styling, custom pastel/jewelry theme
- **React Icons** — iconography
- **React Toastify** — notifications
- **Razorpay Checkout.js** — payment, loaded dynamically and wired to the backend's `/api/payment` routes

## Getting Started

```bash
npm install
cp .env.example .env   # then fill in real values
npm run dev             # http://localhost:3000
```

### Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL of your backend API, e.g. `http://localhost:5000/api` |
| `VITE_RAZORPAY_KEY_ID` | Your **public** Razorpay Key ID (same value as `RAZORPAY_KEY_ID` in the backend's `.env` — this is safe to expose client-side; the secret stays server-side only) |

## Project Structure

```
src/
├── api/                  # axios instance, razorpay flow, analytics fetcher
├── components/           # Navbar, Footer, ProductCard, route guards, etc.
├── layouts/              # MainLayout (storefront), AdminLayout (admin panel)
├── pages/                # Customer-facing routes
├── admin/
│   ├── pages/             # Admin dashboard, products, orders, users, analytics
│   └── components/        # ProductFormModal (create/edit with image upload)
├── redux/
│   ├── store.js
│   └── slices/            # authSlice, productSlice, cartSlice, wishlistSlice, orderSlice, uiSlice
└── utils/helpers.js       # image URL resolution, currency/date formatting
```

## Backend Routes This Frontend Expects

These match your uploaded `routes/*.js` files exactly — no backend changes required to run this frontend as-is.

| Method | Route | Auth | Used By |
|---|---|---|---|
| POST | `/api/auth/register` | — | RegisterPage |
| POST | `/api/auth/login` | — | LoginPage |
| GET | `/api/auth/users` | admin | AdminUsersPage |
| GET | `/api/products` | — | ProductsPage, HomePage |
| GET | `/api/products/:id` | — | ProductDetailsPage |
| POST | `/api/products` | admin (multipart, field `image`) | AdminProductsPage |
| PUT | `/api/products/:id` | admin (multipart, field `image`) | AdminProductsPage |
| DELETE | `/api/products/:id` | admin | AdminProductsPage |
| POST | `/api/orders` | user | CheckoutPage |
| GET | `/api/orders/myorders` | user | OrderHistoryPage |
| GET | `/api/orders` | admin | AdminOrdersPage |
| PUT | `/api/orders/:id/status` | admin | AdminOrdersPage |
| POST | `/api/payment/order` | — | CheckoutPage (via razorpay.js) |
| POST | `/api/payment/verify` | — | CheckoutPage (via razorpay.js) |
| GET | `/api/analytics` | admin | AdminDashboardPage, AdminAnalyticsPage |







- `npm run dev` — start dev server (port 3000, matches backend CORS allowlist)


# E-Bookstore

A single-page e-bookstore built with **React 19**, **TypeScript**, **Vite**, **Redux Toolkit**, and **Tailwind CSS**.

## Features

- Browse a book catalogue with detail pages, category and brand filters, price and rating filters, and sorting
- Add books to a shopping cart
- Save books to a per-customer wishlist, available across reloads
- Responsive browsing and checkout layouts for phones, tablets, and laptops, with a collapsible phone navigation menu
- Checkout and payment flow with order confirmation
- State managed with Redux Toolkit (cart, catalogue, checkout, session)
- Cart state persisted across page reloads
- Demo login remains active across reloads until you sign out (stored locally in the browser)

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 + React Router v7 | UI & client-side routing |
| Redux Toolkit | Global state management |
| Axios | HTTP service layer |
| Tailwind CSS | Utility-first styling |
| Vite | Dev server & bundler |
| TypeScript | Type safety |

## Pages

| Route | Page |
|---|---|
| `/` | Home |
| `/catalogue` | Book catalogue |
| `/catalogue/:bookId` | Book detail |
| `/cart` | Shopping cart |
| `/wishlist` | Saved books |
| `/checkout` | Checkout |
| `/payment` | Payment |
| `/confirmation` | Order confirmation |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

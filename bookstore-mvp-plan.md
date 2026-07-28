# Bookstore MVP Plan

## Top-Level Overview
Create a frontend-only online bookstore MVP from an empty repository using React 19, TypeScript, Vite, Redux Toolkit, Tailwind CSS, Axios, and responsive layouts. The app will use mocked data and a simulated checkout flow to support the required journeys: landing page, catalogue browsing, product detail and related books, cart, delivery and payment selection, gift point redemption, payment completion, purchase confirmation, mocked order history, and buy again. A simple mocked sign-in selector will provide one or two demo users with addresses, order history, and gift points.

## Sub-Tasks

### 1. Project foundation and app shell
- **Intent** — Establish the required frontend stack and baseline app structure so the rest of the MVP can be built consistently.
- **Expected Outcomes** — A Vite React TypeScript app exists with Tailwind configured, Redux Toolkit integrated, responsive global layout in place, and route structure ready for the core customer journeys.
- **Todo List**
  1. Scaffold the Vite React TypeScript application in the empty workspace.
  2. Add and configure Tailwind CSS, Redux Toolkit, React Redux, routing, and Axios.
  3. Define the base source structure for pages, components, store, mock data, types, and utilities.
  4. Create the shared app shell with header, navigation, footer, and responsive container layout.
  5. Set up the initial route map for landing, catalogue, product detail, cart, checkout, payment, and confirmation views.
- **Relevant Context** — Repository root is currently empty.
- **Status** — [x] done

### 2. Mock domain data and state model
- **Intent** — Create the mocked bookstore dataset and Redux state needed to drive all MVP screens and interactions.
- **Expected Outcomes** — Typed mock data exists for books, categories, demo users, addresses, order history, gift points, related products, and cart-ready product entities; Redux slices support user selection, catalogue filtering, cart changes, and checkout progress.
- **Todo List**
  1. Define TypeScript models for books, categories, users, addresses, cart items, orders, and payment options.
  2. Create seeded mock datasets for one or two demo users and a meaningful set of books across categories.
  3. Add selectors and helper logic for related books, recommendations from order history, and buy again actions.
  4. Implement Redux slices for demo session state, catalogue filters, cart contents, and checkout state.
  5. Add any lightweight mock service layer needed so Axios usage remains aligned with future API integration.
- **Relevant Context** — Repository root is currently empty.
- **Status** — [x] done

### 3. Shopping experience screens
- **Intent** — Deliver the browse and selection journey from landing page through catalogue and product exploration.
- **Expected Outcomes** — Users can sign in as a demo user, see available books on the landing page, browse categories and brands, open product details, view related books, review mocked order history, and trigger buy again and recommendation flows.
- **Todo List**
  1. Build the landing page with featured and available books plus demo user selection.
  2. Build the catalogue page with category, brand, and product browsing controls.
  3. Build the product detail experience with delivery hints and related book suggestions.
  4. Build the order history section with buy again behavior.
  5. Surface recommendation modules based on mocked order history in appropriate views.
- **Relevant Context** — Depends on project shell, routing, mock data, and Redux state from prior subtasks.
- **Status** — [x] done

### 4. Cart, checkout, and payment flow
- **Intent** — Support the purchase journey from adding books to basket through simulated payment.
- **Expected Outcomes** — Users can add books to cart, review basket contents, see recommendations, choose a delivery address, select a payment option, redeem gift points, simulate payment completion, and receive purchase confirmation messaging.
- **Todo List**
  1. Implement add to cart and quantity management interactions.
  2. Build the shopping cart page with totals and recommendation section.
  3. Build the checkout page for delivery address selection and gift point redemption.
  4. Build the payment page with payment method selection and simulated payment submission.
  5. Build the purchase confirmation page with clear completion messaging and order summary.
- **Relevant Context** — Depends on cart and checkout slices plus catalogue and user mock data.
- **Status** — [x] done

### 5. Polish, responsiveness, and validation
- **Intent** — Make the MVP cohesive, responsive, and ready for review.
- **Expected Outcomes** — The app behaves well across common viewport sizes, key empty and success states are present, and the project passes relevant validation commands.
- **Todo List**
  1. Refine responsive layouts, spacing, and component consistency across all pages.
  2. Add clear empty states and lightweight success messaging where needed for the mocked flows.
  3. Verify navigation continuity across the full customer journey.
  4. Run the applicable validation commands for build and static checks.
  5. Fix any issues surfaced by validation before handoff.
- **Relevant Context** — Depends on all prior subtasks being in place.
- **Status** — [x] done

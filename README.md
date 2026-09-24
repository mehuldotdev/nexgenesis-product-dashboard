# Product Admin Dashboard

A lightweight, responsive product management dashboard built with Next.js, React, Tailwind CSS, and Axios consuming the [DummyJSON](https://dummyjson.com) API.

## Setup & Running Locally

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000).

### Demo Credentials
* **Username:** `emilys`
* **Password:** `emilyspass`
*(You can also click the "Fill Credentials" button on the login screen to quickly test)*

---

## Features Implemented

* **Authentication & Protected Routes:**
  * Login with `POST /auth/login` via DummyJSON.
  * Form validation and error messaging for invalid credentials.
  * Route protection redirecting unauthorized users from `/products` to `/login`.
  * Top navigation bar with user profile details and logout button.
  * Double-submit prevention on the login button.

* **Product List & Responsiveness:**
  * Desktop view: Clean data table with thumbnails, titles, categories, pricing, ratings, stock badges, and actions.
  * Mobile view: Responsive card grid with touch-friendly actions.

* **Custom Pagination (No external libraries):**
  * Hand-rolled pagination using `limit` and `skip`.
  * Page number buttons with dynamic ellipses (`...`).
  * Page size selector (10, 20, 50).
  * Dynamic counter: *"Showing X–Y of Z"*.

* **Debounced Search & Filter:**
  * Search via `/products/search?q=` with a 350ms debounce.
  * Dynamic category filter populated from `/products/categories`.
  * Multi-field sorting by Title, Price, or Rating (Ascending/Descending).
  * Auto-resets to page 1 whenever search, category, or limit changes.

* **Product Details (`/products/[id]`):**
  * Gallery image viewer with thumbnail selection.
  * Pricing, discount badge, stock availability, SKU, shipping and warranty terms.
  * Customer reviews breakdown with star ratings.
  * Graceful "Product Not Found" state for non-existent IDs.

* **CRUD with In-Session Persistence:**
  * Add Product modal with validation.
  * Edit Product modal pre-populated with existing values.
  * Confirmation dialog modal before deleting products.
  * Double-click prevention on Save buttons.
  * Local session overrides (`ProductContext` + `sessionStorage`) so additions, edits, and deletions persist across navigation during review.

* **Resilient URL State & Edge Cases:**
  * URL synchronizes `q`, `category`, `sortBy`, `order`, `page`, and `limit`.
  * Corrupted or extreme queries like `?page=abc` or `?page=9999` are clamped safely to avoid crashes.
  * Loading skeletons, empty state illustration, and an error state with an active **Retry** button.

---

## Technical Choices & Notes

1. **Shared Axios Instance (`src/api/client.ts`):**
   * Configured a centralized Axios client with request interceptors to automatically append `Authorization: Bearer <token>` and response interceptors to handle 401 token expiration and uniform error formatting.
   * UI components never call Axios directly; calls are separated into pure API service files (`src/api/auth.ts`, `src/api/products.ts`).

2. **Search & Category Filter Conflict Resolution:**
   * *Problem:* DummyJSON does not support simultaneous search and category query parameters (`/products/search` ignores category).
   * *Choice:* When both a search query and category filter are active, the application queries the search endpoint and applies client-side filtering on the matching items for that category. A note badge is displayed to inform the user that results are filtered within that category.

3. **Handling DummyJSON Mock Mutations:**
   * *Problem:* DummyJSON returns successful responses for `POST /products/add`, `PUT /products/[id]`, and `DELETE /products/[id]`, but does not persist changes on their backend.
   * *Choice:* Maintained a lightweight local session override store (`ProductContext`). Once the network request succeeds, the item is inserted, updated, or marked deleted locally so the UI behaves like a real persistent system.

4. **Race Condition Prevention in Search:**
   * *Problem:* Fast typing with latency (e.g. `&delay=2000`) can cause slow, earlier search responses to arrive after newer keystrokes and overwrite fresh results.
   * *Fix:* Used an `AbortController` coupled with an incremental request counter in `useProducts`. Every new search cancels the previous in-flight request and verifies the sequence ID before setting state.

5. **Where AI Assisted:**
   * AI assisted in drafting TypeScript interfaces matching DummyJSON's payload shapes and scaffolding the initial Tailwind UI structures. All logic for custom pagination, AbortController request racing, and URL query sanitization was implemented and verified directly.

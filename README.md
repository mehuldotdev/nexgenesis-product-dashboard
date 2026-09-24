# Product Admin Dashboard

A responsive product management dashboard using the [DummyJSON](https://dummyjson.com) API, built with Next.js (App Router), Tailwind CSS, and Axios.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

* **Username:** `emilys`
* **Password:** `emilyspass`

## What's Built

- **Auth & Protection:** Login with error states, route protection, token injection via Axios interceptor, and logout.
- **Product Views:** Desktop data table and mobile card view showing image, title, category, price, rating, and stock.
- **Pagination:** Custom limit/skip logic with page numbers, ellipsis, size toggle (10, 20, 50), and range text.
- **Search & Filters:** Debounced search with `AbortController` cancellation, category dropdown, and sorting (price, rating, title) synced with the URL.
- **Product Details:** `/products/[id]` page with image gallery, specs, reviews, and a 404 state.
- **CRUD:** Validated Add/Edit modals and delete confirmation dialog, with double-click submit prevention.
- **Empty / Error States:** Skeleton loading screens, empty search state, and error banner with retry button.

## Notes & Tradeoffs

- **Axios Client (`src/api/client.ts`):** Single shared client handles bearer token injection and 401 redirects. API calls are kept separate from UI components in `src/api/`.
- **Search + Category Filter:** DummyJSON doesn't allow searching and filtering by category simultaneously. When both are used, the app queries search results and client-filters by category.
- **Mock Mutations:** DummyJSON doesn't save added/edited/deleted products to its database. Handled by maintaining a local session override store (`ProductContext` + `sessionStorage`) so changes persist across routes during testing.
- **Search Race Condition:** Fast typing with simulated latency (`&delay=2000`) can cause older responses to overwrite newer ones. Fixed by pairing `AbortController` with an incremental request counter in `useProducts`.
- **AI Usage:** Used for initial boilerplate structure and TypeScript interface definitions. Core state, pagination, abort handling, and URL syncing were written and verified manually.

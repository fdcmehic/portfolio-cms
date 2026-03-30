# Portfolio CMS

A mobile-first admin panel for managing image galleries on [asmirmehic.com](https://asmirmehic.com). Built to replace manual HTML editing — upload, reorder, and delete images directly from a phone browser.

---

## What It Does

Three gallery editors — Architecture, Motorsport, Photography — each with a live connection to the portfolio website. Changes made in the admin panel reflect on the portfolio immediately.

- **Upload** — select one or multiple images, they upload automatically
- **Reorder** — drag and drop on both mobile and desktop
- **Delete** — select mode for bulk deletion
- **Auth** — JWT login protects all write operations

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + Tailwind |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| File storage | Cloudinary |
| Hosting | Vercel (frontend) + Railway (backend + DB) |

---

## Architecture

The admin panel is a React SPA deployed on Vercel. It talks to an Express API on Railway, which handles authentication, file uploads to Cloudinary, and database operations in PostgreSQL. The portfolio website (static HTML/CSS on GitHub Pages) fetches images from the same API via a small vanilla JS script — no rebuild needed.

```
React (Vercel)
    ↓ JWT-authenticated requests
Express API (Railway)
    ↓                    ↓
PostgreSQL          Cloudinary
(image metadata)    (image files)
    ↑
HTML Portfolio (GitHub Pages)
fetches images via public GET endpoint
```

---

## Key Features

**Authentication** — JWT-based login. Credentials stored as environment variables, no user database needed. Token stored in localStorage, sent with every write request. GET routes stay public so the portfolio can fetch images without auth.

**Multiple upload** — multer handles incoming files server-side, uploads each one to Cloudinary sequentially, saves the URL to PostgreSQL. Auto-triggers on file selection — no submit button.

**Drag and drop** — dnd-kit with touch sensor support. 400ms hold delay distinguishes tap from drag on mobile. Order persisted to the database on every drag end.

**Select mode** — tap to select multiple images, bulk delete in one operation. Cleaner than per-image delete buttons on a dense grid.

---

## Project Structure

```
portfolio-cms/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── middleware/
│   │   └── auth.js
│   └── routes/
│       ├── images.js
│       └── auth.js
└── admin/
    └── src/
        ├── components/
        │   ├── Nav.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── SortableImage.jsx
        │   └── Spinner.jsx
        └── pages/
            ├── Login.jsx
            └── Gallery.jsx
```

---

## Environment Variables

```
DATABASE_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
ADMIN_USERNAME=
ADMIN_PASSWORD=
JWT_SECRET=
```

---

*Built as part of a fullstack development learning path — March 2026*

# Project — Portfolio CMS (Mobile Admin Panel)

## What We're Building

A mobile-friendly React admin panel that manages the image galleries on an existing HTML/CSS portfolio website. Instead of editing HTML directly to update gallery images, the admin panel lets you upload images, assign them to a gallery, reorder them, and save — all from your phone.

---

## The Portfolio (Existing)

- **Live at:** asmirmehic.com
- **Built with:** HTML + CSS (static, hosted on GitHub Pages)
- **4 pages total:**
  - Architecture gallery
  - Motorsport gallery
  - General Photography gallery
  - Contact page
- **Change:** The three gallery pages will be updated to fetch images from the Express API instead of having them hardcoded in HTML

---

## The Admin Panel (What We're Building)

- **Built with:** React (mobile-first UI)
- **Who uses it:** Only you — not public facing
- **Accessed from:** Phone browser
- **Hosted separately** from the portfolio

### User Flow
```
Open admin panel on phone
→ Select a gallery (Architecture / Motorsport / Photography)
→ Upload one or multiple images
→ Reorder images within the gallery (drag and drop — v2)
→ Save — changes reflect on the live portfolio immediately
```

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Admin frontend | React (Vite, mobile-first) |
| Backend API | Node.js + Express |
| Database | PostgreSQL |
| File storage | Cloudinary (free tier) |
| Portfolio frontend | Existing HTML/CSS + small fetch script added |
| Deployment | Express on Railway/Render, React admin on Vercel |

---

## Data Structure

### Images Table (PostgreSQL)

| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PRIMARY KEY | auto-generated |
| url | VARCHAR(255) NOT NULL | Cloudinary image URL |
| gallery | VARCHAR(255) NOT NULL | 'architecture', 'motorsport', 'photography' |
| order_index | INTEGER | position in the gallery |
| created_at | TIMESTAMP DEFAULT NOW() | auto-generated |

---

## API Routes (Express)

| Method | Route | What it does |
|--------|-------|--------------|
| GET | /images/:gallery | Get all images for a gallery, ordered |
| POST | /images | Upload image to Cloudinary, save URL to PostgreSQL |
| PUT | /images/:id/order | Update order index of an image |
| DELETE | /images/:id | Remove an image from a gallery |

---

## Pages (React Admin Panel)

### 1. Home / Gallery Selector
- Three buttons — Architecture, Motorsport, Photography
- Tap one to enter that gallery

### 2. Gallery View
- Shows all images in the selected gallery in current order
- Upload button — add new image(s)
- Reorder images (drag and drop — v2)
- Delete button per image

---

## Version Plan

### Version 1 — Core (what we build first)
- Upload an image and assign it to a gallery
- View images per gallery
- Delete an image
- Portfolio HTML fetches and displays images from the API

### Version 2 — Polish (after v1 is deployed)
- Drag and drop reordering
- Multiple image upload at once
- Better mobile UI
- Auth

---

## Folder Structure

```
portfolio-cms/
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── routes/
│   │   └── images.js
│   └── .env
├── admin/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Gallery.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
└── README.md
```

---

## Project Parts Overview

### Part 1 — Database ✅
- Design and create the images table in PostgreSQL
- Columns: id, url, gallery, order_index, created_at

### Part 2 — Backend (Express) ✅
- Set up the project folder structure
- Create server.js and db.js
- Set up Cloudinary account and get API keys
- Install dependencies — express, pg, cors, dotenv, multer, cloudinary
- Build 4 routes:
  - GET /images/:gallery — fetch all images for a gallery
  - POST /images — upload image to Cloudinary, save URL to PostgreSQL
  - PUT /images/:id/order — update order index
  - DELETE /images/:id — remove an image
- Test all routes with Postman ✅

### Part 3 — React Admin Panel ✅
- Set up Vite project
- Install React Router, wire up BrowserRouter
- Build Home page — three gallery buttons with useNavigate
- Build Gallery page — fetches images, upload form, delete per image
- Connect all pages with React Router
- Full flow working: React → Express → Cloudinary → PostgreSQL → React

### Part 4 — Portfolio Integration
- Add a small fetch script to each HTML gallery page
- Replace hardcoded images with dynamically fetched ones from the API
- Test that changes in the admin panel reflect on the portfolio

### Part 5 — Deployment
- Deploy Express backend to Railway or Render
- Deploy React admin panel to Vercel
- Set up environment variables on both platforms
- Test everything end to end on live URLs
- Test on phone

### Part 6 — Version 2 (after v1 is live)
- Drag and drop reordering
- Multiple image upload at once
- Better mobile UI polish
- Add Auth

---

## Completed Code

### backend/db.js
```js
require('dotenv').config({ quiet: true });
const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'portfolio_cms',
    password: process.env.DB_PASSWORD,
    port: '5432'
});

module.exports = pool;
```

### backend/server.js
```js
require('dotenv').config({ quiet: true });
const cors = require('cors');
const express = require('express');
const app = express();
const imageRouter = require('./routes/images');

// middleware must come before routes
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/images', imageRouter);

app.listen(3000, () => {
    console.log('Server running on port 3000.')
});
```

### backend/routes/images.js
```js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary with credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Multer stores file in memory before passing to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

// GET /images/:gallery — fetch all images for a gallery ordered by position
router.get('/:gallery', async (req, res) => {
    const { gallery } = req.params;
    const result = await pool.query(
        'SELECT * FROM images WHERE gallery = $1 ORDER BY order_index', [gallery]);
    return res.json(result.rows);
});

// POST /images — upload image to Cloudinary, save URL + gallery to PostgreSQL
router.post('/', upload.single('image'), async (req, res) => {
    const { gallery } = req.body;

    // Wrap Cloudinary's callback-based upload in a Promise so we can await it
    const uploadToCloudinary = () => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(req.file.buffer);  // send the file buffer to Cloudinary
    });

    const cloudinaryResult = await uploadToCloudinary();

    // Save the returned Cloudinary URL to PostgreSQL
    const dbResult = await pool.query(
        'INSERT INTO images (url, gallery, order_index) VALUES ($1, $2, $3) RETURNING *',
        [cloudinaryResult.secure_url, gallery, 0]
    );

    res.status(201).json(dbResult.rows[0]);
});

// PUT /images/:id/order — update the order position of an image
router.put('/:id/order', async (req, res) => {
    const { order_index } = req.body;  // new position comes from request body
    const { id } = req.params;         // image id comes from URL
    const images = await pool.query(
        'UPDATE images SET order_index = $1 WHERE id = $2 RETURNING *',
        [order_index, id]);
    return res.json(images.rows[0]);
});

// DELETE /images/:id — remove an image from the gallery
router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const images = await pool.query(
        'DELETE FROM images WHERE id = $1 RETURNING *', [id]);
    return res.json(images.rows[0]);
});

module.exports = router;
```

### backend/.env
```
DB_PASSWORD=yourpassword
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### admin/main.jsx
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

### admin/App.jsx
```jsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Gallery from './pages/Gallery'

function App() {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/gallery/:gallery' element={<Gallery />} />
      </Routes>
    </div>
  )
}

export default App
```

### admin/pages/Home.jsx
```jsx
import { useNavigate } from "react-router-dom"

function Home() {
    const navigate = useNavigate()   // hook for programmatic navigation

    return (
        <div>
            {/* navigate called inside arrow function — prevents firing on render */}
            <button onClick={() => navigate('/gallery/architecture')}>Architecture</button>
            <button onClick={() => navigate('/gallery/motorsport')}>Motorsport</button>
            <button onClick={() => navigate('/gallery/photography')}>Photography</button>
        </div>
    )
}

export default Home
```

### admin/pages/Gallery.jsx
```jsx
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function Gallery() {
    const { gallery } = useParams()          // reads gallery name from URL
    const [images, setImages] = useState([])
    const [file, setFile] = useState(null)   // holds the selected file

    // named function so it can be called from both useEffect and after upload/delete
    async function fetchImages() {
        const response = await fetch(`http://localhost:3000/images/${gallery}`)
        const data = await response.json()
        setImages(data)
    }

    useEffect(() => {
        fetchImages()
    }, [gallery])                            // re-runs when gallery changes in URL

    async function handleUpload(e) {
        e.preventDefault()
        const formData = new FormData()      // FormData used for file uploads, not JSON
        formData.append('image', file)       // the file itself
        formData.append('gallery', gallery)  // which gallery it belongs to
        const response = await fetch('http://localhost:3000/images', {
            method: 'POST',
            body: formData                   // no Content-Type header — browser sets it automatically
        })
        const data = await response.json()
        fetchImages()                        // refetch so new image appears immediately
        setFile(null)                        // clear file state
    }

    async function handleDelete(id) {
        await fetch(`http://localhost:3000/images/${id}`, {
            method: 'DELETE'
        })
        fetchImages()                        // refetch so deleted image disappears immediately
    }

    return (
        <div>
            <h1>{gallery}</h1>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit">Upload</button>
            </form>
            {images.map(img => (
                <div key={img.id}>
                    <img src={img.url} width="200" />
                    <button onClick={() => handleDelete(img.id)}>Delete</button>
                </div>
            ))}
        </div>
    )
}

export default Gallery
```

---

## Key Decisions

- **Images stored as URLs** — not as binary data in PostgreSQL, Cloudinary hosts the files
- **File storage** — Cloudinary (free tier)
- **Multer memoryStorage** — file held in memory temporarily, passed straight to Cloudinary, never saved to disk
- **FormData for uploads** — not JSON, browser sets Content-Type automatically
- **No auth for v1** — admin panel is not public, auth added in v2
- **Portfolio stays in HTML/CSS** — only a small fetch script added, no rebuild in React
- **CORS middleware must come before routes** — order matters in Express

---

*Created: March 2026 — update as decisions are made and features are built*

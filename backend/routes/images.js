const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/auth')

const cloudinary = require('cloudinary').v2;
const multer = require('multer');
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:gallery', async (req, res) => {
    let { gallery } = req.params;
    let result = await pool.query(
        'SELECT * FROM images WHERE gallery = $1 ORDER BY order_index', [gallery]);
    return res.json(result.rows);
});

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    const { gallery } = req.body;
    const uploadToCloudinary = () => new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio' },    
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(req.file.buffer);
    });
    const cloudinaryResult = await uploadToCloudinary();
    
    const dbResult = await pool.query(
        'INSERT INTO images (url, gallery, order_index) VALUES  ($1, $2, $3) RETURNING *',
        [cloudinaryResult.secure_url, gallery, 0]
    );
    
    res.status(201).json(dbResult.rows[0]);
});

router.put('/:id/order', authenticateToken, async (req, res) => {
    const { order_index } = req.body;
    const { id } = req.params;
    const images = await pool.query('UPDATE images SET order_index = $1 WHERE id = $2 RETURNING *',[order_index, id]);
    return res.json(images.rows[0]);
});

router.delete('/:id', authenticateToken, async (req, res) => {
    const id = req.params.id;
    const images = await pool.query('DELETE FROM images WHERE id = $1 RETURNING *', [id]);
    return res.json(images.rows[0]);
});

module.exports = router;
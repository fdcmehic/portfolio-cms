import express, { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import pool from '../db';
import authenticateToken from '../middleware/auth';

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/:gallery', async (req: Request, res: Response) => {
    let { gallery } = req.params;
    let result = await pool.query(
        'SELECT * FROM images WHERE gallery = $1 ORDER BY order_index', [gallery]);
    res.json(result.rows);
});

router.post('/', authenticateToken, upload.array('images'), async (req: Request, res: Response) => {
    const { gallery } = req.body
    const files = req.files as Express.Multer.File[];
    const result = [];

    const uploadToCloudinary = (file: Express.Multer.File) => new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio' },    
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        )
        stream.end(file.buffer)
    });

    for (const file of files) {
        const cloudinaryResult = await uploadToCloudinary(file);
        const dbResult = await pool.query(
            'INSERT INTO images (url, gallery, order_index) VALUES  ($1, $2, $3) RETURNING *',
            [cloudinaryResult.secure_url, gallery, 0]
        )
        result.push(dbResult.rows[0])
    }
    res.status(201).json(result);
});

router.put('/:id/order', authenticateToken, async (req: Request, res: Response) => {
    const { order_index } = req.body;
    const { id } = req.params;
    const images = await pool.query(
        'UPDATE images SET order_index = $1 WHERE id = $2 RETURNING *',
        [order_index, id])
    res.json(images.rows[0]);
});

router.delete('/:id', authenticateToken, async (req: Request, res: Response) => {
    const id = req.params.id;
    const images = await pool.query(
        'DELETE FROM images WHERE id = $1 RETURNING *', [id]);
    res.json(images.rows[0]);
});

export default router
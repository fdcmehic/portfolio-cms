import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const API = 'https://portfolio-cms-production-7468.up.railway.app'

function Gallery() {
    const { gallery } = useParams()
    const [ images, setImages ] = useState([])
    const [ files, setFiles ] = useState([])

    async function fetchImages() {
        const response = await fetch(`${API}/images/${gallery}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        const data = await response.json()
        setImages(data)
    }

    useEffect(() => {
        fetchImages()
    }, [gallery])

    async function handleUpload(e) {
        e.preventDefault()
        const formData = new FormData()
        files.forEach(file => formData.append('images', file))
        formData.append('gallery', gallery)
        const response = await fetch(`${API}/images`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, 
            body: formData
        })
        const data = await response.json();
        fetchImages()
        setFiles([])
    }

    async function handleDelete(id) {
        await fetch(`${API}/images/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
        fetchImages()
    }

    return (
        <div>
            <h1>{gallery}</h1>
            <form onSubmit={handleUpload}>
                <input type="file" 
                multiple
                onChange={(e) => setFiles(Array.from(e.target.files))} />
                <button type="submit">Upload</button>
            </form>
            <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '4px'
                    }}>
                {images.map(img => (
                <div key={img.id}>
                    <img src={img.url} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                    <button onClick={() => handleDelete(img.id)}>Delete</button>
                </div>
                ))}
            </div>
        </div>
    )
}

export default Gallery;
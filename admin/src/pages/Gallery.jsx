import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const API = 'https://portfolio-cms-production-7468.up.railway.app'

function Gallery() {
    const { gallery } = useParams()
    const [ images, setImages ] = useState([])
    const [ file, setFile ] = useState(null)

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
        formData.append('image', file)
        formData.append('gallery', gallery)
        let response = await fetch(`${API}/images`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, 
            body: formData
        })
        let data = await response.json();
        fetchImages()
        setFile(null)
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
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <button type="submit">Upload</button>
            </form>
            {images.map(img => (
                <div key={img.id}>
                    <img src={img.url} width='200' />
                    <button onClick={() => handleDelete(img.id)}>Delete</button>
                </div>
            ))}
        </div>
    )
}

export default Gallery;
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

function Gallery() {
    const { gallery } = useParams()
    const [ images, setImages ] = useState([])
    const [ file, setFile ] = useState(null)

    useEffect(() => {
        fetch(`http://localhost:3000/images/${gallery}`)
            .then(res => res.json())
            .then(data => setImages(data))
    }, [gallery])

    async function fetchImages() {
        const response = await fetch(`http://localhost:3000/images/${gallery}`)
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
        let response = await fetch('http://localhost:3000/images', {
            method: 'POST',
            body: formData
        })
        let data = await response.json();
        fetchImages()
        setFile(null)
    }

    async function handleDelete(id) {
        await fetch(`http://localhost:3000/images/${id}`, {
            method: 'DELETE'
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
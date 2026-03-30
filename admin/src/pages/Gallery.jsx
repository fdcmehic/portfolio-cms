import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableImage from "../components/SortableImage";

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

    async function handleDragEnd(event) {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = images.findIndex(img => img.id === active.id)
        const newIndex = images.findIndex(img => img.id === over.id)
        const reordered = arrayMove(images, oldIndex, newIndex)
        setImages(reordered)

        await Promise.all(reordered.map((img, index) => 
            fetch(`${API}/images/${img.id}/order`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }, 
                body: JSON.stringify({ order_index: index })
            })
        ))
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

            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map(img => img.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-3 md:grid-cols-8 gap-1">
                        {images.map(img => (
                            <SortableImage key={img.id} img={img} onDelete={handleDelete} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default Gallery;
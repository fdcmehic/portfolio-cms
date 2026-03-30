import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { DndContext, closestCenter, PointerSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import SortableImage from "../components/SortableImage";
import Nav from "../components/Nav";

const API = 'https://portfolio-cms-production-7468.up.railway.app'

function Gallery() {
    const { gallery } = useParams()
    const [ images, setImages ] = useState([])

    const [ selectMode, setSelectMode ] = useState(false)
    const [ selectedImages, setSelectedImages ] = useState([])

    function handleSelect(id) {
        setSelectedImages(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    async function handleDeleteSelcted() {
        await Promise.all(selectedImages.map(id =>
            fetch(`${API}/images/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
        ))
        setSelectedImages([])
        setSelectMode(false)
        fetchImages()
    }

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

    async function handleUpload(files) {
        if (files.length === 0) return
        const formData = new FormData()
        files.forEach(file => formData.append('images', file))
        formData.append('gallery', gallery)
        await fetch(`${API}/images`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }, 
            body: formData
        })
        fetchImages()
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

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 }
        }),
        useSensor(TouchSensor, {
            activationConstraint: { delay: 250, tolerance: 5 }
        })
    ) 

    return (
        <div className="px-2">
            <Nav />
            <div className="flex gap-3 items-center justify-center mb-2 text-xs">
                <label className="cursor-pointer">
                    add images
                    <input  
                        type='file'
                        multiple
                        className="hidden"
                        onChange={(e) => {
                            const selected = Array.from(e.target.files)
                            handleUpload(selected)
                        }} 
                    />
                </label>
            
            {!selectMode && (
                <button onClick={() => setSelectMode(true)} className="cursor-pointer">select</button>
            )}

            {selectMode && (
                <>
                    <button onClick={() => { setSelectMode(false); setSelectedImages([]) }} className="cursor-pointer">cancel</button>
                    <button onClick={handleDeleteSelcted} className="cursor-pointer">delete ({selectedImages.length}) </button>
                </>
            )}

            </div>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={images.map(img => img.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-3 md:grid-cols-8 gap-1">
                        {images.map((img, index) => (
                            <SortableImage 
                                key={img.id} 
                                img={img} 
                                index={index}
                                onDelete={handleDelete}
                                selectMode={selectMode}
                                selected={selectedImages.includes(img.id)}
                                onSelect={handleSelect} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

export default Gallery;
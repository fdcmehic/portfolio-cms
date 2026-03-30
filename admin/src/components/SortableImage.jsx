import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function SortableImage({ img, onDelete }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id:img.id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }
    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <img src={img.url} className='w-full aspect-square object-cover' />
            <button onClick={() => onDelete(img.id)}>Delete</button>
        </div>
    )
}
export default SortableImage
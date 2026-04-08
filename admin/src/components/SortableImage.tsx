import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Image {
    id: number
    url: string
    gallery: string
    order_index: number
}

interface Props {
    img: Image
    index: number
    selectMode: boolean
    selected: boolean
    onSelect: (id: number) => void
}

function SortableImage({ img, index, selectMode, selected, onSelect }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
        id:img.id, 
        disabled: selectMode 
    })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition
    }
    return (
        <div 
            ref={setNodeRef} 
            style={style} 
            {...attributes} 
            {...listeners}
            className='relative'
            onClick={() => selectMode && onSelect(img.id)}
        >
            <img src={img.url} className='w-full aspect-square object-cover' />
            <span className='absolute top-1 left-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded'>
                {index + 1}
            </span>
            {selectMode && (
                <div className={`absolute inset-0 ${selected ? 'bg-white/30' : ''}`} />
            )}
        </div>
    )
}
export default SortableImage


export default {
    mounted(el, binding) {
        let isDragging = false
        let startX = 0
        let deltaX = 0
        if (!document) return
        let prevent = !!binding.modifiers.prevent
        const de = document.documentElement;

        const {
            onDragStart,
            onDragging,
            onDragEnd
        } = binding.value || {}


        const getPointer = (evt)  => {
            let pointer
            if (evt.touches && evt.touches[0]) {
                pointer = evt.touches[0]
            } else if (evt.changedTouches && evt.changedTouches[0]) {
                pointer = evt.changedTouches[0]
            } else {
                pointer = evt
            }
            return pointer
        }

        const onPointerDown = (event) => {
            prevent && event.preventDefault()
            isDragging = true
            startX = getPointer(event).clientX
            deltaX = 0

            onDragStart?.(startX)

            de.addEventListener('mousemove', onPointerMove)
            de.addEventListener('touchmove', onPointerMove)

            de.addEventListener('mouseup', onPointerUp)
            de.addEventListener('touchend', onPointerUp)
        }

        const onPointerMove = (event) => {
            prevent && event.preventDefault()
            if (!isDragging) return

            deltaX = getPointer(event).clientX - startX
            onDragging?.(deltaX)
        }

        const onPointerUp = (event) => {
            if (!isDragging) return

            prevent && event.preventDefault()

            isDragging = false

            onDragEnd?.(deltaX)

            deltaX = 0

            de.removeEventListener('mousemove', onPointerMove)
            de.removeEventListener('touchmove', onPointerMove)

            de.removeEventListener('mouseup', onPointerUp)
            de.removeEventListener('touchend', onPointerUp)
        }

        const onClick = (event) => {
            if(isDragging){
                event.preventDefault()
                event.stopPropagation()
                event.stopImmediatePropagation()
            }

        }

        el.addEventListener('mousedown', onPointerDown)
        el.addEventListener('touchstart', onPointerDown)
        el.addEventListener('click', onClick)

        el._dragCleanup = () => {
            el.removeEventListener('mousedown', onPointerDown)
            el.removeEventListener('touchstart', onPointerDown)
            el.removeEventListener('click', onClick)

            de.removeEventListener('mousemove', onPointerMove)
            de.removeEventListener('touchmove', onPointerMove)

            de.removeEventListener('mouseup', onPointerUp)
            de.removeEventListener('touchend', onPointerUp)
        }
    },

    unmounted(el) {
        el._dragCleanup?.()
    }
}

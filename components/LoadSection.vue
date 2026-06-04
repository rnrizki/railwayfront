<template>
    <div ref="el">
        <slot :renderArea="renderArea"></slot>
    </div>
</template>

<script setup>
    import {ref, onMounted} from 'vue'

    const props = defineProps({
        rootMargin: {
            type: Number,
            default: 0,
        },
    });

    const renderArea = ref(false)
    const el = ref(null)

    onMounted(() => {
        const observer = new IntersectionObserver(
            (entries, observer) => {
                entries.forEach((entry) => {
                    if (entry.intersectionRatio > 0) {
                        renderArea.value = true

                        observer.disconnect()
                    }
                })
            },
            {
                rootMargin: `${props.rootMargin}px`,
            }
        )

        if (el.value) {
            observer.observe(el.value)
        }
    })
</script>

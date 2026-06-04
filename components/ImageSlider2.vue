<template>
    <div
            class="glide"
            ref="glideEl"
    >
        <slot name="bullet-area">
            <ul
                    v-if="bullets"
                    class="glide-bullets"
                    data-glide-el="controls[nav]"
            >
                <li
                        v-for="index in imageCount"
                        :key="index"
                        :data-glide-dir="`=${index - 1}`"
                />
            </ul>
        </slot>
        <div
                data-glide-el="controls"
                class="glide-nav"
        >
            <button
                    aria-label="prev"
                    class="prev-btn"
                    data-glide-dir="<"
            >
                <i class="m-0 icon arrow-left"
                />
            </button>
            <button
                    class="next-btn"
                    aria-label="next"
                    data-glide-dir=">"
            >
                <i class="m-0 icon arrow-right"
                />
            </button>
        </div>
        <div
                data-glide-el="track"
                class="glide__track"
        >
            <ul class="glide__slides"
            >
                <slot name="content"
                />
            </ul>
        </div>
    </div>
</template>

<script setup>
    import Glide from '@glidejs/glide'
    import {onMounted, defineProps, nextTick, defineEmits, toRefs} from "vue";


    const props = defineProps({
        activeSlide: { type: Number, default: 0 },
        imageCount: { type: Number, default: 0 },
        perView: { type: Number, default: 1 },
        responsive: { type: Array, default: [1, 1, 1, 1, 1] },
        gap: { type: Number, default: 1 },
        loop:  { type: Boolean, default: false },
        bullets:  { type: Boolean, default: false },
        autoplay:  { type: Number, default: 0 },
        lazyImage: { type: Boolean, default: false },
    })

    const emit = defineEmits(['glide', 'loaded', 'change'])
    const {activeSlide, imageCount, perView, responsive, gap, loop, bullets, autoplay, lazyImage} = toRefs(props)


    const sliderOnInit = (evt) => {
        emit('glide', evt)
    }

    const sliderOnLoaded = (evt) => {
        emit('loaded', evt)
    }

    const sliderOnChange = (evt) => {
        emit('change', evt)
    }

    const glideEl = ref(null)
    let glide = null

    const changeSlide = (index) => {
        glide.go(`=${index}`)
    }


    const sliderInit = async () => {
        glide = new Glide(glideEl.value, {
            startAt: activeSlide.value,
            perView: perView.value,
            autoplay: autoplay.value,
            gap: gap.value,
            perTouch: 3,
            perSwipe: 3,
            touchRatio: 1,
            bound: true,
            rewind: loop.value,
            breakpoints: {
                1200: {
                    perView: responsive.value[0]
                },
                992: {
                    perView: responsive.value[1]
                },
                768: {
                    perView: responsive.value[2]
                },
                576: {
                    perView: responsive.value[3],
                    gap: 10
                },
                360: {
                    perView: responsive.value[4],
                    gap: 10
                }
            }
        })


        if (!bullets.value) {

            await nextTick()
            const step = perView.value
            glide.on('run.before', (evt) => {

                evt.steps = 7

                //evt.steps = step
            })

        } else if (lazyImage.value) {
            await nextTick()
            glide.on('run.before', (evt) => {



                if (imageCount.value - 1 >= glide.index) {

                    //FOR ARROW CLICKS
                    //FOR BULLETS CLICKS
                    sliderOnChange(evt.direction === '=' ? {index: evt.steps - 1, direction: 1} :
                        {index: glide.index, direction: (evt.direction === '>') ? 1 : -1})

                }
            })

        }


        glide.on('mount.after', () => {
            setTimeout(() => {
                sliderOnLoaded(glide.index)
            }, 50)
        })


        glide.mount()
        sliderOnInit(glide)

    }


    onMounted(async () => {
        await nextTick()
        await sliderInit()
    })
</script>


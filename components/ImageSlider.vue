<template>
    <div class="embla glide slider-wrapper" >
        <div class="embla__viewport"  ref="emblaRef">
            <ul class="embla__container">
                <slot name="content"/>
            </ul>
        </div>

        <div class="embla__buttons glide-nav">
            <button @click="scrollPrev" class="prev-btn" :class="!activation.prev && 'disabled'"><i class="m-0 icon arrow-left"></i></button>
            <button @click="scrollNext" class="next-btn" :class="!activation.next && 'disabled'"><i class="m-0 icon arrow-right"></i></button>
        </div>


        <div v-if="bullets" class="embla-thumbs thumb-wrapper">

            <slot name="title"></slot>

            <div class="embla-thumbs__viewport" ref="emblaThumbRef">
                <div class="embla-thumbs__container flex start wrap">
                    <slot name="bullet-area"></slot>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
    import { defineProps, defineEmits, toRefs} from "vue";
    import emblaCarouselVue from "embla-carousel-vue";

    const props = defineProps({
        activeSlide: { type: Number, default: 0 },
        imageCount: { type: Number, default: 0 },
        perView: { type: Number, default: 1 },
        gap: { type: Number, default: 1 },
        loop:  { type: Boolean, default: false },
        bullets:  { type: Boolean, default: false },
        autoplay:  { type: Number, default: 0 },
        lazy: { type: Boolean, default: false },
        addInitEvt: { type: Boolean, default: false },
    });

    const emit = defineEmits(['on-init', 'on-change']);
    const {activeSlide, imageCount, perView, gap, loop, bullets, autoplay, lazy, addInitEvt} = toRefs(props);

    const activation = ref({
        prev: false,
        next: false,
    });

    const options = { loop: loop.value, slidesToScroll: 'auto', duration: 15,containScroll: false};
    const [emblaRef, emblaApi] = emblaCarouselVue(options);
    const [emblaThumbRef, emblaThumbsApi] = emblaCarouselVue({
        containScroll: 'keepSnaps',
        dragFree: false
    });

    const onThumbClick = async  (index) => {
        if (!emblaApi.value) return;

        emblaApi.value.scrollTo(index);
    }

    defineExpose({ onThumbClick });

    const onActivation = () => {
        activation.value = {
            next: emblaApi?.value.canScrollNext(),
            prev: emblaApi?.value.canScrollPrev()
        }
    }

    const scrollNext = () => {
        emblaApi?.value.scrollNext();
        onActivation();
    }

    const scrollPrev = () => {
        emblaApi?.value.scrollPrev();
        onActivation();
    };

    const onSlidesInView = () => {
        const slidersInView = emblaApi.value.selectedScrollSnap();
        emit('on-change', {index: slidersInView})
    };

    watch(emblaApi, (api) => {
        if (!api) return;

        if(addInitEvt.value){
            emit('on-init', true)
        }
        onActivation()
        api.on('reInit', onActivation);

        if (lazy.value) {
            api.on('select', onSlidesInView);
        }

    }, { immediate: true });


</script>

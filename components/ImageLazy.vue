<template>
  <img
    ref="lazyImage"
    :data-src="lazySrc"
    :alt="alt"
    :title="title"
    height="50"
    width="50"
    :style="{opacity: imgOpacity}"
    @error="onError"
  >
</template>

<script setup>
  import {onMounted, onUnmounted, ref} from "vue";
  import {useUtils} from "~/composables/useUtils";

  const {alt, title, lazySrc} = defineProps({
    alt: {
      type: String,
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    lazySrc: {
      type: String,
      default: null,
    }
  });

  const imgOpacity = ref(0);
  const lazyImage = ref(null);
  let observer = null;

  onMounted(() => {
    observer = new IntersectionObserver(([entry]) => {

      if (entry.isIntersecting) {
        entry.target.setAttribute('src', lazySrc)

        observer.unobserve(entry.target);
      }
    }, {
      root: null,
      threshold: 0
    });

    observer.observe(lazyImage.value);

    lazyImage.value.addEventListener('load', () => {
      lazyImage.value?.removeAttribute('data-src');
      if(lazyImage.value) {
        imgOpacity.value = 1;
      }
    });
  });

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });

  const {getImageURL} = useUtils();

  const onError = (e) => {
    const img = e.target;
    if (img.dataset.errorHandled === 'true') return;
    img.dataset.errorHandled = 'true';
    observer?.unobserve(img);
    img.removeAttribute('data-src');
    img.src = getImageURL();
    imgOpacity.value = 1;
  }

</script>

<template>
  <div class="img-zoom-container">
    <!-- Main Image -->
    <div class="image-wrapper"
         @mouseover="calcDimension"
    >
      <img
        id="main-image"
        class="zoom-image"
        :src="image"
        @error="onErrorImage"
        ref="imageRef"
        @mousemove="zoom"
        @mouseleave="hideZoom"
      />
    </div>


    <transition name="zoom-fade">
      <div
        id="zoom-lens"
        class="img-lens"
        ref="lensRef"
        v-show="isZoomVisible"

      ></div>
    </transition>
    <transition name="zoom-fade">
      <!-- Zoomed Image -->
      <div
        id="zoom-result"
        class="img-zoom-result"
        ref="zoomRef"
        v-show="isZoomVisible"
      ></div>

    </transition>
  </div>
</template>
<script setup>
  import {ref} from "vue";
  import {onMounted} from "vue";
  import {useUtils} from "~/composables/useUtils";

  const props = defineProps({
    zoomImage: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    zoomFactor: {
      type: Number,
      default: 2, // Default zoom level
    },
  });


  const {zoomImage, image, zoomFactor} = toRefs(props);

  const imageRef = ref(null);
  const zoomRef = ref(null);
  const lensRef = ref(null);
  const isZoomVisible = ref(false);

  let img = null;
  let lens = null;
  let zoomBox = null;
  let lensSize = {x: 0, y: 0}
  let imgBoundingClientRect = null

  const checkImageLoaded = (imgSrc, callback) => {
    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      callback()
    };
    img.onerror = () => {
      console.error('Error loading image');
    };
  }

  const {getImageURL} = useUtils();

  const onErrorImage = (e) => {
    const img = e.target;
    if (img.dataset.errorHandled === 'true') return;
    img.dataset.errorHandled = 'true';
    img.src = getImageURL();
  };

  const calcDimension = () => {
    if (!img || !zoomBox) return;
    imgBoundingClientRect = img.getBoundingClientRect();

    const {width, height} = imgBoundingClientRect;

    lensSize = {x: width / zoomFactor.value, y: height / zoomFactor.value}

    zoomBox.style.height = `${height}px`
    zoomBox.style.width = `${width}px`

    lens.style.height = `${lensSize.y}px`
    lens.style.width = `${lensSize.x}px`
  }

  onMounted(() => {
    checkImageLoaded(image.value, () => {
      checkImageLoaded(zoomImage.value, () => {
        img = imageRef.value
        zoomBox = zoomRef.value;
        lens = lensRef.value;
        calcDimension()
      })
    })
  });

  const zoom = (event) => {
    if (!img || !zoomBox) return;

    isZoomVisible.value = true; // Show zoom box

    const {left, top, width, height} = imgBoundingClientRect;

    let x = event.clientX - left - lensSize.x / 2;
    let y = event.clientY - top - lensSize.y / 2;

    // Prevent lens from going outside image
    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > width - lensSize.x) x = width - lensSize.x;
    if (y > height - lensSize.y) y = height - lensSize.y;

    // Position the lens
    lens.style.left = `${x}px`;
    lens.style.top = `${y}px`;

    zoomBox.style.backgroundImage = `url('${zoomImage.value}')`;

    zoomBox.style.backgroundSize = `${width * zoomFactor.value}px ${height * zoomFactor.value}px`;
    zoomBox.style.backgroundPosition = `-${x * zoomFactor.value}px -${y * zoomFactor.value}px`;
  }

  const hideZoom = () => {
    isZoomVisible.value = false; // Hide zoom box when mouse leaves
  }

</script>

<template>
  <div
    :class="{stacked: stackedOnResponsive}"
    class="image-popup-wrapper"

  >
    <div class="layer" @click.prevent="closePopup"></div>

    <pop-over
      v-if="sharePopOver"
      :title="$t('socialShare.share')"
      :layer="true"
      @close="closePopOver"
      elem-id="social-pop-over"
    >
      <template
        v-slot:content
      >
        <social-share
          :product="product"
        />
      </template>
    </pop-over>
    <div
      class="image-popup"
    >
      <div
        v-if="stackedOnResponsive"
        class="image-popup-icons"
      >
        <button
          class="left-btn fav-btn"
          @click.prevent="addToWishlist"
        >
          <i
            :class="isFavourited"
            class="m-0 icon"
          />
        </button>
        <button
          class="right-btn share-btn"
          @click="toggleSharePop"
        >
          <i
            class="m-0 icon share-icon"
          />
        </button>
      </div>
      <button
        class="right-btn close-btn"
        @click="closePopup"
      >
        <i
          class="m-0 icon close-icon"
        />
      </button>



      <image-slider
        ref="productSliderRef"
        class="product-slider"
        :addInitEvt="true"
        :bullets="true"
        :lazy="true"
        :loop="true"
        @on-change="evt => onChange(evt, 'product-image')"
        @on-init="onFirstImageLoad(0, 'product-image')"
      >
        <template v-slot:content>

          <li v-for="(value, index) in imageList"
              :key="index"
          >
            <img :id="`product-image-${index}`"
                 class="full-dimen opacity-0"
                 :alt="$t('invent.si')"
                 :data-src="getImageURL(value.image)"
            >
          </li>

          <li v-if="video">
            <video preload="metadata" :src="getVideoURL(video)" controls></video>
          </li>
        </template>

        <template v-slot:title>
          <h5 class="title mb-10">{{title}}</h5>
        </template>

        <template v-slot:bullet-area>
          <div v-for="(value, index) in imageList"
               :key="index"
               class="embla-thumbs__slide"
               :class="index === activeSlide ? 'active': ''"
               @click="selectSliderImage(index)"
          >
            <img class="embla-thumbs__slide__number img-handler"
                 :alt="$t('invent.si')"
                 :src="getThumbImageURL(value.image)"
            >
          </div>


          <div v-if="videoThumb"
               class="embla-thumbs__slide video-thumb"
               :class="imageList.length === activeSlide ? 'active': ''"
               @click.prevent="selectSliderImage(imageList.length)"
          >

            <img class="embla-thumbs__slide__number img-handler"
                 :alt="$t('invent.si')"
                 :src="getImageURL(videoThumb)"
            >

            <span class="flex"><i class="icon play-icon"></i></span>
          </div>

        </template>

      </image-slider>


    </div>
  </div>
</template>

<script setup>

  import {ref} from "vue";
  import {useUserStore} from "../store/user";
  import {onMounted, onUnmounted} from "vue";
  import {useUtils} from "~/composables/useUtils";
  import {useSliderHelper} from "~/composables/useSliderHelper";


  const props = defineProps({
    product: {
      type: Object
    },
    title: {
      type: String,
      default: ''
    },
    activeId: {
      type: Number,
      default: 1
    },
    imageList: {
      type: Array,
      default() {
        return []
      }
    },
    noScroll: {
      type: Boolean,
      default: true
    },
    stackedOnResponsive: {
      type: Boolean,
      default: false
    },
  });
  const emit = defineEmits(['close-popup', 'add-to-wishlist']);

  const {product, imageList, noScroll} = toRefs(props);

  const productSliderRef = ref(null);

  const userStore = useUserStore();
  const {profile} = storeToRefs(userStore);

  const selectSliderImage = (index) => {
    if (productSliderRef.value) {
      productSliderRef.value.onThumbClick(index);
    }
  };

  defineExpose({selectSliderImage});

  const activeSlide = ref(0);
  const sharePopOver = ref(false);
  const sliderLoaded = ref(false);

  const {getThumbImageURL, getImageURL, getVideoURL} = useUtils();
  const {onChange, onFirstImageLoad} = useSliderHelper(activeSlide, sliderLoaded);

  const imageCount = computed(() => {
    if (video) {
      return imageList.value.length + 1
    }
    return imageList.value.length
  });

  const video = computed(() => {
    return product.value?.video || ''
  });

  const videoThumb = computed(() => {
    return product.value?.video_thumb || ''
  });

  const wishListed = computed(() => {
    return profile.value?.id && product.value?.wishlisted
  });

  const isFavourited = computed(() => {
    return wishListed.value ? 'heart-fill-icon' : 'heart-icon'
  });

  const toggleSharePop = () => {
    sharePopOver.value = !sharePopOver.value
  };

  const closePopOver = () => {
    sharePopOver.value = false
  };

  const addToWishlist = () => {
    emit('add-to-wishlist');
  }

  const closePopup = () => {
    emit('close-popup');
  };

  onMounted(() => {
    if (noScroll.value) {
      document.body.classList.add('no-scroll')
    }
  });

  onUnmounted(() => {
    document.body.classList.remove('no-scroll')
  });

</script>

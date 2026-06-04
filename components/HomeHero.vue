<template>
  <div class="main-slider">
    <div class="h-100"
         v-if="slider && slider.main.length"
    >
      <div class="slider-wrapper"
           :class="{'has-right': rightTop || rightBottom}"
      >
        <div class="left flow-hidden">
          <div class="pos-rel">
            <ImageSlider
              ref="homeHeroRef"
              class="opacity-0"
              :class="{'img-loading': sliderLoaded}"
              :image-count="slider.main.length"
              :bullets="true"
              :autoplay="6000"
              :loop="true"
              :addInitEvt="true"
              :lazy="true"
              @on-change="onChange"
              @on-init="onFirstImageLoad()"
            >
              <template v-slot:bullet-area>
                <span v-for="(_, index) in slider.main"
                      :key="index"
                      class="embla-thumbs__slide"
                      :class="index === activeSlide ? 'active': ''"
                      @click="selectSliderImage(index)"
                />
              </template>

              <template v-slot:content>
                <li v-for="(value, index) in slider.main"
                    :key="index"
                >
                  <nuxt-link
                    :to="sourceUrl(value)"
                    class="slider-content block"
                  >
                    <div class="slider-content-inner">
                      <img :id="`home-hero-${index}`"
                           class="full-dimen opacity-0"
                           :alt="$t('invent.si')"
                           :data-src="getImageURL(value.image)"
                           height="100"
                           width="100"
                      >
                    </div>
                  </nuxt-link>
                </li>
              </template>
            </ImageSlider>

            <img class="full-dimen placeholder-img"
                 :class="{'img-loaded': sliderLoaded}"
                 :alt="$t('invent.si')"
                 height="100"
                 width="100"
                 :src="getImageURL(slider.main[0].image)"
            >
          </div>

        </div><!--left-->
        <div v-if="rightTop || rightBottom"
             class="right"
        >
          <nuxt-link
            v-if="rightTop"
            :to="sourceUrl(rightTop)"
            class="img-wrap block"
          >

            <img :src="getImageURL(rightTop.image)"
                 height="100"
                 width="100"
                 :alt="$t('invent.si')"
            />
          </nuxt-link>

          <nuxt-link
            v-if="rightBottom"
            :to="sourceUrl(rightBottom)"
            class="img-wrap block"
          >
            <img :src="getImageURL(rightBottom.image)"
                 height="100"
                 width="100"
                 :alt="$t('invent.si')"
            />
          </nuxt-link>
        </div><!--right-->
      </div><!--main-slider-->
    </div>


    <div v-else class="shimmer-wrapper">
      <div class="shimmer"
           style="height: 100%"
      />
    </div>

  </div>
  <!--main-slider-->
</template>

<script setup>
  import {useSliderHelper} from "~/composables/useSliderHelper";
  import {useUtils} from "~/composables/useUtils";
  import {toRefs} from "vue";

  const props = defineProps({
    slider: {
      type: Object,
      default() {
        return null
      }
    }
  });

  const {slider} = toRefs(props);

  const activeSlide = ref(0);
  const sliderLoaded = ref(false);

  const homeHeroRef = ref(null);

  function selectSliderImage(index) {
    if (homeHeroRef.value) {
      homeHeroRef.value.onThumbClick(index);
    }
  }

  const {onChange, onFirstImageLoad} = useSliderHelper(activeSlide, sliderLoaded);

  const {getThumbImageURL, getImageURL, sourceUrl} = useUtils();

  const rightBottom = computed(() => {
    return slider.value?.right_bottom;
  });

  const rightTop = computed(() => {
    return slider.value?.right_top
  });
</script>




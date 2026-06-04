<template>
  <div class="p-tile">
    <nuxt-link
      :title="product.title"
      :to="productLink(product)"
      draggable="false"
      class="page-link"
      @click="goToProduct"
    >
      <span class="block img-wrapper">
        <span
          v-if="badge"
          class="badge"
        >
          {{ badge }}
        </span>

        <slot name="floating-btn">
          <button
            aria-label="submit"
            class="compare-btn"
            :title="$t('product.compare')"
            @click.prevent="addToCompare"
          >
            <i class="icon reload-icon"/>
          </button>
        </slot>

        <ImageLazy
          v-if="isLazyImage"
          :lazy-src="getThumbImageURL(product.image)"
          :title="product.title"
          :alt="product.title"
        />
        <img
          v-else
          :src="getThumbImageURL(product.image)"
          :title="product.title"
          :alt="product.title"
          height="50"
          width="50"
        >
      </span>

      <div class="item-title">
        <h5
          class="ellipsis"
          :class="`ellipsis-${titleEllipsis}`"
        >
          {{product.title}}
        </h5>
        <span class="block mtb-5">
          <rating-star
            :rating="parseFloat(product.rating)"
          />
          <span class="f-10 ml-5 semi-bold color-lite">
            {{ $t('productReview.reviews', {count: product.review_count}) }}</span>
        </span>
        <span class="flex wrap start">
          <h4 class="price-wrapper">
            <span
              class="strike-through"
              v-if="prevPrice"
            >
              <price-format
                :price="prevPrice"
              />
            </span>
            <span class="price">
              <price-format
                :price="currentPricing"
              />
            </span>
          </h4>
          <span
            v-if="reducedPercent"
            class="discount ml-10"
          >
            -{{reducedPercent}}%</span>
        </span>

      </div>
    </nuxt-link>
  </div>
</template>

<script setup>
  import {useCompareHelper} from "~/composables/useCompareHelper";
  import {toRefs} from "vue";
  import {usePriceHelper} from "~/composables/usePriceHelper";
  import {useUtils} from "~/composables/useUtils";
  import {defineEmits} from "vue";
  import {storeToRefs} from "pinia";
  import {useDetailStore} from "../store/detail";

  const props = defineProps({
    product: {
      type: Object,
      default() {
        return null
      },
    },
    isLazyImage: {
      type: Boolean,
      default: true
    },
    compared: {
      type: Boolean,
      default: false
    },
    titleEllipsis: {
      type: Number,
      default: 2
    },
  });

  const {product, isLazyImage, compared, titleEllipsis} = toRefs(props);

  const emit = defineEmits(['removed']);

  const {ajaxingCompare, addToCompare} = useCompareHelper({product, emit});

  defineExpose({ addToCompare });

  const { prevPrice, currentPricing, reducedPercent } = usePriceHelper({product});

  const {getThumbImageURL, productLink} = useUtils();

  const badge = computed(() => {
    return product.value?.badge;
  });

  const detailStore = useDetailStore();
  const {setProduct} = detailStore;

  const goToProduct = () => {
    setProduct(product.value);
  };

</script>


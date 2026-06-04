<template>
  <div class="p-tile">
    <nuxt-link
      :to="productLink(product)"
      class="block page-link"
      :title="product.title"
      @click="goToProduct"
    >
      <div class="img-wrapper">
        <span
          v-if="product.badge"
          class="badge"
        >
          {{ product.badge }}
        </span>


        <button
          aria-label="submit"
          class="compare-btn"
          :title="$t('product.compare')"
          @click.prevent="addToCompare"
        >
          <i class="icon reload-icon"/>
        </button>

        <ImageLazy
          :lazy-src="getThumbImageURL(product.image)"
          :title="product.title"
          :alt="product.title"
        />
      </div>

      <div class="flex wrap sided align-end item-title mt-0">
        <h4 class="price-wrapper">
          <span class="price">
            <price-format
              :price="reducedPrice"
            />
          </span>
          <span class="strike-through">
            <price-format
              :price="prevPrice"
            />
          </span>
        </h4>
        <h5
          class="color-primary"
        >
          <span class="discount">
            {{ $t('home.off', {percent: reducedPercent}) }}
          </span>
        </h5>

      </div>

    </nuxt-link>
  </div>
</template>

<script setup>
  import {useCommonStore} from "~/store/common";
  import {storeToRefs} from "pinia";
  import {useAuthStore} from "../store/auth";
  import {usePriceHelper} from "../composables/usePriceHelper";
  import {useCompareHelper} from "../composables/useCompareHelper";
  import {useUtils} from "../composables/useUtils";
  import {defineEmits} from "vue";
  import {useDetailStore} from "../store/detail";

  const props = defineProps({
    flashProduct: {
      type: Object,
      default() {
        return null
      },
    }
  });

  const {flashProduct} = toRefs(props);

  const commonStore = useCommonStore()
  const {currencyIcon, setting} = storeToRefs(commonStore)
  const {unAuthPost, setToastMessage, setToastError} = commonStore

  const authStore = useAuthStore();
  const {authenticated} = storeToRefs(authStore);

  const {getThumbImageURL, productLink } = useUtils();

  const product = computed(() => {
    return flashProduct.value?.product_data || flashProduct.value
  });

  const emit = defineEmits(['removed']);

  const { prevPrice, currentPricing } = usePriceHelper({product});

  const reducedPercent = computed(() => {
    return 100 - parseInt(((reducedPrice.value / prevPrice.value) * 100).toString())
  });

  const {ajaxingCompare, addToCompare} = useCompareHelper({product, emit});

  const reducedPrice = computed(() => {
    return flashProduct.value?.price
  });

  const quantity = computed(() => {
    return flashProduct.value?.quantity || 0
  });

  const sold = computed(() => {
    return flashProduct.value?.sold || 0
  });

  const detailStore = useDetailStore();
  const {setProduct} = detailStore;

  const goToProduct = () => {
    setProduct(product.value);
  };

</script>

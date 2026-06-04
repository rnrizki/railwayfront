<template>
  <nuxt-link
    :to="productLink(product)"
    class="page-link center-text item"
    @click="goToProduct"
  >
    <div class="item-inner">
      <div class="img-container">
        <div class="img-wrapper">
          <ImageLazy
            :lazy-src="getThumbImageURL(product.image)"
            :title="product.title"
            :alt="product.title"
            height="50"
            width="50"
          />
        </div>
      </div>
      <div class="title-wrap">
        <h5
          class="ellipsis ellipsis-1 mb-5"
        >
          {{product.title}}
        </h5>
        <div class="pos-rel flex start">
          <h5>
            <span
              class="strike-through"
              v-if="prevPrice"
            >
              <price-format
                :price="prevPrice"
              />
            </span>
            <span class="f-12">
              <price-format
                :price="currentPricing"
              />
            </span>
          </h5>
          <span v-if="reducedPercent"
                class="discount ml-10"
          >
            -{{reducedPercent}}%
          </span>

          <button
            aria-label="submit"
            class="compare-btn"
            :title="$t('product.compare')"
            @click.prevent="addToCompare"
          >
            <i class="icon reload-icon"/>
          </button>
        </div>
      </div>
    </div>

  </nuxt-link>
</template>

<script setup>
  import {defineEmits} from "vue";
  import {useUtils} from "../composables/useUtils";
  import {usePriceHelper} from "../composables/usePriceHelper";
  import {toRefs} from "vue";
  import {useCompareHelper} from "../composables/useCompareHelper";
  import {useDetailStore} from "../store/detail";

  const props = defineProps({
    product: {
      type: Object,
      default() {
        return null;
      }
    },
  });

  const {product} = toRefs(props);
  const emit = defineEmits(['removed']);

  const {prevPrice, currentPricing, reducedPercent} = usePriceHelper({product});
  const {getThumbImageURL, productLink} = useUtils();
  const {ajaxingCompare, addToCompare} = useCompareHelper({product, emit});

  const detailStore = useDetailStore();
  const {setProduct} = detailStore;

  const goToProduct = () => {
    setProduct(product.value);
  };

</script>

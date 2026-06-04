<template>
  <product-tile
    ref="tileRef"
    :product="product"
    @removed="$emit('removed')"
  >
    <template
      v-slot:floating-btn
    >
      <button
        class="compare-btn"
        aria-label="compare"
        :title="$t('product.removeCompare')"
        @click.prevent="removeFromCompared"
      >
        <i class="icon close-icon"/>
      </button>
    </template>
  </product-tile>
</template>

<script setup>
  const props = defineProps({
    product: {
      type: Object,
      default() {
        return null
      },
    },
  });

  const tileRef = ref(null);
  const removeFromCompared = () => {
    tileRef.value.addToCompare()
  };

</script>


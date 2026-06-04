<template>
  <div v-if="flashSales && flashSales.length">
    <div class="flash-slider">
      <div>
        <div
          class="area home-section"
          v-for="(flashSale, index) in flashSales"
          :key="index"
        >
          <div class="flex sided title ">
            <div class="flex gap-10">
              <h4>{{ flashSale.title }}</h4>
              <countdown
                :end-time="flashSale.end_time"
              />
            </div>
            <NuxtLink
              class="link"
              :to="`/flash-sale/${flashSale.id}`"
            >
              {{ $t('featured.showAll') }}
            </NuxtLink>
          </div>
          <div class="area-content">

            <image-slider
              v-if="flashSale.products && flashSale.products.length"
              :addInitEvt="true"
              :image-count="flashSale.products.length"
            >
              <template v-slot:content>
                <li
                  v-for="(value, index) in flashSale.products"
                  :key="index"
                  class="center-text"
                >
                  <flash-product-tile
                    :flash-product="value"
                  />
                </li>
              </template>
            </image-slider>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
  const props = defineProps({
    deactivate: {
      type: Boolean,
      default: true,
    },
    flashSales: {
      type: Array,
      default() {
        return []
      }
    }
  })

</script>

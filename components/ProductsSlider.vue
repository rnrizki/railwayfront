<template>

  <div
    v-if="productCollectionsCount"
    class="area home-section"
  >

    <div class="flex sided title">
      <h4>{{ title }}</h4>
      <nuxt-link
        class="link"
        :to="collectionLink(linkObj)"
      >
        {{ $t('featured.showAll') }}
      </nuxt-link>
    </div>


    <div class="area-content shimmer-wrapper">
      <image-slider>
        <template v-slot:content>

          <li
            v-for="(value, index) in itemList.products"
            :key="index"
          >
            <product-tile
              :product="value"
            />
          </li>
        </template>

      </image-slider>
    </div>
  </div>
</template>

<script setup>
  import {toRefs} from "vue";
  import {useUtils} from "~/composables/useUtils";

  const props = defineProps({
    collection: {
      type: Object
    },
  });

  const {collectionLink} = useUtils();

  const {collection} = toRefs(props);

  const productCollectionsCount = computed(() => {
    return itemList.value?.products?.length;
  });

  const itemList = computed(() => {
    return collection.value;
  });

  const  title = computed(() => {
    return collection.value?.title;
  });

  const  slug = computed(() => {
    return collection.value?.slug;
  });

  const  linkObj = computed(() => {
    return {
      slug: slug.value,
      title: title.value,
      id: collection.value?.id
    }
  });


</script>


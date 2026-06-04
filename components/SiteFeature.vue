<template>
  <div class="static-area">
    <div class="img-wrap">

      <ImageLazy
        :lazy-src="getImageURL(image)"
        :title="$t('date.fi')"
        :alt="$t('date.fi')"
      />
    </div>

    <div class="detail" v-html="detail"></div>
  </div>

</template>

<script setup>
  import {useUtils} from "~/composables/useUtils";

  const props = defineProps({
    siteFeature: {
      type: Object,
      default() {
        return null
      }
    }
  });

  const {siteFeature} = toRefs(props)
  const {getImageURL} = useUtils();

  const image = computed(() => {
    return siteFeature.value?.image
  });

  const detail = computed(() => {
    return siteFeature.value?.detail
  });

</script>


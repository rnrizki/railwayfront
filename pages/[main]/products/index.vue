<template>
  <listing-layout
    :result-title="slugText"
    :product-params="productParams"
  />
</template>

<script setup>
  import {useCommonStore} from "~/store/common";
  import {storeToRefs} from "pinia";
  import {useMetaData} from '~/composables/useMetaData'
  import {computed} from "vue";

  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  });

  const commonStore = useCommonStore();
  const {customScripts} = storeToRefs(commonStore);

  const {pageMeta, slugToText} = useMetaData();
  const {site_setting} = storeToRefs(commonStore);

  const route = useRoute();

  const slugText = computed(() => {
    return slugToText(route?.params?.main);
  });

  useHead(pageMeta({
    ...site_setting.value,
    ...{meta_title: `${slugToText(route?.params?.main)} | ${site_setting.value.meta_title}`}
  }));

  const productParams = computed(() => {
    return route.query;
  });

</script>

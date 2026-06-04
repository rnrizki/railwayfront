<template>
  <listing-layout/>
</template>

<script setup>

  import {useCommonStore} from "~/store/common";
  import {storeToRefs} from "pinia";
  import {useMetaData} from "~/composables/useMetaData";
  
  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  });

  const commonStore = useCommonStore();
  const {customScripts} = storeToRefs(commonStore);

  const route = useRoute();
  const {pageMeta, slugToText} = useMetaData();
  const {site_setting} = storeToRefs(commonStore);

  useHead(pageMeta({
    ...site_setting.value,
    ...{meta_title: `${slugToText(route?.params?.main)} | ${site_setting.value.meta_title}`}
  }));

</script>

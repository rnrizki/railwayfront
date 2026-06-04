<template>
  <category-listing-layout
    type="brand"
  />
</template>
<script setup>

  import {useCommonStore} from "~/store/common";
  import {useMetaData} from "../composables/useMetaData";
  
  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  });

  const commonStore = useCommonStore();
  const {customScripts, site_setting} = storeToRefs(commonStore);

  const {t} = useI18n();
  const {pageMeta} = useMetaData();

  useHead(pageMeta({
    ...site_setting.value,
    ...{meta_title: `${t('header.brands')} | ${site_setting.value.meta_title}`}
  }));

</script>

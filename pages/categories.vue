<template>
  <category-listing-layout
    :sub-categories-map="subCategoriesMap"
    type="subCategory"
  />
</template>
<script setup>
  import {useCommonStore} from "~/store/common";
  import {onMounted} from "vue";
  import {useMetaData} from "~/composables/useMetaData";

  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  });

  const commonStore = useCommonStore();
  const {subCategoriesMap, categories, customScripts, site_setting} = storeToRefs(commonStore);
  const {setSubCatMap, getRequest} = commonStore;

  const {t} = useI18n();
  const {pageMeta} = useMetaData();

  useHead(pageMeta({
    ...site_setting.value,
    ...{meta_title: `${t('header.categories')} | ${site_setting.value.meta_title}`}
  }));

  onMounted(() => {
    if(!subCategoriesMap.value){
      setSubCatMap(categories.value)
    }
  });

</script>

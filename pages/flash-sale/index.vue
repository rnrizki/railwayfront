<template>
  <div class="container-fluid mtb-20 mtb-sm-15">
    <flash-sale
      v-if="flashSales && flashSales.length"
      :flash-sales="flashSales"
    />
    <p v-else-if="flashSales" class="info-msg">
      {{ $t('listingLayout.noProductFound') }}
    </p>
  </div>
</template>

<script setup>

  import {useLanguageStore} from "~/store/language";
  import {useFlashSaleStore} from "~/store/flashSale";
  import {useHomeStore} from "~/store/home";
  import {useCommonStore} from "~/store/common";
  import {storeToRefs} from "pinia";
  import {useAsyncData} from "nuxt/app";
  import {useMetaData} from "../../composables/useMetaData";


  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  })

  const commonStore = useCommonStore()
  const {customScripts, site_setting} = storeToRefs(commonStore)

  const languageStore = useLanguageStore()
  const {langCode} = storeToRefs(languageStore)

  const homeStore = useHomeStore()
  const {flashSales} = storeToRefs(homeStore)
  const {setFlashSale} = homeStore

  const flashSaleStore = useFlashSaleStore()
  const {fetchFlashSales} = flashSaleStore;

  const {t} = useI18n();

  const {pageMeta} = useMetaData();
  useHead(pageMeta({...site_setting.value, ...{meta_title: `${t('header.categories')} | ${site_setting.value.meta_title}`}}));

  const {data, pending, error} = await useAsyncData(`flash-sale`, async () => {

    if(flashSales.value) {
      return true
    }

    const {unAuthGet} = commonStore

    const response = await unAuthGet({
      api: 'flashSales',
      params: '',
      lang: langCode.value
    });

    setFlashSale(response.data)
    return response.data;
  });

</script>

<template>
  <product-list
    ref="productListRef"
    :categories="allCategories"
    :result-title="sourceTitle || resultTitle"
    :product-params="productParams"
    :back-btn="false"
    :fetching-product-data="fetchingProductData"
  />

</template>

<script setup>

  import {useCommonStore} from "~/store/common";
  import {useListingStore} from "~/store/listing";
  import {useLanguageStore} from "~/store/language";
  import {storeToRefs} from "pinia";
  import {prepareGetUrl} from "~/utils/fetchClient";
  import {onMounted} from "vue";

  const props = defineProps({
    productParams: {
      type: Object,
      default() {
        return {}
      }
    },
    resultTitle: {
      type: String,
      default: ''
    },
  });

  const {productParams, resultTitle} = toRefs(props);

  const listingStore = useListingStore();
  const {brands, shippingRules, collections, allCategories} = storeToRefs(listingStore);
  const {emptyProducts, setProducts} = listingStore;

  const commonStore = useCommonStore();
  const {unAuthGet} = commonStore;

  const languageStore = useLanguageStore();
  const {langCode} = storeToRefs(languageStore);

  const route = useRoute();
  const sourceTitle = ref("");
  const products = ref(null);
  const fetchingProductData = ref(false);


  const productListRef = ref(null);
  const clearQuery = () => {
    productListRef.value.clearQuery()
  };

  const fetchingData = async () => {
    fetchingProductData.value = true

    const data = await unAuthGet({
      params: `?${prepareGetUrl({
        ...productParams.value,
        ...{
          sortby: route.query.sortby || '',
          shipping: route.query.shipping || '',
          brand: route.query.brand || '',
          collection: route.query.collection || '',
          rating: route.query.rating || 0,
          max: route.query?.max || 0,
          min: route.query?.min || 0,
          q: route.query.q || '',
          page: route.query.page || '',
          all_categories: !allCategories.value,
          sidebar_data: !brands.value || !shippingRules.value || !collections.value
        }
      })}`,
      lang: langCode.value,
      api: 'products'
    });

    sourceTitle.value = data.data?.source?.title
    setProducts(data)

    products.value = data.data.result
    fetchingProductData.value = false
  };

  watch(() => route.query, async () => {
    emptyProducts();
    await fetchingData();
  });

  onMounted(async () => {
    emptyProducts();
    await fetchingData();
  });

</script>

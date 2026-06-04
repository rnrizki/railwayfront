<template>
  <client-only>
    <div class="container-fluid ptb-20 ptb-sm-15 flow-hidden">
      <div class="mlr--5">
        <div
          v-if="fetchingCategoryData"
          class="tile-container category-tile-wrapper"
        >
          <div class="shimmer-wrapper">
            <tile-shimmer
              class="category-tile"
              v-for="index in shimmerCount.PRODUCT"
              :key="index"
            />
          </div>
        </div>
        <div
          v-else
          class="pos-rel"
        >
          <div
            v-if="!currentItems.length"
            class="info-msg"
          >
            {{ $t('categoryListingLayout.noItemFound') }}
          </div>
          <div
            v-else
          >
            <div
              v-if="isBrandPage"
              class="category-tile-wrapper"
            >
              <brand-tile
                class="category-tile"
                v-for="(value, index) in currentItems"
                :key="index"
                :brand="value"
              />
            </div>

            <div
              v-else
              class="category-tile-wrapper"
            >
              <sub-category-tile
                class="category-tile"
                v-for="(value, index) in currentItems"
                :key="index"
                :sub-category="value"
                :category="subCategoriesMap[value.id]"
              />
            </div>

          </div>
          <pagination
            class="mt-15 mt-sm-10"
            :total-page="totalPage"
          />
        </div>
      </div>
    </div>
  </client-only>
</template>
<script setup>

  import {useCommonStore} from "~/store/common";
  import {useCategoryStore} from "~/store/category";
  import {useLanguageStore} from "~/store/language";
  import {storeToRefs} from "pinia";
  import {prepareGetUrl} from "~/utils/fetchClient";
  import {onMounted} from "vue";
  import {useConstants} from "~/composables/useConstants";


  const props = defineProps({
    subCategoriesMap: {
      type: Object,
      default: null
    },
  });

  const languageStore = useLanguageStore();
  const {langCode} = storeToRefs(languageStore);


  const categoryStore = useCategoryStore();
  const {emptyCategories} = categoryStore;

  const commonStore = useCommonStore();
  const {getRequest} = commonStore;

  const result = ref(null);
  const fetchingCategoryData = ref(true);

  const route = useRoute();
  const {shimmerCount} = useConstants();

  const isBrandPage = computed(() => {
    return route?.name?.includes('brands')
  });

  const currentItems = computed(() => {
    return result.value?.data || []
  });

  const totalPage = computed(() => {
    return result.value?.last_page
  });

  const fetchingData = async () => {
    fetchingCategoryData.value = true

    let apiName = 'categories'
    if (isBrandPage.value) {
      apiName = 'brands'
    }

    const data = await getRequest({
      params: `?${prepareGetUrl({
        page: route.query?.page || 1
      })}`,
      lang: langCode.value,
      api: apiName
    })

    result.value = data?.data
    fetchingCategoryData.value = false
  };

  watch(() => route.query, async () => {
    emptyCategories();
    await fetchingData();
  });

  onMounted(async () => {
    emptyCategories();
    await fetchingData();
  });

</script>

<template>
  <div class="search-popup">
    <div class="sb popup-inner">
      <div class="pop-over-content ">

        <div class="spinner-wrapper flex layer-white"
             v-if="fetchingData"
        >
          <spinner :radius="100"/>
        </div>

        <div v-else-if="matchedResult">
          <div v-if="suggested.length"
               class="mb-15"
          >
            <h4 class="bold">
              {{ $t('searchPopup.suggestedSearch') }}
            </h4>
            <div class="search-section">
              <button
                v-for="(value, index) in suggested"
                :key="`sug-${index}`"
                @click.prevent="makeSearch(value.title)"
                class="item lite-btn"
                aria-label="search"
              >
                {{ value.title }}
              </button>
            </div>
            <!--search-section-->
          </div>
          <div v-if="categories.length"
               class="mb-15"
          >
            <h4 class="bold">
              {{ $t('searchPopup.categories') }}
            </h4>
            <div class="search-section category-wrapper">
              <nuxt-link
                v-for="(value, index) in categories"
                :key="`c-${index}`"
                :to="categoryLink(value)"
                class="page-link center-text item">

                <div class="img-wrapper">
                  <ImageLazy
                    :lazy-src="getImageURL(value.image)"
                    :title="value.title"
                    :alt="value.title"
                    height="50"
                    width="50"
                  />
                </div>
                <h5 class="title ellipsis ellipsis-1">
                  {{value.title}}
                </h5>
              </nuxt-link>
            </div>
            <!--search-section-->
          </div>
          <div v-if="products.length"
               class="mb-15"
          >
            <h4 class="bold">
              {{ $t('searchPopup.products') }}
            </h4>
            <div class="search-section search-product-tile">
              <SearchedProductTile
                v-for="(value, index) in products"
                :key="`prod-${index}`"
                :product="value"
              />
            </div><!--search-section-->
          </div>
        </div>

        <div v-else>
          <h4>{{ $t('searchPopup.nothingFound') }} "<span
            class="color-primary semi-bold">{{ props.searchedText }}</span>"</h4>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
  import {storeToRefs} from "pinia";
  import {useCommonStore} from "../store/common";
  import debounce from "debounce";
  import {prepareGetUrl} from "../utils/fetchClient";
  import {onMounted} from "vue";
  import {useUtils} from "~/composables/useUtils";
  import {useLanguageStore} from "../store/language";
  import {useListingStore} from "../store/listing";

  const emit = defineEmits(['close']);

  const props = defineProps({
    searchedText: {
      type: String,
      default: '',
    }
  });

  const languageStore = useLanguageStore();
  const {langCode} = storeToRefs(languageStore);

  const listingStore = useListingStore();
  const {searchedSuggestion, searched} = storeToRefs(listingStore);
  const {fetchSearchedSuggestion, updateSearch, setSearchedSuggestion} = listingStore;

  const commonStore = useCommonStore();
  const {unAuthGet} = commonStore;

  const router = useRoute();

  const makeSearch = (searched) => {
    if (searched !== searched.value) {
      router.push({path: 'search', query: {q: searched}});
      updateSearch(searched);
    }
  };

  const currentPricing = (value) => {
    return value?.offered ? value?.offered : value?.selling;
  };

  const handleSearch = debounce((value) => {
    if (value) {
      fetchData();
    } else {
      emit('close');
    }
  }, 700);

  watch(() => props.searchedText, (value) => {
    handleSearch(value);
  });

  const {getImageURL, categoryLink} = useUtils();


  const matchedResult = computed(() => {
    return products.value.length || suggested.value.length || categories.value.length;
  });

  const products = computed(() => {
    return searchedSuggestion.value?.product || [];
  });

  const suggested = computed(() => {
    return searchedSuggestion.value?.suggested || [];
  });

  const categories = computed(() => {
    return searchedSuggestion.value?.category || [];
  });

  const fetchingData = ref(false);

  const fetchData = async () => {
    fetchingData.value = true;

    const data = await unAuthGet({
      api: 'search',
      params: `?${prepareGetUrl({q: props.searchedText})}`,
      lang: langCode.value
    });
    fetchingData.value = false;
    setSearchedSuggestion(data.data);
  };

  onMounted(async () => {
    if (!searchedSuggestion.value) {
      await fetchData();
    }
  })
</script>

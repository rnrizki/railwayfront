<template>
  <div>
    <div class="detail-menu">
      <div class="container-fluid">
        <div class="list-heading flex sided">
          <p
            class="hide-sm"
          >
            {{ pageHeading }}
            <span
              v-if="resultTitle"
            >
              {{ $t('listingLayout.for') }}
              <span class="bold">
                "{{ resultTitle }}"
              </span>
            </span>
          </p>
          <div class="flex gap-5">
            <span class="hide-sm">
              {{ $t('listingLayout.sortBy') }}
            </span>
            <client-only>
              <dropdown
                class="sort-dropdown"
                :options="sortingOptions"
                :selected-key="sortby"
                @clicked="selectedSorting"
              />

              <button
                v-show="isXsDevice"
                class="filter-btn flex outline-btn plr-20"
                aria-label="submit"
                @click.prevent="openFilter"
              >
                {{ $t('listingLayout.filter') }}
                <span
                  v-if="filteredCount"
                >
                  ({{ filteredCount }})
                </span>
                <i
                  class="icon black"
                  :class="[{'arrow-up': filterPopup}, {'arrow-down': !filterPopup}]"
                />
              </button>
            </client-only>
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid mtb-20 mtb-sm-15">
      <div
        class="product-list"
      >
        <div
          v-show="filterPopup"
          class="left-area"
        >
          <div
            @click.prevent="closeFilter"
            class="layer"
          />
          <div class="sticky">
            <div class="close-btn-wrapper">
              <button
                aria-label="submit"
                @click.prevent="closeFilter"
              >
                {{ $t('listingLayout.close') }}
              </button>
            </div>
            <div class="sidebar">

              <button
                v-if="backBtn"
                @click.prevent="goingBack" class="flex start mb-15 clear-btn">
                <span class="flex">
                  <i class="dimen-16x icon double-arrow-left-icon mr-5 opacity-6"></i>
                  {{ $t('date.gb') }}
                </span>
              </button>

              <filter-category
                ref="filterCategory"
                :categories="categories"
                @going-next="goingNext"
              />
              <filter-price
                ref="filterPriceRef"
                @reset-route="changeRoute"
              />
              <filter-rating
                ref="filterRatingRef"
                @reset-route="changeRoute"
              />
              <filter-brand
                ref="filterBrand"
                :brands="brands"
                @reset-route="changeRoute"
              />
              <filter-collection
                ref="filterCollection"
                :collections="collections"
                @reset-route="changeRoute"
              />
              <filter-shipping
                ref="filterShippingRef"
                :shipping-rules="shippingRules"
                @reset-route="changeRoute"
              />
            </div>
          </div>
        </div>

        <div class="main-content">
          <breadcrumb
            v-if="hasBreadcrumb"
            class="mb-15 mt-0"
            :page="resultTitle"
            :slugs="slugs"
          />
          <div
            v-if="fetchingProductData"
            class="tile-container"
          >
            <div class="shimmer-wrapper">
              <tile-shimmer
                v-for="index in 20"
                :key="index"
              />
            </div>
          </div>
          <div
            class="pos-rel"
            v-else
          >
            <div
              v-if="(currentItems && !currentItems.length)"
              class="info-msg"
            >
              {{ $t('listingLayout.noProductFound') }}
            </div>

            <p class="hide block-sm ml-10 ml-xs-5 mb-10">{{ pageHeading }}
              <span v-if="resultTitle" class="bold">"{{ resultTitle }}"</span>
            </p>

            <div
              class="tile-container"
            >
              <product-tile
                v-for="(value, index) in currentItems"
                :key="index"
                :product="value"
              />
            </div>

            <pagination
              class="mt-30"
              ref="productPaginationRef"
              :total-page="totalPage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import {useCommonStore} from "~/store/common";
  import {useListingStore} from "~/store/listing";
  import {storeToRefs} from "pinia";
  import {computed, nextTick, onMounted, onUnmounted} from "vue";


  const props = defineProps({
    categories: {
      type: Array,
      default: []
    },
    backBtn: {
      type: Boolean,
      default: true
    },

    hasBreadcrumb: {
      type: Boolean,
      default: false
    },
    slugs: {
      type: Array,
      default() {
        return []
      }
    },
    fetchingProductData: {
      type: Boolean,
      default: false
    },
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

  const emit = defineEmits(['fetch-data']);

  const listingStore = useListingStore();
  const {products, brands, shippingRules, collections} = storeToRefs(listingStore);

  const commonStore = useCommonStore();
  const {currencyIcon, setting} = storeToRefs(commonStore);


  const route = useRoute();
  const router = useRouter();
  const {t} = useI18n();

  const loaded = ref(false);
  const filterPopup = ref(true);
  const sortingOptions = ref({
    featured: {title: t('featured.featured')},
    price_low_to_high: {title: t('listingLayout.priceLowToHigh')},
    price_high_to_low: {title: t('listingLayout.priceHighToLow')},
    avg_customer_review: {title: t('listingLayout.avgCustomerReview')},
  });
  const sortby = ref(route.query.sortby || '');

  const filteredCount = computed(() => {
    let count = 0
    if (route.query?.shipping) {
      count++
    }
    if (route.query?.rating) {
      count++
    }
    if (route.query?.min) {
      count++
    }
    if (route.query?.max) {
      count++
    }
    return count
  });

  const isXsDevice = computed(() => {
    return window && window.innerWidth <= 576;
  });

  const pageHeading = computed(() => {
    if (products.value) {
      if (products.value?.total > 0) {
        return t('listingLayout.paginationResult', {
          from: products.value?.from,
          to: products.value?.to,
          total: products.value?.total
        })
      }

      //return t('listingLayout.noProductFound')
    }
    return t('listingLayout.showingResult')
    //return `${t('listingLayout.loading')}...`
  });

  const currentItems = computed(() => {
    return products.value?.data || null
  });

  const totalPage = computed(() => {
    return products.value?.last_page
  });

  const goingBack = () => {
    router.go(-1)
  };

  const openFilter = () => {
    filterPopup.value = true
    document.body.classList.add('no-scroll')
  };

  const closeFilter = () => {
    filterPopup.value = false
    document.body.classList.remove('no-scroll')
  };

  const productPaginationRef = ref(null);

  const selectedSorting = (data) => {
    if (sortby.value) {
      let filtered = Object.assign({}, route.query);
      filtered = {...filtered, ...{sortby: data.key}};

      productPaginationRef.value?.resettingRoute(filtered);
    }
    sortby.value = data.key;
  };

  const clearSortby = () => {
    sortby.value = 'featured'
  };

  const filterPriceRef = ref(null);
  const filterShippingRef = ref(null);
  const filterRatingRef = ref(null);

  const clearQuery = () => {
    filterPriceRef.value?.clearPrice()
    filterShippingRef.value?.clearShipping()
    clearSortby()
    filterRatingRef.value?.clearRating()
    if (isXsDevice.value) {
      closeFilter();
    }
  };

  const changeRoute = (evt) => {
    productPaginationRef.value?.resettingRoute(evt);
    fetchingData();
  };

  const goingNext = (url) => {
    clearQuery()
    if (url === route.path) {
      router.push({
        query: {}
      })
      fetchingData();
    } else {
      router.push({path: url})
    }
  };

  const fetchingData = () => {
    // this.settingRouteParam()
    window.scrollTo(0, 0)
    //emit('fetch-data')
  };

  onUnmounted(() => {
    if (isXsDevice.value && filterPopup.value) {
      closeFilter()
    }
  });

  onMounted(async () => {
    await nextTick();
    if (isXsDevice.value && filterPopup.value) {
      closeFilter();
    }
  });
</script>

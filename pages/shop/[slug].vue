<template>
  <div>
    <div class="store-container mb-30 mb-sm-15">
      <div class="container-fluid">

        <div class="store-info">
          <div class="left-area">
            <div class="img-wrap">
              <img
                :src="getImageURL(store.image)"
                :alt="$t('footer.siteLogo')"
                height="50"
                width="50"
              >
            </div>

            <div class="store-content">

              <div>
                <h4 class="bold mb-5">{{store.name}}</h4>
                <h6 v-if="review" class="store-rating ls-0">{{$t('store.avgRating')}} <b
                  class="f-12 ml-5">{{formatPrice(review)}}</b></h6>
              </div>

              <div>
                <p class="opacity-8 f-9">{{$t('store.memberSince')}}</p>
                <h6 class=""><b>{{storeDate}}</b></h6>
              </div>

            </div>
          </div>
          <div class="right-area">

            <follow-btn
              class="primary-btn w-150x"
              :following="following"
              :store-id="storeId"
              @change-following="toggleFollowing"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="container-fluid mb-50 mb-sm-20">


      <div class="flex sided mb-15">
        <breadcrumb
          class="mtb-0"
          :page="store.name"
        />

        <sort-by @fetching-data="shortByChanged"/>
      </div>

      <div class="main-content">

        <div v-if="fetchingProductData"
             class="tile-container"
        >
          <div class="shimmer-wrapper">
            <tile-shimmer
              v-for="index in 20"
              :key="index"
            />
          </div>
        </div>
        <div class="pos-rel" v-else>

          <div v-if="(currentItems && !currentItems.length)"
               class="info-msg"
          >
            {{ $t('listingLayout.noProductFound') }}
          </div>

          <div class="tile-container">
            <product-tile
              v-for="(value, index) in currentItems"
              :key="index"
              :product="value"
            />
          </div>


          <div class="flow-hidden">
            <pagination
              class="mt-30"
              ref="productPagination"
              :total-page="totalPage"
            />
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import moment from "moment";
  import {useCommonStore} from "~/store/common";
  import {useLanguageStore} from "~/store/language";
  import {storeToRefs} from "pinia";
  import {prepareGetUrl} from "~/utils/fetchClient";
  import {useMetaData} from "~/composables/useMetaData";
  import {useAsyncData} from "nuxt/app";
  import {useUtils} from "~/composables/useUtils";

  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  });

  const commonStore = useCommonStore();
  const {ssrGetRequest, unAuthGet, postRequest} = commonStore;
  const {customScripts} = storeToRefs(commonStore);

  const languageStore = useLanguageStore();
  const {langCode} = storeToRefs(languageStore);

  const result = ref(null);
  const fetchingProductData = ref(false);

  const route = useRoute();

  const following = ref(false);
  const products = ref(null);

  const {data, pending, error} = await useAsyncData(`flash-sale`, async () => {
    const {unAuthGet} = commonStore

    const response = await unAuthGet({
      api: 'store',
      params: `?${prepareGetUrl({
        slug: route?.params?.slug,
        sortby: route.query.sortby || '',
        page: route.query.page || '',
        required_rating: true
      })}`,
      lang: langCode.value
    });

    return response.data;
  });

  const toggleFollowing = () => {
    following.value = !following.value
  };

  products.value = data.value?.result;

  const {pageMeta} = useMetaData();
  const {getImageURL, formatPrice} = useUtils();

  const {review, store} = data.value;
  following.value = data.value.following

  useHead(pageMeta({
    meta_title: store?.meta_title,
    meta_description: store?.meta_description,
    meta_keywords: store?.meta_keywords,
    image_url: getImageURL(store?.image)
  }));

  const storeId = computed(() => {
    return store?.id
  });

  const storeDate = computed(() => {
    return moment(store?.created_at).format('MMM DD, YYYY')
  });

  const currentItems = computed(() => {
    return products.value?.data || null
  });

  const totalPage = computed(() => {
    return products.value?.last_page
  });

  const productPagination = ref(null);

  const shortByChanged = (filtered) => {
    productPagination.value?.resettingRoute(filtered)
  };

  watch(() => route.query, async () => {
    await fetchingData();
  });


  const fetchingData = async () => {
    fetchingProductData.value = true;

    const data = await unAuthGet({
      params: `?${prepareGetUrl({
        slug: route?.params?.slug,
        sortby: route.query.sortby || '',
        page: route.query.page || ''
      })}`,
      api: 'store',
      lang: langCode.value,
    })

    products.value = data?.data?.result
    fetchingProductData.value = false
  };

</script>

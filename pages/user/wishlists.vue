<template>
  <account-layout
    active-route="wishlists"
    @clicked-wishlists="loadData"
    class="flow-hidden"
  >
    <template v-slot:rightArea>

      <transition name="fade" mode="out-in">
        <div
          class="spinner-wrapper flex"
          v-if="fetchingWishlistData"
        >
          <spinner
            :radius="100"
          />
        </div>
      </transition>

      <div v-if="currentWishLists && !currentWishLists.length"
           class="info-msg"
      >
        {{ $t('wishlist.noWishlist') }}
      </div>

      <div
        v-else
        class="area"
      >
        <div class="area-content">
          <div class="tile-container">
            <div class="shimmer-wrapper pt-15" v-if="fetchingWishlistData">
              <tile-shimmer
                v-for="index in 8"
                :key="index"
              />
            </div>
            <template v-else>
              <product-tile
                v-for="(value, index) in currentWishLists"
                :key="index"
                :product="value.product"
              />
            </template>
          </div>
        </div>
      </div>

      <pagination
        class="mt-20 mt-sm-15"
        ref="wishlistPaginationRef"
        :total-page="totalPage"
      />

    </template>
  </account-layout>
</template>

<script setup>

  import {useCommonStore} from "~/store/common";
  import {useLanguageStore} from "~/store/language";

  definePageMeta({
    middleware: ['common-middleware', 'auth'],
    layout: 'default',
  });

  const commonStore = useCommonStore();
  const {getRequest} = commonStore;
  const {customScripts, site_setting} = storeToRefs(commonStore);

  const {pageMeta} = useMetaData();
  useHead(pageMeta(site_setting.value));

  const languageStore = useLanguageStore();
  const {langCode} = storeToRefs(languageStore);

  const allWishlist = ref(null);
  const fetchingWishlistData = ref(false);

  const route = useRoute();

  const totalPage = computed(() => {
    return allWishlist.value?.last_page;
  });

  const currentWishLists = computed(() => {
    return allWishlist.value?.data;
  });

  const wishlistPaginationRef = ref(null);

  const loadData = async () => {
    wishlistPaginationRef.value.routeParam()
  };

  const {getTimeZone} = useUtils();

  const fetchingData = async () => {
    fetchingWishlistData.value = true

    const data = await getRequest({
      params: `?${prepareGetUrl({
        time_zone: getTimeZone(),
        order_by: route.query.orderBy || 'created_at',
        type: route.query.orderByType || 'desc',
        page: route.query.page || 1,
        q: route.query.q || null
      })}`,
      api: 'userWishlistAll',
      lang: langCode.value,
    })

    if (data?.status === 200) {
      allWishlist.value = data.data;
    }

    fetchingWishlistData.value = false
  };

  watch(() => route.query, async () => {
    await fetchingData();
  });

  onMounted(async () => {
    await fetchingData();
  });

</script>

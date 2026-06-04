<template>
  <account-layout
    active-route="following"
    @clicked-compared="loadData"
    class="flow-hidden"
  >
    <template v-slot:rightArea>

      <transition name="fade" mode="out-in">
        <div
          class="spinner-wrapper flex"
          v-if="fetchingAjaxData"
        >
          <spinner
            :radius="100"
          />
        </div>
      </transition>

      <div
        v-if="currentList && !currentList.length"
        class="info-msg"
      >
        {{ $t('store.noData') }}
      </div>

      <div
        v-else
        class="area"
      >
        <div class="area-content user-following">
          <div class="tile-container">

            <store-tile
              v-for="(value, index) in currentList"
              :key="`store-tile-${index}`"
              :store="value.store"
              @removed="removedSuccessfully"
            >
              <template v-slot:followBtn>
                <follow-btn
                  color="primary"
                  class="visit-btn"
                  :following="true"
                  :store-id="value.store.id"
                  @change-following="removedSuccessfully"
                />
              </template>
            </store-tile>
          </div>
        </div>
      </div>

      <pagination
        class="mt-20 mt-sm-15"
        ref="followingPaginationRef"
        :total-page="totalPage"
      />

    </template>
  </account-layout>
</template>

<script setup>

  import {useCommonStore} from "~/store/common";
  import {prepareGetUrl} from "~/utils/fetchClient";
  import {useMetaData} from "~/composables/useMetaData";
  import {onMounted} from "vue";

  definePageMeta({
    middleware: ['common-middleware', 'auth'],
    layout: 'default',
  });

  const commonStore = useCommonStore()
  const {getRequest} = commonStore
  const {customScripts, site_setting} = storeToRefs(commonStore)

  const {pageMeta} = useMetaData();
  useHead(pageMeta(site_setting.value));

  const fetchingAjaxData = ref(false);
  const result = ref(null);

  const totalPage = computed(() => {
    return result.value?.last_page
  });

  const currentList = computed(() => {
    return result.value?.data
  });

  const removedSuccessfully = async () => {
    await fetchingData()
  };

  const followingPaginationRef = ref(null);

  const loadData = () => {
    followingPaginationRef.value.routeParam()
  };


  const route = useRoute();
  const {getTimeZone} = useUtils();

  const fetchingData = async () => {
    fetchingAjaxData.value = true

    const data = await getRequest({
      params: `?${prepareGetUrl({
        time_zone: getTimeZone(),
        order_by: route.query.orderBy || 'created_at',
        type: route.query.orderByType || 'desc',
        page: route.query.page || 1,
        q: route.query.q || null
      })}`,
      api: 'followingListAll'
    })

    if (data?.status === 200) {
      result.value = data.data
    }
    fetchingAjaxData.value = false
  };

  watch(() => route.query, async () => {
    await fetchingData();
  });

  onMounted(async () => {
    await fetchingData()
  });
</script>

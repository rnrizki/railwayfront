<template>
  <account-layout
    active-route="compared"
    @clicked-compared="loadData"
    class="flow-hidden"
  >
    <template v-slot:rightArea>

      <transition name="fade" mode="out-in">
        <div
          class="spinner-wrapper flex"
          v-if="fetchingComparedData"
        >
          <spinner
            :radius="100"
          />
        </div>
      </transition>


      <div
        v-if="currentCompared && !currentCompared.length"
        class="info-msg"
      >
        {{ $t('compared.noData') }}
      </div>

      <div
        v-else
        class="area"
      >
        <div class="area-content">
          <div class="tile-container">
            <div
              class="shimmer-wrapper pt-15"
              v-if="fetchingComparedData"
            >
              <tile-shimmer
                v-for="index in 8"
                :key="index"
              />
            </div>
            <template v-else>
              <compared-tile
                v-for="(value, index) in currentCompared"
                :key="index"
                :product="value.product"
                @removed="removedSuccessfully"
              />
            </template>
          </div>
        </div>
      </div>

      <pagination
        class="mt-20 mt-sm-15"
        ref="comparedPagination"
        :total-page="totalPage"
      />

    </template>
  </account-layout>
</template>

<script setup>

  import {useCommonStore} from "~/store/common";
  import {useLanguageStore} from "~/store/language";
  import {storeToRefs} from "pinia";
  import {prepareGetUrl} from "~/utils/fetchClient";
  import {useMetaData} from "~/composables/useMetaData";
  import {onMounted} from "vue";

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

  const fetchingComparedData = ref(false);
  const allCompared = ref(null);

  const totalPage = computed(() => {
    return allCompared.value?.last_page;
  });

  const currentCompared = computed(() => {
    return allCompared.value?.data;
  });

  const removedSuccessfully = async () => {
    await fetchingData();
  };

  const comparedPagination = ref(null);

  const loadData = async () => {
    comparedPagination.value.routeParam();
  };

  const route = useRoute();
  const {getTimeZone} = useUtils();
  const fetchingData = async () => {
    fetchingComparedData.value = true;

    const data = await getRequest({
      params: `?${prepareGetUrl({
        time_zone: getTimeZone(),
        order_by: route.query.orderBy || 'created_at',
        type: route.query.orderByType || 'desc',
        page: route.query.page || 1,
        q: route.query.q || null
      })}`,
      api: 'compareListAll',
      lang: langCode.value,
    });

    if (data?.status === 200) {
      allCompared.value = data.data;
    }
    fetchingComparedData.value = false;
  };

  watch(() => route.query, async () => {
    await fetchingData();
  });

  onMounted(async () => {
    await fetchingData();
  });
</script>

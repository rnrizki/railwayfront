<template>

  <div class="vouchers-wrapper">
    <transition name="fade" mode="out-in">
      <div
        class="spinner-wrapper flex"
        v-if="fetchingVoucherData"
      >
        <spinner
          :radius="100"
        />
      </div>
    </transition>
    <div
      v-if="voucherList && !voucherList.length"
      class="info-msg"
    >
      {{ $t('vouchers.noVoucher') }}
    </div>

    <div class="flex wrap start align-start">
      <div
        class="card p-15 pt-10 pb-5 mb-15"
        v-for="(value, index) in voucherList"
        :key="index"
      >
        <div class="flex sided gap-15">
          <h5 class="semi-bold mx-w-400x mb-5">
            {{ value.title }}
          </h5>
          <h4 class="semi-bold mb-5">
            {{ getPriceType(value) }}
          </h4>
        </div>
        <div class="flex sided f-9">
          <h6 class="semi-bold voucher mb-5">{{ value.code }}</h6>
          <button
            aria-label="submit"
            @click.prevent="copyTpClipboard(value)"
            class="lite-btn mb-5"
          >
            {{ copiedVouchedId === value.id ? $t('filter.copied') : $t('filter.copy') }}
          </button>
        </div>

        <div class="flex sided f-9 gap-15">
          <p class="mb-5 color-lite">
            <span class=" mr-5">
              {{ $t('vouchers.minSpend') }}
            </span>
            <b>
              <price-format
                :price="value.min_spend"
              />
            </b>
          </p>
          <p class="f-9 mb-5 color-danger">
            <span class="mr-5">
              {{ $t('vouchers.valid') }}
            </span>
            {{ value.end_time }}
          </p>
        </div>
      </div>
    </div>
    <div class="flow-hidden">
      <pagination
        ref="voucherPagination"
        :total-page="totalPage"
        :page="currentPage"
        :changing-route="changingRoute"
      />
    </div>
  </div>

</template>

<script setup>

  import {useUserStore} from "~/store/user";
  import {useCommonStore} from "~/store/common";
  import {useLanguageStore} from "~/store/language";
  import {storeToRefs} from "pinia";
  import {prepareGetUrl} from "~/utils/fetchClient";
  import {onMounted} from "vue";
  import {useProductHelper} from "../composables/useProductHelper";

  const props = defineProps({
    changingRoute: {
      type: Boolean,
      default: true
    }
  });

  const userStore = useUserStore()
  const {vouchers} = storeToRefs(userStore)
  const {setVouchers} = userStore

  const languageStore = useLanguageStore()
  const {langCode} = storeToRefs(languageStore)

  const commonStore = useCommonStore()
  const {currencyIcon, setting} = storeToRefs(commonStore)
  const {getRequest} = commonStore;

  const fetchingVoucherData = ref(false);
  const copiedVouchedId = ref('');

  const route = useRoute();
  const {getPriceType} = useProductHelper();

  const currencyPosition = computed(() => {
    return setting.value.currency_position;
  });

  const currentPage = computed(() => {
    return vouchers.value?.current_page
  });

  const totalPage = computed(() => {
    return vouchers.value?.last_page
  });

  const voucherList = computed(() => {
    return vouchers.value?.data
  });

  const copyTpClipboard = (value) => {
    navigator.clipboard.writeText(value.code)
    copiedVouchedId.value = value.id
  };


  const {getTimeZone} = useUtils();

  const fetchingData = async () => {
    fetchingVoucherData.value = true

    const data = await getRequest({
      api: 'userVouchers',
      params: `?${prepareGetUrl({
        time_zone: getTimeZone(),
        order_by: route.query.orderBy || 'created_at',
        type: route.query.orderByType || 'desc',
        page: route.query.page || 1,
        q: route.query.q || null
      })}`,
      lang: langCode.value,
    })
    if (data?.status === 201) {
      showError({
        statusCode: 400,
        message: data.data?.form[0]
      })
    } else {
      setVouchers(data.data);
    }

    fetchingVoucherData.value = false
  };

  watch(() => route.query, async () => {
    await fetchingData();
  });

  onMounted(async () => {
    if (!vouchers.value) {
      await fetchingData()
    }
  });
</script>


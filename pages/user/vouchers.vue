<template>
  <client-only>
  <account-layout
    @clicked-vouchers="loadData"
    active-route="vouchers"
    class="mb-5"
  >
    <template v-slot:rightArea>
      <vouchers
        ref="voucherPaginationRef"
      />
    </template>
  </account-layout>
  </client-only>
</template>

<script setup>

  import {useUserStore} from "~/store/user";
  import {useCommonStore} from "~/store/common";
  import {useMetaData} from "~/composables/useMetaData";
  import {onMounted} from "vue";

  definePageMeta({
    middleware: ['common-middleware', 'auth'],
    layout: 'default',
  })

  const userStore = useUserStore()
  const {emptyVoucher} = userStore

  const commonStore = useCommonStore()
  const {currencyIcon, setting, customScripts, site_setting} = storeToRefs(commonStore)

  const {pageMeta} = useMetaData();
  useHead(pageMeta(site_setting.value));

  const voucherPaginationRef = ref(null);

  const loadData = () => {
    voucherPaginationRef.loadData();
  };

  onMounted(() => {
    emptyVoucher();
  });
</script>

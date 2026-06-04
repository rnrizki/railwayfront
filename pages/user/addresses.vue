<template>
  <account-layout
    active-route="addresses"
    @clicked-addresses="loadData"
    class="mb-5"
  >
    <template v-slot:rightArea>
      <div>
        <transition
          name="fade"
          mode="out-in"
        >
          <address-popup
            v-if="showAddressPopup"
            :address="editingAddress"
            @close="closingPopup"
          />
        </transition>
        <button
          aria-label="submit"
          class="primary-btn plr-20 mb-15"
          @click.prevent="adding"
        >
          {{ $t('addresses.addAddress') }}
        </button>
        <user-address
          ref="userAddressRef"
          @editing="editing"
        />
      </div>
    </template>
  </account-layout>
</template>
<script setup>

  import {useCommonStore} from "~/store/common";
  import {useMetaData} from "~/composables/useMetaData";

  definePageMeta({
    middleware: ['common-middleware', 'auth'],
    layout: 'default',
  });

  const commonStore = useCommonStore()
  const {currencyIcon, setting, customScripts, site_setting} = storeToRefs(commonStore)
  const {fetchLocation, setToastMessage, setToastError, postRequest, getRequest} = commonStore

  const {pageMeta} = useMetaData();
  useHead(pageMeta(site_setting.value));

  const userAddressRef = ref(null);

  const editingAddress = ref(null);
  const showAddressPopup = ref(false);

  const loadData = () => {
    userAddressRef.value.loadData();
  };

  const closingPopup = () => {
    showAddressPopup.value = false
  };
  const adding = () => {
    showAddressPopup.value = true
    editingAddress.value = null
  };
  const editing = (value) => {
    editingAddress.value = value;
    showAddressPopup.value = true
  };
</script>

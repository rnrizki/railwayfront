<template>
  <div>
    <transition name="fade" mode="out-in">
      <div
        class="spinner-wrapper flex"
        v-if="fetchingAddressData"
      >
        <spinner
          :radius="100"
        />
      </div>
    </transition>

    <div
      v-if="!hasAddress"
      class="info-msg mb-20"
    >
      {{ $t('userAddress.noAddress') }}
    </div>

    <div class="flex gap-20 align-initial wrap start" v-if="hasRadio">
      <label
        v-for="(value, key) in currentAddresses"
        :key="key"
        class="card p-15 address-card"
        :class="{active: selectedAddress === key}"
      >
        <input
          type="radio"
          name="user_address"
          :value="key"
          v-model="selectedAddress"
        />
        <span class="flex gap-10 mb-10 align-initial sided address-title">
          <span class="block bold">{{value.name}}</span>
          <span class="flex gap-10">
            <ajax-button
              class="outline-btn plr-10"
              :type="'button'"
              :text="$t('userAddress.edit')"
              color="primary"
              @clicked="$emit('editing', value)"
            />
            <ajax-button
              class="outline-btn plr-10"
              :type="'button'"
              :fetching-data="ajaxDeleting === value.id"
              :loading-text="$t('userAddress.deleting')"
              :text="$t('userAddress.delete')"
              color="primary"
              @clicked="deleteAddress(value)"
            />
          </span>
        </span>

        <span v-html="formatAddress(value)"/>
        <span class="block mt-5">tel: {{value.phone}}</span>
      </label>

      <button
        class="address-btn card" type="button"
        @click.prevent="$emit('add-address')"
      >
        <span class="icon-wrap mb-10">
          <i
            class="icon plus-icon"
          />
        </span>

        {{ $t('addresses.addAddress') }}
      </button>

    </div>

    <div v-else class="flex wrap start align-initial gap-10">
      <div
        class="card p-20  mx-w-400x address-card"
        v-for="(value, index) in currentAddresses"
        :key="index"
      >
        <span class="flex gap-10 sided mb-10 address-title">

          <span class="bold block">{{value.name}}</span>

          <span class="flex gap-10">
            <ajax-button
              class="outline-btn plr-10"
              :type="'button'"
              :text="$t('userAddress.edit')"
              color="primary"
              @clicked="$emit('editing', value)"
            />
            <ajax-button
              class="outline-btn plr-10"
              :type="'button'"
              :fetching-data="ajaxDeleting === value.id"
              :loading-text="$t('userAddress.deleting')"
              :text="$t('userAddress.delete')"
              color="primary"
              @clicked="deleteAddress(value)"
            />
          </span>
        </span>

        <span v-html="formatAddress(value)"/>
        <span class="block mt-5">tel: {{value.phone}}</span>

      </div>
    </div>
    <pagination
      ref="addressPaginationRef"
      :total-page="totalPage"
    />
  </div>
</template>

<script setup>

  import {useResourceStore} from "~/store/resource";
  import {useUserStore} from "~/store/user";
  import {useLanguageStore} from "~/store/language";
  import {useCommonStore} from "~/store/common";
  import {storeToRefs} from "pinia";
  import {onMounted, toRefs} from "vue";
  import {useAddressHelper} from "../composables/useAddressHelper";

  const props = defineProps({
    hasRadio: {
      type: Boolean,
      default: false
    }
  });

  const {hasRadio} = toRefs(props)

  const emit = defineEmits(['selected-address']);

  const languageStore = useLanguageStore();
  const {langCode} = storeToRefs(languageStore);

  const resourceStore = useResourceStore();
  const {countryList, phoneList} = storeToRefs(resourceStore);
  const {setCountryList, setPhoneList} = resourceStore;

  const userStore = useUserStore();
  const {getUserToken, setAllAddress} = userStore;
  const {allAddress} = storeToRefs(userStore);

  const commonStore = useCommonStore();
  const {setToastMessage, setToastError, unAuthGet, getRequest, postRequest, deleteRequest} = commonStore;


  const ajaxDeleting = ref(0);
  const selectedAddress = ref(-1);
  const selectedAddressObj = ref(null);

  const currentAddresses = computed(() => {
    return allAddress.value?.data || []
  });

  const route = useRoute();

  watch(selectedAddressObj, (value) => {
    if (currentAddresses.value.length) {

      const countryName = countryList.value[value.country]?.name
      const stateName = value.state ? countryList.value[value.country].states[value.state]?.name : ''
      emit('selected-address', {...value, ...{countryTitle: countryName, stateTitle: stateName}})
    } else {
      emit('selected-address', null)
    }
  });


  const fetchingAddressData = ref(false);

  watch(currentAddresses, (value) => {
    if (value.length) {
      if (hasRadio.value) {
        selectedAddress.value = 0
        selectedAddressObj.value = value[selectedAddress.value]
      }
    } else {

      selectedAddress.value = -1
      selectedAddressObj.value = null
    }
  });

  watch(selectedAddress, (value) => {
    selectedAddressObj.value = currentAddresses.value[value]
  });

  const hasAddress = computed(() => {
    if(allAddress.value?.data) {
      return !!allAddress.value?.data?.length;
    }
    return true;
  });

  const totalPage = computed(() => {
    return allAddress.value?.last_page
  });

 const addressPaginationRef = ref(null);

  const loadData = () => {
    addressPaginationRef.value?.routeParam();
  };

  const {fetchingData, formatAddress, deleteAddress} = useAddressHelper({ajaxDeleting});

  watch(() => route.query, async () => {
    await fetchingData();
  });

  onMounted(async () => {
    if (!countryList.value || !phoneList.value) {
      fetchingAddressData.value = true

      const {data} = await unAuthGet({
        params: '',
        lang: langCode.value,
        api: 'countriesPhones'
      })

      setCountryList(data?.countries)
      setPhoneList(data?.phones)
      fetchingAddressData.value = false
    }

    await fetchingData()
  })

</script>

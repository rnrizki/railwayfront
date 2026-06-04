<template>
  <div class="container-fluid mtb-20 mtb-sm-15">
    <div class="product-detail checkout-detail">

      <div
        class="detail-left p-20 p-sm-15 pb-10 area mr-20 mr-sm mb-sm-15 "
      >
        <h5 class="mb-20">{{ $t('date.dad') }}</h5>

        <div class="flex align-start gap-15 start">

          <transition
            name="fade"
            mode="out-in"
          >
            <div
              class="spinner-wrapper flex layer-white"
              v-if="loading"
            >
              <spinner
                :radius="100"
              />
            </div>
          </transition>

          <div class="address-wrapper">
            <user-address
              ref="shippingAddress"
              :has-radio="true"
              @editing="editAddress"
              @selected-address="setSelected"
              @add-address="setAddressPopup"
            />
          </div>

          <form class="address-form"
                @submit.prevent="savingAddressData"
          >
            <pop-over
              v-if="addressPopup"
              :title="$t('filter.address')"
              @close="closeAddressPopup"
              elem-id="shipping-address-pop-over"
              :layer="true"
            >
              <template
                v-slot:content
              >
                <div class="flex gap-15">
                  <div
                    v-if="countryList"
                    class="input-wrap flex-1"
                  >
                    <label>
                      {{ $t('addressPopup.country') }}
                    </label>
                    <dropdown
                      :selected-key="addressData.country"
                      :options="countryList"
                      :position-fixed="false"
                      key-name="name"
                      :searching="true"
                      @clicked="selectCountry"
                    />
                  </div>

                  <div
                    class="input-wrap flex-1"
                    :class="{invalid: !emailValid && hasAddressErrors}"
                  >
                    <label>
                      {{ $t('addressPopup.email') }}
                    </label>
                    <div class="icon-input">
                      <i
                        class="icon email-icon"
                      />
                      <input
                        type="text"
                        :placeholder="$t('contact.your', { type: $t('contact.email') })"
                        v-model.trim="addressData.email"
                      >
                    </div>

                    <span
                      class="error"
                      v-if="!addressData.email && hasAddressErrors"
                    >
                      {{ $t('addressPopup.isRequired', {type: $t('addressPopup.email') }) }}
                    </span>
                    <span
                      class="error"
                      v-else-if="invalidEmail && hasAddressErrors"
                    >
                      {{ $t('contact.invalidEmail') }}
                    </span>
                  </div>
                </div>


                <div class="flex block-xxs gap-15">
                  <div
                    class="input-wrap flex-1"
                    :class="{invalid: !addressData.name && hasAddressErrors}"
                  >
                    <label>
                      {{ $t('addressPopup.name') }}
                    </label>
                    <input
                      type="text"
                      v-model="addressData.name"
                    />
                    <span
                      class="error"
                      v-if="!addressData.name && hasAddressErrors"
                    >
                      {{ $t('addressPopup.isRequired', {type: $t('addressPopup.name')}) }}
                    </span>
                  </div>

                  <div
                    v-if="phoneList"
                    class="input-wrap flex-1"
                    :class="{invalid: !numberValid && hasAddressErrors}"
                  >
                    <label>
                      {{ $t('addressPopup.phone') }}
                    </label>
                    <div class="input-text">
                      <span>
                        {{ phoneList[addressData.country] }}
                      </span>
                      <input
                        type="text"
                        v-model="addressData.phone"
                      />
                    </div>
                    <span
                      class="error"
                      v-if="!addressData.phone && hasAddressErrors"
                    >
                      {{ $t('addressPopup.isRequired', {type: $t('addressPopup.phone')}) }}
                    </span>

                    <span
                      class="error"
                      v-else-if="invalidNumber && hasAddressErrors"
                    >
                      {{ $t('invent.in') }}
                    </span>
                  </div>
                </div>

                <div
                  class="input-wrap"
                  :class="{invalid: !addressData.address_1 && hasAddressErrors}"
                >
                  <label>
                    {{ $t('addressPopup.address') }}
                  </label>
                  <input
                    class="mb-10"
                    type="text"
                    v-model="addressData.address_1"
                    :placeholder="$t('addressPopup.addressPlaceholder')"
                  />
                  <input
                    type="text"
                    v-model="addressData.address_2"
                    :placeholder="$t('addressPopup.address2Placeholder')"
                  />
                  <span
                    class="error"
                    v-if="!addressData.address_1 && hasAddressErrors"
                  >
                    {{ $t('addressPopup.isRequired', {type: $t('addressPopup.address')}) }}
                  </span>
                </div>

                <div class="flex block-xxs gap-15 sided">
                  <div
                    class="input-wrap"
                    :class="{invalid: !addressData.city && hasAddressErrors}"
                  >
                    <label>
                      {{ $t('addressPopup.city') }}
                    </label>
                    <input
                      type="text"
                      v-model="addressData.city"
                    />
                    <span
                      class="error"
                      v-if="!addressData.city && hasAddressErrors"
                    >
                      {{ $t('addressPopup.isRequired', {type: $t('addressPopup.city')}) }}
                    </span>
                  </div>

                  <div
                    class="input-wrap"
                    :class="{invalid: !addressData.zip && hasAddressErrors}"
                  >
                    <label>
                      {{ $t('addressPopup.zipCode') }}
                    </label>
                    <input
                      type="text"
                      v-model="addressData.zip"
                    />
                    <span
                      class="error"
                      v-if="!addressData.zip && hasAddressErrors"
                    >
                      {{ $t('addressPopup.isRequired', {type: $t('addressPopup.zipCode')}) }}
                    </span>
                  </div>

                  <div
                    v-if="Object.keys(states).length"
                    class="input-wrap"
                  >
                    <label>
                      {{ $t('addressPopup.state') }}
                    </label>
                    <dropdown
                      :selected-key="addressData.state"
                      position="right"
                      :position-fixed="false"
                      :options="states"
                      key-name="name"
                      @clicked="selectState"
                      class="state-dd"
                    />
                  </div>
                </div>

                <div class="input-wrap mb-0">
                  <label>
                    {{ $t('shipping.instruction') }}
                  </label>
                  <textarea
                    v-model="addressData.delivery_instruction"
                  />
                </div>

              </template>

              <template v-slot:pop-footer>
                <div class="flex sided mlr-0 gap-10">
                  <button
                    aria-label="submit"
                    class="outline-btn plr-30 plr-sm-15"
                    @click.prevent="clearData"
                  >
                    {{ $t('addressPopup.cancel') }}
                  </button>
                  <ajax-button
                    class="primary-btn plr-30 plr-sm-15"
                    :fetching-data="submittingAddressData"
                    :loading-text="$t('addressPopup.saving')"
                    :text=" $t('addressPopup.thisAddress', {type: editing > 0 ? $t('addressPopup.update') : $t('addressPopup.save')})"
                  />
                </div>
              </template>

            </pop-over>

          </form>
        </div>


        <div v-if="selectedSippingPlace" class="pickup-addr">
          <h5 class="mt-30 mb-10">{{ $t('date.pa') }}</h5>
          <div class="flex start">
            <p class="success-msg" v-html="selectedSippingPlace"/>
          </div>

        </div>

        <div class="mt-30">
          <h5 class="mb-10">{{ $t('date.os') }}</h5>


          <cart-list
            :error-from-api="errorFromApi"
            :cart-products="checkedProduct"
            :cart-shipping="cartShipping"
            :checked="checked"
            :current-addresses="currentAddresses"
            :is-shipping="true"
            :address="selectedCurrentAddress"
            @shipping-changed="shippingChanged"
            @cart-changed="cartChanged"
            @current-shipping="currentShipping"
          />
        </div>
      </div>

      <checkout-right
        route-link="checkout"
        :checked-product="checkedProduct"
        :btn-text="$t('date.ptp')"
        @calculated-price="priceCalculated"
        :submitting="checkingOut"
        :disabled="fetchingAddressData || Object.keys(cartShipping).length === 0 || !selectedCurrentAddress"
        @go-next="goToCheckout"
      />
    </div>

  </div>
</template>
<script setup>

  import {useUserStore} from "~/store/user";
  import {useResourceStore} from "~/store/resource";
  import {useCommonStore} from "~/store/common";
  import {useLanguageStore} from "~/store/language";
  import {useCartStore} from "~/store/cart";
  import {onBeforeMount, onMounted} from "vue";
  import {useMetaData} from "~/composables/useMetaData";
  import {useAuthStore} from "~/store/auth";
  import {storeToRefs} from "pinia";
  import {useValidationHelper} from "../composables/useValidationHelper";
  import {useAddressHelper} from "../composables/useAddressHelper";


  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  });


  const languageStore = useLanguageStore()
  const {langCode} = storeToRefs(languageStore)

  const resourceStore = useResourceStore()
  const {countryList, phoneList} = storeToRefs(resourceStore)
  const {setCountryList, setPhoneList} = resourceStore

  const userStore = useUserStore()
  const {allAddress, profile} = storeToRefs(userStore)
  const {userAddressAction, getUserToken, updateAddress} = userStore

  const commonStore = useCommonStore()
  const {location, customScripts, setting, site_setting} = storeToRefs(commonStore)
  const {fetchLocation, setToastMessage, setToastError, unAuthGet, postRequest} = commonStore


  const {t} = useI18n();
  const {pageMeta} = useMetaData();
  useHead(pageMeta({...site_setting.value, ...{meta_title: `${t('header.shipping')} | ${site_setting.value.meta_title}`}}));


  const authStore = useAuthStore();
  const {authenticated} = storeToRefs(authStore);


  const cartStore = useCartStore()
  const {cartProducts} = storeToRefs(cartStore)
  const {getCartByUser, updateCartShipping} = cartStore

  onBeforeMount(() => {
    if (!setting.value?.guest_checkout) {
      if (!authenticated.value) {
        return navigateTo('/login');
      }
    }
  });


  const setAddressPopup = () => {
    addressPopup.value = true;
  };

  const setSelected = (event) => {
    selectedCurrentAddress.value = event;
  };

  const addressPopup = ref(false);
  const cartShipping = ref({});
  const checked = ref([]);
  const cartPrice = ref({
    totalItems: 0,
    totalPriceWithOffer: 0,
    totalPrice: 0,
  });
  const cartPopOver = ref(false);
  const editing = ref(0);
  const checkingOut = ref(false);
  const states = ref({});
  const loading = ref(false);
  const checkedProduct = ref([]);
  const singleShippingCart = ref({});
  const hasAddressErrors = ref(false);
  const addressData = ref({
    id: '',
    name: '',
    phone: '',
    city: '',
    country: '',
    state: '',
    zip: '',
    address_1: '',
    address_2: '',
    delivery_instruction: ''
  });
  const submittingAddressData = ref(false);
  const selectedCurrentAddress = ref(null);
  const errorFromApi = ref(null);

  const router = useRouter();


  watch(profile, (newVal) => {
    addressData.value.name = newVal.name
    addressData.value.email = newVal.email
  })

  watch(location, () => {
    settingCountry()
  })

  const {isValidNumber, isValidEmail} = useValidationHelper();

  const invalidNumber = computed(() => {
    return !isValidNumber(addressData.value?.phone)
  });


  const numberValid = computed(() => {
    return addressData.value.phone && !invalidNumber.value
  });

  const selectedSippingPlace = computed(() => {
    const cartShippingValues = Object.values(cartShipping.value)
    if (cartShippingValues?.length) {

      const sp = cartShippingValues[0]?.shipping_place

      if (!sp?.pickup_point) {
        return null
      }

      const addrArr = [sp.pickup_address_line_1, sp.pickup_address_line_2,
        sp.pickup_zip, sp.pickup_state, sp.pickup_city, sp.pickup_country]

      let addr = addrArr.filter(i => i).join(', ')

      if (sp.pickup_phone) {
        addr = `${addr}, <span class="block">${t('date.tl')}: ${sp.pickup_phone}</span>`
      }
      return addr
    }
    return null
  });

  const invalidEmail = computed(() => {
    return !isValidEmail(addressData.value.email)
  });

  const emailValid = computed(() => {
    return addressData.value.email && !invalidEmail.value
  });

  const currentAddresses = computed(() => {
    return allAddress.value?.data
  });


  const shippingAddress = ref(null);

  const initAddress = () => {
    addressData.value = {
      id: '',
      email: '',
      name: '',
      phone: '',
      city: '',
      country: '',
      state: '',
      zip: '',
      address_1: '',
      address_2: '',
      delivery_instruction: ''
    }
  };

  const loadData = () => {
    shippingAddress.loadData()
  };

  const cartChanged = (evt) => {
    singleShippingCart.value = []

    if (evt) {
      getCheckedProducts()
    }
  };

  const shippingChanged = (evt) => {
    cartShipping.value = evt
  };

  const currentShipping = ({cart, shipping}) => {
    if (cartShipping.value[cart] && shipping) {

      cartShipping.value[cart].shipping_place = shipping

      const sr = shipping?.shipping_rule

      if (sr?.single_price && (!singleShippingCart.value[sr?.id] || (singleShippingCart.value[sr?.id] === cart))) {

        singleShippingCart.value[sr?.id] = cart
        cartShipping.value[cart].single_shipping = true

      } else if (sr?.single_price && singleShippingCart.value[sr?.id]) {

        cartShipping.value[cart].single_shipping = false
      }
    }
  };

  const priceCalculated = (evt) => {
    cartPrice.value = evt
  };

  const getCheckedProducts = () => {
    checked.value = []
    checkedProduct.value = []

    cartProducts.value.forEach(obj => {
      if (parseInt(obj.selected) === 1) {
        checked.value.push(obj.id)

        checkedProduct.value.push(obj)

        const sp = obj?.shipping_place ?? ''

        cartShipping.value = {
          ...cartShipping.value,
          ...{
            [obj.id]: {
              cart: obj.id,
              shipping_place: sp,
              single_shipping: true,
              shipping_type: obj.shipping_type || 1,
            }
          }
        }
      }
    })
  };

  const goToCheckout = async () => {
    let unableToShip = false

    Object.values(cartShipping.value).forEach((obj) => {
      if (!obj.shipping_place) {
        unableToShip = true;
        return false;
      }
    })
    if (unableToShip) {
      setToastError(t('shipping.unableShipped'));
      return;
    }
    if (!checkedProduct.value.length) {
      cartPopOver.value = false;
      setToastError(t('shipping.noProductSelected'))
      router.push('/cart');
      return;
    }
    checkingOut.value = true
    const data = await updateCartShipping({
      cart: cartShipping.value,
      user_token: await getUserToken(),
      selected_address: selectedCurrentAddress.value?.id
    })
    checkingOut.value = false
    if (data?.status === 200) {
      cartPopOver.value = false
      router.push('/checkout')
    } else {
      if (data.data?.form) {
        setToastError(data.data?.form[0])
      } else if (data.data?.product) {
        errorFromApi.value = data.data?.product[0]
      }
    }
  };

  const goToShipping = () => {
    if (!currentAddresses.value.length) {
      setToastError(t('shipping.addAddress'))
      return
    }
    if (!checkedProduct.value.length) {
      cartPopOver.value = false
      setToastError(t('shipping.noProductSelected'))
      router.push({path: 'cart'})
      return
    }

    router.push({path: 'checkout'});
  };

  const clearData = () => {
    addressPopup.value = false
    initAddress()
    submittingAddressData.value = false
    editing.value = 0
    settingCountry()
    hasAddressErrors.value = false
  };


  const {addressAction, fetchingAddressData} = useAddressHelper({submittingAddressData, hasAddressErrors});

  const savingAddressData = async () => {
    if (numberValid.value && emailValid.value) {
      await addressAction(addressData)
      if (!hasAddressErrors.value) {
        clearData()
      }
    } else {
      hasAddressErrors.value = true
    }
  };
  const selectCountry = (evt) => {

    addressData.value = {...addressData.value, ...{country: evt.value?.code2}}
    states.value = evt.value?.states
    addressData.value.state = Object.keys(evt.value?.states).length ? Object.values(evt.value?.states)[0]?.code : ''
  };
  const selectState = (evt) => {
    addressData.value.state = evt.value.code
  };
  const settingCountry = () => {
    if (addressData.value) {
      if (location.value.countryCode && countryList.value[location.value.countryCode]) {
        addressData.value.country = location.value.countryCode
      } else {

        addressData.value.country = Object.keys(countryList.value)[0]
      }

      states.value = addressData.value?.country ? countryList.value[addressData.value.country].states : ''
      addressData.value.state = location.value.region
    }
  };
  const closeAddressPopup = () => {
    addressPopup.value = false
    addressData.value = {}

    addressData.value.country = location.value?.countryCode
    states.value = countryList.value[location.value?.countryCode]?.states
    addressData.value.state = location.value?.region
    addressData.value.email = profile.value?.email
  };
  const editAddress = (value) => {
    addressPopup.value = true
    editing.value = value.id
    addressData.value = Object.assign({}, value)
    states.value = countryList.value[value.country].states
  };


  onMounted(async () => {

    if (!countryList.value || !phoneList.value) {
      loading.value = true

      const {data} = await unAuthGet({
        params: '',
        lang: langCode.value,
        api: 'countriesPhones'
      })
      setCountryList(data?.countries)
      setPhoneList(data?.phones)
      loading.value = false
    }
    if (cartProducts.value.length === 0) {
      await getCartByUser({
        lang: langCode.value,
        params: {
          user_token: await getUserToken()
        }
      })
      getCheckedProducts()
    } else {
      if (cartProducts.value.length) {
        getCheckedProducts()
      }
    }

    initAddress()
    await nextTick()

    if (profile.value) {
      addressData.value.name = profile.value?.name
      addressData.value.email = profile.value?.email
    }

    if (!addressData.value.country) {
      settingCountry()
    }

  });

</script>

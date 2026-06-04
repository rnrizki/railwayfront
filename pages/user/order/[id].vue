<template>
  <client-only>
    <account-layout
      active-route="orders"
      class="mb-20 mb-sm-15"
    >
      <template v-slot:rightArea>

        <bank-popup
          v-if="verifyPayment"
          :order="ordered"
          @close="closeBankVerify"
        />

        <div
          class="spinner-wrapper flex"
          v-if="fetchingOrderData"
        >
          <spinner
            :radius="100"
          />
        </div>
        <p
          v-if="orderCancelled"
          class="info-msg danger-msg order-wrapper mb-15"
        >
          {{ $t('order.orderCancelled') }}
        </p>
        <p
          v-if="refunded"
          class="info-msg success-msg order-wrapper mb-15"
        >
          {{ $t('order.orderRefunded') }}
        </p>

        <div
          v-if="Object.keys(ordered).length"
          class="card"
        >
          <div class="p-20 p-sm-15 pt-20">
            <div class="flex f-reverse sided block-md mb-30 mb-sm-15">
              <ul class="mx-w-400x order-details mb-md-15">
                <li>
                  <span>
                    {{ $t('order.order') }}
                  </span>
                  <span>#{{ ordered.order }}</span>
                </li>
                <li>
                  <span>
                    {{ $t('order.deliveryStatus') }}
                  </span>
                  <span>{{ orderStatus[ordered.status].title }}</span>
                </li>
                <li>
                  <span>
                    {{ $t('order.orderMethod') }}
                  </span>
                  <span>{{ orderMethodsIn[ordered.order_method] }}</span>
                </li>
                <li>
                  <span>
                    {{ $t('order.orderDate') }}
                  </span>
                  <span>{{ ordered.created }}</span>
                </li>
                <li>
                  <span>
                    {{ $t('order.orderAmount') }}
                  </span>
                  <span>
                    <price-format
                      :price="totalPrice"
                    />
                  </span>
                </li>
                <li v-if="parseInt(ordered.order_method) === orderMethods.BANK">
                  <span>
                    {{ $t('date.ti') }}
                  </span>
                  <span>{{ ordered.trans_id }}</span>
                </li>
                <li>
                  <span>
                    {{ $t('order.paymentStatus') }}
                  </span>
                  <span>
                    {{ paymentStatus[ordered.payment_done] }}
                    <pay-button
                      v-if="!orderCancelled && parseInt(ordered.payment_done) === paymentStatusIn.UNPAID
                        && parseInt(ordered.order_method) !== orderMethods.CASH_ON_DELIVERY"
                      class="block mt-10"
                      :order="ordered"
                    />

                    <button
                      v-if="!orderCancelled && parseInt(ordered.payment_done) === paymentStatusIn.UNPAID
                        && parseInt(ordered.order_method) === orderMethods.BANK"
                      @click.prevent="toggleVerify"
                      class="link mt-15 bold f-9"
                    >
                      {{ $t('date.vp') }}
                    </button>
                  </span>
                </li>
              </ul>
              <p
                class="mx-w-400x lh-2 mr-15"
              >
                <b>{{ dataFromObject(ordered.address, 'name') }}</b>
                <span class="block">{{ generateAddress(ordered.address) }}</span>
                <span
                  v-if="orderEmail"
                  class="block">{{ $t('addressPopup.email') }}: {{ orderEmail }}
                </span>
                <span
                  class="block">{{ $t('addressPopup.phone') }}: {{ dataFromObject(ordered.address, 'phone', 'n/a')
                  }}</span>

                <span v-if="hasPickupPlace && pickupPlace">
                  <span class="bold">{{$t('date.pa') }}</span>
                  <span v-html="pickupPlace"></span>
                </span>
              </p>

            </div>

            <div class="mb-15">
              <ordered-status
                :status-of-order="ordered.status"
              />

            </div>
            <div class="flow-auto mtb-15">
              <table class="mn-w-600x no-bg w-100 mtb-0">

                <thead>
                <tr class="lite-bold">
                  <th>{{ $t('order.image') }}</th>
                  <th>{{ $t('orderCancelPopup.title') }}</th>
                  <th>{{ $t('order.shipTo') }}</th>
                  <th>{{ $t('order.deliveryFee') }}</th>
                  <th>{{ $t('detailRight.quantity') }}</th>
                  <th>{{ $t('cartProductTile.bundleOffer') }}</th>
                  <th>{{ $t('detailRight.price') }}</th>
                  <th>{{ $t('checkoutRight.total') }}</th>
                </tr>
                </thead>
                <tbody>
                <ordered-product
                  v-for="(value, index) in ordered.ordered_products"
                  :key="index"
                  :ordered="ordered"
                  :cart="value"
                  @rate-now="rateProductId = $event"
                />
                </tbody>
              </table><!--table-->
            </div>

            <div class="flex right no-space">
              <ul
                class="mx-w-400x order-details order-price"
              >
                <li>
                  <span>
                    {{ $t('order.subtotal') }}
                  </span>
                  <span class="semi-bold">
                    <price-format
                      :price="subtotalPrice"
                    />
                  </span>
                </li>
                <li>
                  <span>
                    {{ $t('order.shippingCost') }}
                  </span>
                  <span class="semi-bold">
                    <span
                      v-if="isFreeShipping"
                      class="color-free">
                      {{ $t('invent.fre') }}
                    </span>
                    <price-format
                      v-else
                      :price="shippingPrice"
                    />
                  </span>
                </li>
                <li v-if="bundleOffer">
                  <span>
                    {{ $t('cartProductTile.bundleOffer') }}
                  </span>
                  <span class="semi-bold">
                    <price-format
                      :price="bundleOffer"
                    />
                  </span>
                </li>
                <li v-if="voucherPrice">
                  <span>
                    {{ $t('checkoutRight.voucher') }}
                  </span>
                  <span class="semi-bold">
                    <price-format
                      :price="voucherPrice"
                    />
                  </span>
                </li>
                <li v-if="taxPrice">
                  <span>
                    {{ $t('cart.tax') }}
                  </span>
                  <span class="semi-bold">
                    <price-format
                      :price="taxPrice"
                    />
                  </span>
                </li>
                <li
                  class="mb-0"
                >
                  <span>
                    {{ $t('checkoutRight.total') }}
                  </span>
                  <span class="semi-bold f-11">
                    <price-format
                      :price="totalPrice"
                    />
                  </span>
                </li>
                <li
                  v-if="!isDelivered"
                  class="pb-0 mb-0 j-end mt-15 mt-sm"
                >
                  <button
                    aria-label="submit"
                    class="outline-btn plr-30 plr-sm-15"
                    @click="openCancelPopup"
                  >
                    {{ cancellationBtnText }}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <transition name="fade" mode="out-in">
          <order-cancel-popup
            v-if="cancelPopup"
            :order-id="orderId"
            @success="orderCancelling"
            @close="closeCancelPopup"
          />
        </transition>
        <transition name="fade" mode="out-in">
          <rate-popup
            v-if="rateProductId"
            :order-id="orderId"
            :product-id="rateProductId"
            @close="rateProductId = 0"
          />
        </transition>
      </template>
    </account-layout>
  </client-only>

</template>

<script setup>

  import {useCommonStore} from "~/store/common";
  import {useLanguageStore} from "~/store/language";
  import {useResourceStore} from "~/store/resource";
  import {useUserStore} from "~/store/user";
  import {useOrderStore} from "~/store/order";
  import {storeToRefs} from "pinia";
  import {computed, onBeforeMount} from "vue";
  import {useAuthStore} from "~/store/auth";
  import {useMetaData} from "~/composables/useMetaData";
  import {useConstants} from "~/composables/useConstants";
  import {onMounted} from "vue";
  import {useUtils} from "../../../composables/useUtils";

  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  });

  const userStore = useUserStore()
  const {getUserToken} = userStore

  const orderStore = useOrderStore()
  const {ordered} = storeToRefs(orderStore)
  const {updateOrderData} = orderStore

  const resourceStore = useResourceStore()
  const {countryList, phoneList} = storeToRefs(resourceStore)
  const {setCountryList, setPhoneList} = resourceStore

  const commonStore = useCommonStore();
  const {currencyIcon, setting, customScripts, paymentGateway, site_setting} = storeToRefs(commonStore)
  const {setToastMessage, setToastError, unAuthGet, postRequest, setPaymentGateway, getRequest} = commonStore

  const {pageMeta} = useMetaData();
  useHead(pageMeta(site_setting.value));

  const languageStore = useLanguageStore()
  const {langCode} = storeToRefs(languageStore);

  const authStore = useAuthStore();
  const {authenticated} = storeToRefs(authStore);

  const isLoggedIn = computed(() => {
    return authenticated.value || false
  });

  const toggleVerify = () => {
    verifyPayment.value = !verifyPayment.value;
  };

  const closeCancelPopup = () => {
    cancelPopup.value = false;
  };

  const openCancelPopup = () => {
    cancelPopup.value = true;
  };

  onBeforeMount(async () => {
    if (!setting.value?.guest_checkout) {
      if (!authenticated.value) {
        return navigateTo('/login');
      }
    }
    if (!paymentGateway.value) {
      const data = await getRequest({
        params: '',
        api: 'paymentGateway',
        lang: langCode.value
      });

      setPaymentGateway(data.data);
    }
  });


  const verifyPayment = ref(false);
  const cancelPopup = ref(false);
  const fetchingOrderData = ref(false);
  const rateProductId = ref(0);
  const route = useRoute();
  const {t} = useI18n();
  const {
    status, orderStatusIn, orderStatus, orderMethodsIn, orderMethods,
    paymentStatus, paymentStatusIn
  } = useConstants();

  const {getTimeZone, dataFromObject} = useUtils();

  const hasPickupPlace = computed(() => {
    const index = ordered.value?.ordered_products?.findIndex(i => {
      return parseInt(i.shipping_type) === 1
    });
    return !(index !== -1)
  });

  const pickupPlace = computed(() => {

    if (!ordered.value?.ordered_products?.length) {
      return null
    }

    const sp = ordered.value?.ordered_products[0]?.shipping_place

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
  });

  const isFreeShipping = computed(() => {
    return !(parseFloat(shippingPrice.value) > 0)
  });

  const orderEmail = computed(() => {
    return ordered.value?.user?.email
  });

  const cancellationBtnText = computed(() => {
    return orderCancelled.value ? t('order.cancellationMessage') : t('order.cancelOrder')
  });

  const isDelivered = computed(() => {
    return parseInt(ordered.value?.status) === orderStatusIn.DELIVERED
  });

  const refunded = computed(() => {
    return parseInt(ordered.value?.cancellation?.refunded) === status.PUBLIC || false
  });

  const orderCancelled = computed(() => {
    return parseInt(ordered.value.cancelled) === status.PUBLIC
  });

  const totalPrice = computed(() => {
    return ordered.value.calculated.total_price
  });

  const voucherPrice = computed(() => {
    return ordered.value.calculated.voucher_price
  });

  const bundleOffer = computed(() => {
    return ordered.value.calculated.bundle_offer
  });

  const shippingPrice = computed(() => {
    return ordered.value.calculated.shipping_price
  });

  const taxPrice = computed(() => {
    return ordered.value.calculated.tax
  });

  const subtotalPrice = computed(() => {
    return ordered.value.calculated.subtotal
  });

  const orderId = computed(() => {
    return parseInt(route.params.id)
  });


  const currentImage = (value) => {
    const invAttr = value?.updated_inventory?.inventory_attributes;

    if (invAttr?.length && invAttr[0]?.attribute_value) {

      const item = value?.product_images.find(i => {
        return i.attribute_value_id === invAttr[0]?.attribute_value.id
      })

      return item?.image?.image ?? value.product?.image

    }
    return value.product?.image;
  };

  const closeBankVerify = (evt) => {
    verifyPayment.value = false
    updateOrderData({trans_id: evt})
  };

  const orderCancelling = () => {
    cancelPopup.value = false
    fetchingData()
  };

  const generateAddress = (obj) => {
    if (!obj) {
      return ''
    }
    let addArr = []
    addArr.push(obj?.address_1 || '')
    if (obj?.address_2) {
      addArr.push(obj?.address_2)
    }
    addArr.push(obj?.city + '-' + obj?.zip)

    if (countryList.value[obj?.country]) {
      const country = countryList.value[obj?.country]

      if (country.states[obj?.state]) {
        addArr.push(country?.states[obj?.state]?.name)
      }
      addArr.push(country?.name)
    }
    ordered.value['formatted_address'] = addArr.join(', ')
    return ordered.value['formatted_address']
  };

  const generatingAttribute = (attr) => {
    return attr?.updated_inventory?.inventory_attributes?.map(i => {
      return [i?.attribute_value?.attribute?.title, i?.attribute_value?.title]
    })
  };

  const fetchingData = async () => {
    fetchingOrderData.value = true

    const data = await postRequest({
      api: 'orderByUser',
      params: {
        order_id: orderId.value,
        user_token: await getUserToken(),
        time_zone: getTimeZone()
      },
      lang: langCode.value
    });


    if (data?.status === 403 && !isLoggedIn.value) {
      return navigateTo('/login');
    }

    if (data?.status === 200) {
      updateOrderData(data.data);
    }

    fetchingOrderData.value = false
  };


  onMounted(async () => {
    if (!countryList.value || !phoneList.value) {
      fetchingOrderData.value = true

      const {data} = await unAuthGet({
        params: '',
        lang: langCode.value,
        api: 'countriesPhones'
      })

      setCountryList(data?.countries)
      setPhoneList(data?.phones)
      fetchingOrderData.value = false
    }

    await fetchingData()
  });
</script>

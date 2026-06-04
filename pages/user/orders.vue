<template>
  <client-only>
    <account-layout
      active-route="orders"
      @clicked-orders="loadData"
      class="mb-5"
    >
      <template v-slot:rightArea>
        <transition name="fade" mode="out-in">
          <rate-popup
            v-if="rateProductId"
            :order-id="rateOrderId"
            :product-id="rateProductId"
            @close="onRateClose"
          />
        </transition>
        <order-tabbing
          ref="orderTabRef"
        />
        <div class="spinner-wrapper flex layer-white"
             v-if="fetchingOrderData"
        >
          <spinner :radius="100"/>
        </div>
        <div v-else-if="currentOrders && !currentOrders.length"
             class="info-msg"
        >
          {{ $t('orders.noOrderYet') }}
        </div>
        <div v-else>
          <div
            v-for="(value, index) in currentOrders"
            :key="index"
            class="card mb-15"
          >
            <div class="flex sided b-b ptb-10 plr-20 plr-sm-15 block-xs">
              <div>
                <nuxt-link
                  :to="`/user/order/${value.id}`"
                  class="block"
                >
                  {{ $t('order.order') }}
                  <span class="link-color">
                    #{{ value.order }}
                  </span>
                </nuxt-link>
                <span class="color-lite f-9">{{ $t('filter.placed', {date: value.created}) }}</span>
              </div>

              <div>
                <nuxt-link
                  :to="`/user/order/${value.id}`"
                  class="link-color mt-xs-5"
                >
                  {{ $t('orders.manageOrder') }}
                </nuxt-link>
              </div>
            </div>

            <div v-for="(ordered, i) in value.ordered_products"
                 :key="i"
                 class="flex sided ptb-10 plr-20 plr-sm-15"
            >
              <div class="flex grow gap-15">
                <div class="w-80x">
                  <nuxt-link
                    :to="productLink(ordered.product)"
                    class="img-wrapper w-100"
                    @click="goToProduct(ordered.product)"
                  >
                    <ImageLazy
                      :lazy-src="getThumbImageURL(ordered.product.image)"
                      :title="ordered.product.title"
                      :alt="ordered.product.title"
                    />
                  </nuxt-link>
                </div>
                <div class="flex grow sided block-xs">
                  <div>
                    <h5>
                      <nuxt-link
                        :to="productLink(ordered.product)"
                        :title="ordered.product.title"
                        @click="goToProduct(ordered.product)"
                      >
                        {{ ordered.product.title }}
                      </nuxt-link>
                    </h5>
                    <button
                      v-if="!!!value.cancelled"
                      aria-label="submit"
                      class="link-color "
                      @click.prevent="rateNow(ordered)"
                    >
                      {{ $t('ratePopup.rateNow') }}
                    </button>
                  </div>

                  <div class="flex start">
                    <h5 class="mr-20 mr-sm-15">
                      <span class="color-lite f-9 mr-5">
                        {{ $t('orders.qty') }}
                      </span>
                      {{ ordered.quantity }}
                    </h5>

                    <h5 class="">
                      <span class="color-lite f-9 mr-5">
                        {{ $t('detailRight.price') }}
                      </span>

                      <price-format
                        :price="parseInt(ordered.selling)"
                      />

                    </h5>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex sided block-xs b-t ptb-10 plr-20 plr-sm-15 pos-rel">
              <p v-if="parseInt(dataFromObject(value, 'cancelled', 0)) === status.PUBLIC"
                 class="color-danger mr-15"
              >
                {{ $t('order.orderCancelled') }}
              </p>
              <p v-else
                 class="mr-15">
                <span class="color-lite f-8 mr-5">{{ $t('orders.shippingStatus') }}</span>
                <span class="">{{ orderStatus[value.status].title }}</span>
              </p>
              <div class="flex sided">
                <p>
                  <span class="color-lite f-8 mr-5">{{ $t('order.paymentStatus') }}</span>
                  <span class=" mr-5">{{ paymentStatus[value.payment_done] }}</span>
                </p>
                <pay-button
                  v-if="parseInt(dataFromObject(value, 'cancelled', 0)) !== status.PUBLIC
                    && parseInt(value.payment_done) === paymentStatusIn.UNPAID
                    && parseInt(value.order_method) !== orderMethods.CASH_ON_DELIVERY"
                  :order="value"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flow-hidden">
          <pagination
            v-if="!changedSelectedOrder"
            ref="orderPaginationRef"
            :total-page="totalPage"
          />
        </div>
      </template>
    </account-layout>
  </client-only>

</template>

<script setup>

  import {useUserStore} from "~/store/user";
  import {useOrderStore} from "~/store/order";
  import {useCommonStore} from "~/store/common";
  import {useLanguageStore} from "~/store/language";
  import {storeToRefs} from "pinia";
  import {onBeforeMount} from "vue";
  import {useAuthStore} from "~/store/auth";
  import {useMetaData} from "~/composables/useMetaData";
  import {onMounted} from "vue";
  import {useConstants} from "~/composables/useConstants";
  import {useDetailStore} from "../../store/detail";

  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  });

  const userStore = useUserStore();
  const {getUserToken} = userStore;

  const orderStore = useOrderStore();
  const {orderedList} = storeToRefs(orderStore);
  const {setOrderList} = orderStore;

  const commonStore = useCommonStore();
  const {currencyIcon, setting, customScripts, paymentGateway, site_setting} = storeToRefs(commonStore);
  const {postRequest, setPaymentGateway, getRequest} = commonStore;

  const {pageMeta} = useMetaData();
  useHead(pageMeta(site_setting.value));

  const languageStore = useLanguageStore();
  const {langCode} = storeToRefs(languageStore);

  const authStore = useAuthStore();
  const {authenticated} = storeToRefs(authStore);

  const fetchingOrderData = ref(false);
  const changedSelectedOrder = ref(false);
  const rateProductId = ref(0);
  const rateOrderId = ref(0);
  const route = useRoute();


  const detailStore = useDetailStore();
  const {setProduct} = detailStore;

  const goToProduct = (product) => {
    setProduct(product);
  };


  const onRateClose = () => {
    rateProductId.value = 0
  };

  const totalPage = computed(() => {
    return orderedList.value?.last_page;
  });

  const currentOrders = computed(() => {
    return orderedList.value?.data;
  });


  const generateParam = async () => {
    changedSelectedOrder.value = true;
    await fetchingData();
  };

  const rateNow = (ordered) => {
    rateProductId.value = ordered.product.id;
    rateOrderId.value = parseInt(ordered.order_id);
  };

  const orderPaginationRef = ref(null);
  const loadData = () => {
    orderPaginationRef.routeParam();
  };

  const orderTabRef = ref(null);

  const {getTimeZone, productLink, dataFromObject, getThumbImageURL} = useUtils();
  const {status, orderStatus, paymentStatus, paymentStatusIn, orderMethods} = useConstants();
  const {t} = useI18n();

  const fetchingData = async () => {
    fetchingOrderData.value = true
    const params = {
      ...{
        time_zone: getTimeZone(),
        order_by: route.query.orderBy || 'created_at',
        type: route.query.orderByType || 'desc',
        page: route.query.page || 1,
        user_token: await getUserToken(),
        q: route.query.q || null
      },
      ...orderTabRef.value?.generateParam()
    }

    const data = await postRequest({
      api: 'orderByUser',
      params,
      lang: langCode.value
    });

    if (data?.status === 200) {
      setOrderList(data.data);
    }

    changedSelectedOrder.value = false
    fetchingOrderData.value = false
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

  watch(() => route.query, async () => {
      await fetchingData()
      window.scrollTo(0, 0);
  });

  onMounted(async () => {
    await fetchingData()
    window.scrollTo(0, 0);
  });
</script>

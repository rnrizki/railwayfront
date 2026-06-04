<template>
  <client-only>
    <div class="container-fluid mtb-20 mtb-sm-15">
      <div class="product-detail checkout-detail">
        <div
          class="detail-left ptb-10 plr-20 plr-sm-15 mr-sm area mr-20 mb-sm-15"
        >
          <div class="b-b pb-10 mb-10 flex sided">
            <h5 class="bold">
              {{ $t('cart.shoppingCart') }}
            </h5>
            <p v-if="!checked.length">
              {{ $t('cart.noSelected') }}
              <button
                aria-label="submit"
                class="link ml-10 f-9"
                @click.prevent="selectAllItems"
              >
                {{ $t('cart.selectItems') }}
              </button>
            </p>
            <p v-else>
              <button
                aria-label="submit"
                class="link f-9"
                @click.prevent="deselectAllItems"
              >
                {{ $t('cart.deselectItems') }}
              </button>
            </p>
          </div>

          <cart-list
            :cart-products="cartProducts"
            :ajaxing="ajaxing"
            :checked="checked"
          />
          <div class="flex sided pb-5">
            <h5 class="price">
              {{ $t('cart.subtotal', { items: cartPrice.totalItems }) }}
            </h5>
            <h4 class="price">
              <price-format
                :price="cartPrice.totalPriceWithOffer"
              />
            </h4>
          </div>
        </div>

        <checkout-right
          :disabled="preventGoing"
          :checked-product="checkedProduct"
          @calculated-price="setCartPrice"
          @go-next="goToAddress"
        />


      </div>
    </div>
  </client-only>
</template>


<script setup>
  import {useUserStore} from "~/store/user";
  import {useCommonStore} from "~/store/common";
  import {useLanguageStore} from "~/store/language";
  import {useCartStore} from "~/store/cart";
  import {storeToRefs} from "pinia";
  import {onBeforeMount, onMounted} from "vue";
  import {useMetaData} from "~/composables/useMetaData";
  import {useAuthStore} from "~/store/auth";

  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  });

  const languageStore = useLanguageStore()
  const {langCode} = storeToRefs(languageStore)

  const cartStoreStore = useCartStore()
  const {cartProducts} = storeToRefs(cartStoreStore)
  const {getCartByUser, cartChanged} = cartStoreStore

  const userStore = useUserStore()
  const {getUserToken} = userStore
  const {profile} = storeToRefs(userStore);

  const commonStore = useCommonStore();
  const {currencyIcon, setting, customScripts, site_setting} = storeToRefs(commonStore);
  const {fetchLocation} = commonStore;

  const authStore = useAuthStore();
  const {authenticated} = storeToRefs(authStore);

  onBeforeMount(() => {
    if (!setting.value?.guest_checkout) {
      if (!authenticated.value) {
        return navigateTo('/login');
      }
    }
  });

  const {t} = useI18n();
  const {pageMeta} = useMetaData();

  useHead(pageMeta({
    ...site_setting.value,
    ...{meta_title: `${t('header.cart')} | ${site_setting.value.meta_title}`}
  }));

  const setCartPrice = (event) => {
    cartPrice.value = event
  };

  const preventGoing = ref(true);
  const checked = ref([]);
  const ajaxing = ref(false);

  const cartPrice = ref({
    totalItems: 0,
    totalPriceWithOffer: 0,
    totalPrice: 0,
  });

  const checkedProduct = computed(() => {
    checked.value = []
    let checkedP = []
    cartProducts.value.forEach(obj => {
      if (parseInt(obj.selected) === 1) {
        checked.value.push(obj.id)
        checkedP.push(obj)
      }
    })
    preventGoing.value = checkedP.length === 0
    return checkedP
  });

  const cartCount = computed(() => {
    return profile.value?.cart_count
  });

  const router = useRouter();

  const goToAddress = () => {
    router.push('/shipping')
  };

  const selectAllItems = async () => {
    checked.value = cartProducts.value.map(i => {
      return i.id
    });
    await cartChanged({
      payload: {
        checked: checked.value
      },
      lang: langCode.value
    })
    await cartChangedApi()
  };

  const deselectAllItems = async () => {
    checked.value = [];
    await cartChanged({
      payload: {
        checked: []
      },
      lang: langCode.value
    })
  };


  const cartChangedApi = async (bundleDeal = false) => {
    await cartChanged({
      payload: {
        checked: checked.value,
        isBundle: bundleDeal
      },
      lang: langCode.value
    })
  };

  const settingChecked = () => {
    checkedProduct.value = []
    checked.value = []

    cartProducts.value.forEach(obj => {
      if (parseInt(obj.selected) === 1) {
        checked.value.push(obj.id)
        checkedProduct.value.push(obj)
      }
    })
  };

  const fetchingData = async () => {
    ajaxing.value = true

    await getCartByUser({
      lang: langCode.value,
      params: {
        user_token: await getUserToken()
      }
    })

    ajaxing.value = false
  };

  onMounted(async () => {
    await fetchingData()
  });


</script>

<template>
  <div class="detail-right">
    <div class="sticky-right">
      <div class="content">
        <h2 class="price-wrapper mb-5">
          <span class="color-deep price">
            <price-format :price="productPrice"/>
          </span>
          <span class="strike-through f-7" v-if="prevPrice">
            <price-format :price="prevPrice"/>
          </span>
        </h2>
        <div>
          <span v-if="isFreeShipping"
                class="mr-5 block color-free"
          >
            {{ $t('invent.fs') }}
          </span>

          <span v-else class="mr-5 block">
            +
            <price-format :price="parseInt(shippingPrice)"/>
            {{ $t('detailRight.shippingFee') }}
          </span>
          <div class="pos-rel lh-30 z-7 inline ">
            <button
              class="semi-bold clear-height mt-10"
              aria-label="submit"
              @click.prevent="togglePricePopover"
              data-ignore="price-pop-over"
            >
              <span class="flex no-click">
                <span class="mt-2">{{ $t('detailRight.details') }}</span>
                <i class="icon black scale-8"
                   :class="[{'arrow-up': pricePopOver}, {'arrow-down': !pricePopOver}]"
                />
              </span>
            </button>
            <client-only>
              <pop-over
                v-if="pricePopOver"
                :title="$t('detailRight.shippingFeeDetails')"
                @close="closePricePopOver"
                :elem-id="'price-pop-over'"
                :layer="false"
              >
                <template v-slot:content>
                  <div class="flex sided">
                    <div>
                      <p>{{ $t('detailRight.price') }}</p>
                      <p>{{ $t('detailRight.shippingFee') }}</p>
                    </div>
                    <div class="right-text">
                      <p>
                        <price-format :price="toFixed(productPrice)"/>
                      </p>
                      <p>
                        <span v-if="isFreeShipping" class="color-free">
                          {{ $t('invent.fre') }}
                        </span>
                        <price-format v-else :price="toFixed(shippingPrice)"/>
                      </p>
                    </div>
                  </div>
                </template>
                <template v-slot:pop-footer>
                  <div class="flex sided">
                    <h5 class="semi-bold">{{ $t('checkoutRight.total') }}</h5>
                    <h5 class="semi-bold">
                      <price-format
                        :price="toFixed(totalPrice)"
                      />
                    </h5>
                  </div>
                </template>
              </pop-over>
            </client-only>
          </div>
        </div>


        <div class="start flex gap-10 mb-10 wrap">
          <span class="mt-5 mn-w-70x">
            {{ $t('detailRight.quantity') }}
          </span>

          <quantity-nav
            class="mt-5"
            :quantity="quantity"
            :product-inventory="productInventory"
            :max="maxQuantity"
            @value-changed="quantityChanged"
          />

          <p v-if="cartError.inventory"
             class="error mb-10"
          >
            {{cartError.inventory}}
          </p>
        </div>
        <div class="flex-sm mlr-sm--2-5">
          <ajax-button
            id="add-to-cart"
            class="w-100 w-sm-50 primary-btn mtb-10 mlr-sm-2-5"
            :disabled="disabled"
            type="button"
            :fetching-data="ajaxing"
            @clicked="addToCart"
            :loading-text="$t('detailRight.adding')"
            :text="$t('detailRight.addToCart')"
          />
          <ajax-button
            class="w-100 w-sm-50 outline-btn  mtb-10 mlr-sm-2-5"
            :disabled="disabled"
            type="button"
            color="primary"
            :fetching-data="buyingNow"
            @clicked="addToCart(true)"
            :loading-text="$t('detailRight.buyNow')"
            :text="$t('detailRight.buyNow')"
          />
        </div>

        <div class="pos-rel inline">
          <button
            class="clear-height ml--7-5 mtb-10 f-10 semi-bold flex color-deep"
            aria-label="submit"
            @click.prevent="toggleSecureTrans"
            data-ignore="secure-trans"
          >
            <i
              class="no-click icon lock-icon mr-5 opacity-35 dimen-20x"
            />
            {{ $t('detailRight.secureTransaction') }}
          </button>
          <pop-over
            :title="$t('detailRight.transactionIsSecured')"
            v-if="secureTrans"
            @close="closeSecureTrans"
            class="secure-trans"
            elem-id="secure-trans"
          >
            <template v-slot:content>
              <p class="mn-w-350x mn-w-sm-0">
                {{ $t('detailRight.secureTransaction') }}
                {{ $t('detailRight.secureTransactionMsg') }}
              </p>
            </template>
          </pop-over>
        </div>

        <client-only>
          <p class="f-9">
            {{ $t('detailRight.arrives') }} :
            <span class="color-lite semi-bold">
              {{arrivesAt}}
            </span>
          </p>
          <ajax-button
            class="mt-15 w-100 outline-btn hide-sm"
            type="button"
            color="primary"
            :fetching-data="ajaxingWishlist"
            @clicked="makeWishListed"
            :loading-text="!wishListed ? $t('detailRight.addingToWishlist') : $t('detailRight.removingFromWishlist')"
            :text="!wishListed ? $t('detailRight.addToWishlist') : $t('detailRight.removeFromWishlist')"
          />
        </client-only>
      </div>

      <client-only>
        <social-share
          class="hide-sm mb-15"
          :product="product"
        />
      </client-only>

      <store-tile
        class="mt-10"
        :store="product.store"
      />

    </div><!-- detail-right -->
  </div><!-- detail-right -->
</template>

<script setup>

  import moment from "moment";
  import {useCartHelper} from "~/composables/useCartHelper";
  import {usePriceHelper} from "~/composables/usePriceHelper";
  import {defineEmits, toRefs} from "vue";
  import {useCommonStore} from "../store/common";
  import {useUserStore} from "../store/user";
  import {useLanguageStore} from "../store/language";
  import {useCartStore} from "../store/cart";
  import {useAuthStore} from "../store/auth";

  const props = defineProps({
    disabled: {
      type: Boolean,
      default: false
    },
    product: {
      type: Object
    },
    productInventory: {
      type: Object
    }
  });

  const {disabled, product, productInventory} = toRefs(props);
  const emit = defineEmits(['cart-error']);

  const {wishListAction, addToCart, ajaxingWishlist, buyingNow, cartError, quantity, ajaxing, wishListed} =
    useCartHelper({product, productInventory, emit});

  defineExpose({ wishListAction });

  const {productPrice, prevPrice} = usePriceHelper({product, productInventory});

  const {t} = useI18n();

  const inventory = ref(null);
  const price = ref(0);
  const pricePopOver = ref(false);
  const secureTrans = ref(false);

  const commonStore = useCommonStore();
  const {currencyIcon, setting} = storeToRefs(commonStore);
  const {setToastMessage, setToastError, postRequest} = commonStore;

  const userStore = useUserStore();
  const {getUserToken} = userStore;

  const languageStore = useLanguageStore();
  const {langCode} = storeToRefs(languageStore);

  const cartStore = useCartStore();
  const {cartAction, buyNow} = cartStore;
  const {cartProducts} = storeToRefs(cartStore);

  const authStore = useAuthStore();
  const {authenticated} = storeToRefs(authStore);

  const makeWishListed = async () => {
    await wishListAction();
  };

  const maxQuantity = computed(() => {
    return parseInt(productInventory.value?.quantity || 0);
  });

  const togglePricePopOver = () => {
    pricePopOver.value = !pricePopOver.value;
  };

  const toggleSecureTrans = () => {
    secureTrans.value = !secureTrans.value;
  };

  const toFixed = (num) => {
    return parseFloat(num).toFixed(2);
  };

  const closePricePopOver = () => {
    pricePopOver.value = false;
  };

  const closeSecureTrans = () => {
    secureTrans.value = false;
  };

  const quantityChanged = (evt) => {
    quantity.value = evt.value;
  };


  const totalPrice = computed(() => {
    return parseFloat(productPrice.value) + parseFloat(shippingPrice.value);
  });

  const shippingPlace = computed(() => {
    const all = shippingRule.value?.find(obj => {
      return obj.country.toUpperCase() === 'ALL';
    });
    if (!all) {
      let maxPrice = 0
      let maxObj = 0
      shippingRule.value?.forEach((obj) => {
        if (parseFloat(obj.price) > maxPrice) {
          maxPrice = obj.price;
          maxObj = obj;
        }
      })
      return maxObj;
    } else return all;
  });

  const arrivesAt = computed(() => {
    const momentDate = moment().add(shippingPlace.value?.day_needed, 'days')

    const day = momentDate.format('ddd').toLowerCase()
    const mon = momentDate.format('MMM').toLowerCase()
    const date = momentDate.format('D')
    return t('date.ddddMMMD', {day: t(`date.${day}`), mon: t(`date.${mon}`), date: date})
  });

  const isFreeShipping = computed(() => {
    return !(parseFloat(shippingPrice.value) > 0)
  });

  const shippingPrice = computed(() => {
    return shippingPlace.value?.price || 0
  });

  const shippingRule = computed(() => {
    return product.value?.shipping_rule?.shipping_places;
  });


</script>

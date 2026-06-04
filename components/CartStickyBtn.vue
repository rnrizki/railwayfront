<template>
  <div v-if="product" class="sticky-cart-wrap">
    <div class="container-fluid">
      <div class="sticky-cart">

        <div class="sticky-title">
          <ImageLazy
            :lazy-src="getThumbImageURL(product.image)"
            :title="productTitle"
            :alt="productTitle"
          />
          <h5 class="ellipsis ellipsis-2">{{ productTitle }}</h5>
        </div>

        <div class="btn-wrap">

          <ajax-button
            id="add-to-cart"
            class="primary-btn btn"
            :disabled="disabled"
            type="button"
            :fetching-data="ajaxing"
            @clicked="addToCart"
            :loading-text="$t('detailRight.adding')"
            :text="$t('detailRight.addToCart')"
          />
          <ajax-button
            class=" outline-btn btn"
            :disabled="disabled"
            type="button"
            color="primary"
            :fetching-data="buyingNow"
            @clicked="addToCart(true)"
            :loading-text="$t('detailRight.buyNow')"
            :text="$t('detailRight.buyNow')"
          />

          <button
            aria-label="submit"
            class="compare-btn"
            @click.prevent="wishListAction"
          >
            <spinner
              v-if="ajaxingWishlist"
              class="mr-15"
            />
            <i v-else class="icon" :class="favouriteIcon"/>
          </button>

          <button
            aria-label="submit"
            class="compare-btn"
            :title="$t('product.compare')"
            @click.prevent="addToCompare"
          >
            <i class="icon reload-icon"/>
          </button>

        </div>
      </div>
    </div>
  </div>

</template>

<script setup>
  import {useUserStore} from "~/store/user";
  import {useLanguageStore} from "~/store/language";
  import {useCommonStore} from "~/store/common";
  import {useCartStore} from "~/store/cart";
  import {storeToRefs} from "pinia";
  import {useAuthStore} from "../store/auth";
  import {computed, defineEmits, toRefs} from "vue";
  import {useCartHelper} from "~/composables/useCartHelper";
  import {useUtils} from "~/composables/useUtils";

  const props = defineProps({
    product: {
      type: Object,
      default() {
        return null
      },
    },
    disabled: {
      type: Boolean,
      default: false
    },
    productInventory: {
      type: Object
    }
  });

  const {product, disabled, productInventory} = toRefs(props);

  const {getThumbImageURL} = useUtils();

  const commonStore = useCommonStore()
  const {currencyIcon, setting} = storeToRefs(commonStore)
  const {setToastMessage, setToastError, unAuthPost, postRequest} = commonStore;

  const emit = defineEmits(['cart-error']);

  const {wishListAction, addToCart, ajaxingWishlist, buyingNow, cartError, quantity, ajaxing, wishListed} =
          useCartHelper({product, productInventory, emit});

  const userStore = useUserStore()
  const {getUserToken} = userStore
  const {profile} = storeToRefs(userStore)

  const languageStore = useLanguageStore()
  const {langCode} = storeToRefs(languageStore)

  const cartStore = useCartStore()
  const {cartAction, buyNow} = cartStore

  const authStore = useAuthStore();
  const {authenticated} = storeToRefs(authStore);

  const isLoggedIn = computed(() => {
    return authenticated.value || false
  });

  const favouriteIcon = computed(() => {
    return wishListed.value ? 'heart-fill-icon' : 'heart-icon'
  });

  const productTitle = computed(() => {
    return product.value?.title;
  });

</script>

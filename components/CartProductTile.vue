<template>
  <div
    class="gap-20 flex sided align-start b-b pb-20 pt-10 mb-10 cart-product-tile"
    v-if="product"
  >
    <div class="flex gap-15">

      <label class="cb-container">
        <input
          type="checkbox"
          :value="cartId"
          v-model="cbChecked"
          class="cp"
          @change="$emit('cb-changed', {id: cart.id, checked: $event})"
        >
        <span class="checkmark"></span>
      </label>

      <nuxt-link
        class="w-100x img-wrapper"
        :to="productLink(product)"
        :title="title"
        @click="goToProduct(product)"
      >
        <ImageLazy
          :lazy-src="getThumbImageURL(productImage)"
          :title="title"
          :alt="title"
        />
      </nuxt-link>
    </div>
    <div class="content-wrap flex align-start grow block-sm gap-15">
      <div class="grow">

        <div>
          <h5 class="semi-bold mb-5">
            <nuxt-link
              class="ellipsis-1"
              :to="productLink(product)"
              :title="title"
              @click="goToProduct(product)"
            >
              {{ title }}
            </nuxt-link>
          </h5>
          <h6 class="color-lite mb-15 mt-10">
            <span class="mr-15" v-for="i in currentAttr">
              <b class="mr-5">{{i[0]}}</b> : {{i[1]}}
            </span>

            <span
              v-if="hasBundleDeal"
              class="ellipsis-1 mr-10"
            >
              <span class="bold mr-5">{{ $t('cartProductTile.bundleOffer') }}: </span>
              {{ bundleDeal.title }}
            </span>

            <span
              v-if="prevPrice"
            >
              <price-format
                class="color-reduced strike-through"
                :price="prevPrice"
              />

              <span class="bold color-offer">{{ $t('date.offer', {amount: reducedPercent }) }}</span>
            </span>
          </h6>

        </div>

        <form
          v-if="isShipping && currentAddresses.length && isSingleShipping"
        >
          <p v-if="!currentShipRule" class="error">{{ noShipMessage }}</p>
          <p v-else-if="error && error.length" class="error">
            <span class="block" v-for="e in error">{{ e }}</span>
          </p>
          <div v-else-if="cartShipping[cart.id]">
            <label class="mr-15 cp rd-container color-lite">

              <input
                class="mt-5 cp"
                type="radio"
                :value="shippingTypeIn.location"
                :name="`shipping_${cartId}_type`"
                v-model="cartShipping[cartId].shipping_type"
                @change="updateCartShipping"
              >
              <span class="rd-checkmark"></span>
              {{ $t('cartProductTile.fromLocation') }}
              (<span
              v-if="isFreeShipping" class="color-free">
              {{ $t('invent.fre') }}
            </span>
              <price-format
                v-else
                :price="currentShipRule.price"
              />
              )
            </label>
            <label
              v-if="parseInt(currentShipRule.pickup_point) === 1"
              class="mr-15 cp rd-container color-lite"
            >
              <input
                class="mt-5 cp"
                type="radio"
                :value="shippingTypeIn.pickup"
                :name="`shipping_${cartId}_type`"
                v-model="cartShipping[cartId].shipping_type"
                @change="updateCartShipping"
              >
              <span class="rd-checkmark"></span>
              {{ $t('cartProductTile.fromPickupPlace') }}
              (<span
              v-if="isFreePickup" class="color-free">
              {{ $t('invent.fre') }}
            </span>
              <price-format
                v-else
                :price="currentShipRule.pickup_price"
              />
              )
            </label>
          </div>
        </form>

        <div
          v-if="!isShipping"
          class="flex gap-10 start wrap mt-10"
        >
          <quantity-nav
            class="mtb-5"
            :quantity="parseInt(productQuantity)"
            :product-inventory="cart.updated_inventory"
            :max="maxQuantity"
            @value-changed="valueChanged"
          />
          <ajax-button
            class="outline-btn plr-20 mtb-5"
            type="button"
            :text="$t('userAddress.delete')"
            color="primary"
            @clicked="deleting"
          />
        </div>

      </div>

      <div class="mt-sm-10 mn-w-90x right-text">
        <h5 class="price inl-b-sm">
          <price-format
            :price="productPrice"
          />
        </h5>

        <p class="inl-b-sm">x {{ productQuantity }}</p>
        <p class="inl-b-sm" v-if="hasBundleDeal">(-) x {{ bundleDeal.free }}</p>

      </div>
    </div>
  </div>
</template>

<script setup>
  import {useUserStore} from "~/store/user";
  import {useCommonStore} from "~/store/common";
  import {useDetailStore} from "~/store/detail";
  import {useProductHelper} from "~/composables/useProductHelper";
  import {useUtils} from "~/composables/useUtils";
  import {useConstants} from "~/composables/useConstants";
  import {usePriceHelper} from "../composables/usePriceHelper";

  const props = defineProps({
    checked: {
      type: Array
    },
    cart: {
      type: Object
    },
    isShipping: {
      type: Boolean,
      default: false
    },
    cartShipping: {
      type: Object,
      default() {
        return null
      }
    },
    error: {
      type: Array,
      default() {
        return []
      }
    },
    currentAddresses: {
      type: Array,
      default() {
        return []
      }
    },
    address: {
      type: Object,
      default() {
        return null
      }
    },
  });

  const emit = defineEmits(['current-shipping', 'shipping-changed', 'deleting', 'quantity']);
  const {checked, cart, cartShipping, address} = toRefs(props);

  const userStore = useUserStore();
  const {getUserToken} = userStore;

  const commonStore = useCommonStore();
  const {currencyIcon, setting} = storeToRefs(commonStore);

  const detailStore = useDetailStore();
  const {setProduct} = detailStore;

  const goToProduct = (product) => {
    setProduct(product);
  };

  const cbChecked = ref(checked.value);

  watch(checked, (value) => {
    cbChecked.value = value;
  });

  const isFreePickup = computed(() => {
    return !(parseFloat(currentShipRule.value?.pickup_price) > 0);
  });

  const isFreeShipping = computed(() => {
    return !(parseFloat(currentShipRule.value?.price) > 0);
  });

  const isSingleShipping = computed(() => {
    return cartShipping.value[cart.value?.id]?.single_shipping;
  });

  const hasBundleDeal = computed(() => {
    return (productQuantity.value >= bundleDeal.value?.buy);
  });

  const bundleDeal = computed(() => {
    return product.value?.bundle_deal;
  });

  const cartId = computed(() => {
    return cart.value?.id;
  });

  const product = computed(() => {
    return cart.value?.flash_product;
  });

  const productInventory = computed(() => {
    return cart.value?.updated_inventory;
  });

  const currentShipRule = computed(() => {
    let matched = null;
    if (address.value) {
      product.value?.shipping_rule?.shipping_places.forEach((obj) => {
        if (obj.country === address.value.country) {
          if (obj.state === address.value.state) {
            matched = obj;
            return;
          } else if (obj.state === 'ALL') {
            matched = obj;
          }
        } else if (obj.country === 'ALL') {
          if (!matched) {
            matched = obj;
          }
        }
      })
    }

    if (matched && !matched?.shipping_rule) {
      matched = {...matched, ...{shipping_rule: product.value?.shipping_rule}};
    }

    if (matched && cartShipping.value[cart.value?.id]) {
      cartShipping.value[cart.value?.id].shipping_place = matched;
      updateCartShipping();
    }

    emit('current-shipping', {cart: cart.value?.id, shipping: matched});
    return matched;
  });


  const {getProductImage} = useProductHelper();
  const {productLink, getThumbImageURL} = useUtils();
  const {shippingTypeIn} = useConstants();

  const productImage = computed(() => {
    return getProductImage(product.value, inventoryAttributes.value);
  });

  const inventoryAttributes = computed(() => {
    return productInventory.value?.inventory_attributes
  });


  const {productPrice, prevPrice, reducedPercent} = usePriceHelper({product, productInventory});

  const currentAttr = computed(() => {
    return inventoryAttributes.value?.map(i => {
      return [i?.attribute_value?.attribute?.title, i?.attribute_value?.title]
    })
  });

  const title = computed(() => {
    return product.value?.title || ''
  });

  const maxQuantity = computed(() => {
    return parseInt(productInventory.value?.quantity)
  });

  const productQuantity = computed(() => {
    return parseInt(cart.value?.quantity)
  });

  const {t} = useI18n();
  const noShipMessage = computed(() => {
    const state = address.value?.stateTitle ? `${address.value?.stateTitle},` : ''
    return t('cartProductTile.noShipMessage', {state: state, country: address.value?.countryTitle})
  });


  const updateCartShipping = () => {
    emit('shipping-changed', cartShipping.value)
  };

  const deleting = async () => {
    if (confirm(t('cartProductTile.deleteAlert'))) {
      emit('deleting', {id: cartId.value, isBundle: !!bundleDeal.value, user_token: await getUserToken()})
    }
  };

  const valueChanged = (evt) => {
    emit('quantity', {
        bundleDeal: bundleDeal.value,
        product: product.value,
        inventory: productInventory.value,
        direction: evt.direction
      }
    )
  };

</script>



<template>
  <div>
    <transition name="fade" mode="out-in">
      <div
        class="spinner-wrapper flex"
        v-if="fetchingCartData || ajaxing"
      >
        <spinner
          :radius="100"
        />
      </div>
      <div v-else>
        <CartProductTile
          v-for="(value) in cartProducts"
          :key="value.id"
          :cart="value"
          :checked="checked"
          :is-shipping="isShipping"
          :cart-shipping="cartShipping"
          :current-addresses="currentAddresses"
          :address="address"
          :error="dataFromObject(errorFromApi, value.id, null)"
          @cb-changed="cbChangedFn"
          @deleting="deleting"
          @quantity="valueChanged"
          @update-cart-shipping="updateCartShipping"
          @current-shipping="currentShipping"
        />
      </div>
    </transition>
  </div>
</template>

<script setup>
  import {useUserStore} from "~/store/user";
  import {useLanguageStore} from "~/store/language";
  import {useCartStore} from "~/store/cart";
  import {storeToRefs} from "pinia";
  import {useUtils} from "~/composables/useUtils";

  const props = defineProps({
    cartProducts: {
      type: Array
    },
    checked: {
      type: Array
    },
    cartShipping: {
      type: Object,
      default() {
        return null
      }
    },
    isShipping: {
      type: Boolean,
      default: false
    },
    ajaxing: {
      type: Boolean,
      default: false
    },
    currentAddresses: {
      type: Array,
      default() {
        return []
      }
    },
    errorFromApi: {
      type: Object,
      default() {
        return null
      }
    },
    address: {
      type: Object,
      default() {
        return null
      }
    },
  });

  const {cartShipping, checked} = toRefs(props);

  const emit = defineEmits(['current-shipping', 'shipping-changed', 'cart-changed']);

  const languageStore = useLanguageStore();
  const {langCode} = storeToRefs(languageStore);

  const userStore = useUserStore();
  const {getUserToken} = userStore;

  const cartStore = useCartStore();
  const {cartDelete, cartAction, cartChanged} = cartStore;

  const fetchingCartData = ref(false);
  const ajaxDeleting = ref(0);

  const {dataFromObject } = useUtils();

  const currentShipping = (evt) => {
    emit('current-shipping', evt);
  };

  const updateCartShipping = () => {
    emit('shipping-changed', cartShipping.value);
  };

  const valueChanged = async ({bundleDeal, product, inventory, direction}) => {
    await cartAction({
      payload: {
        apiVal: {
          user_token: await getUserToken(),
          product_id: product.id,
          inventory_id: inventory.id,
          quantity: direction
        },
        storeVal: {
          product: product,
          inventory: inventory,
          quantity: direction,
          selected: '1'
        },
        isBundle: !!bundleDeal
      },
      lang: langCode.value
    })

  };

  const deleting = async (evt) => {
    await cartDelete({
      payload: evt,
      lang: langCode.value
    })
  };

  const cbChangedFn = async (evt) => {
    const cbChecked = checked.value
    if (evt.checked.target.checked) {
      cbChecked.push(evt.id)
    } else {
      const index = checked.value.findIndex((obj) => {
        return parseInt(obj) === parseInt(evt.id)
      })
      delete cbChecked[index]
    }

    await cartChanged({
      lang: langCode.value,
      payload: {
        checked: cbChecked
      }
    })
    emit('cart-changed', true)
  };

</script>




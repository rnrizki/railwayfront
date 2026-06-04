<template>
  <tr>
    <td>
      <nuxt-link
        :to="productLink(cart.product)"
        class="img-wrap"
        :title="cart.product.title"
        @click="goToProduct"
      >
        <ImageLazy
          :lazy-src="getThumbImageURL(productImage)"
          :title="cart.product.title"
          :alt="cart.product.title"
        />

      </nuxt-link>
    </td>
    <td class="mn-w-200x-md">
      <nuxt-link
        :to="productLink(cart.product)"
        :title="cart.product.title"
        class="mb-5 block"
        @click="goToProduct"
      >
        {{ cart.product.title }}
      </nuxt-link>
      <span
        class="block"
      >
        <span class="mr-15" v-for="i in currentAttribute">
          <b class="mr-10">{{i[0]}}</b> : {{i[1]}}
        </span>
      </span>
      <button
        v-if="!!!ordered.cancelled"
        aria-label="submit"
        class="link-color"
        @click.prevent="$emit('rate-now', cart.product.id)">
        {{ $t('ratePopup.rateNow') }}
      </button>
    </td>
    <td>{{ shippingTypes[cart.shipping_type] }}</td>
    <td>
      <price-format
        :price="cart.shipping_price"
      />
    </td>
    <td>{{ cart.quantity }}</td>
    <td>
      <price-format
        :price="cart.selling * dataFromObject(cart, 'bundle_offer', 0)"
      />
    </td>
    <td>
      <price-format
        :price="cart.selling"
      />
    </td>
    <td>
      <price-format
        :price="cart.selling * cart.quantity"
      />
    </td>
  </tr>
</template>

<script setup>

  import {useUtils} from "~/composables/useUtils";
  import {useConstants} from "~/composables/useConstants";
  import {useProductHelper} from "~/composables/useProductHelper";
  import {useDetailStore} from "~/store/detail";

  const props = defineProps({
    ordered: {
      type: Object
    },
    cart: {
      type: Object
    },
  });

  const {cart} = toRefs(props);

  const detailStore = useDetailStore();
  const {setProduct} = detailStore;

  const {dataFromObject, productLink, getThumbImageURL} = useUtils();
  const {shippingTypes} = useConstants();

  const {getProductImage} = useProductHelper()

  const goToProduct = () => {
    setProduct(product.value);
  };

  const productImage = computed(() => {
    return getProductImage(product.value, inventoryAttributes.value)
  });


  const productImages = computed(() => {
     return cart.value?.product_images
   });

  const  product = computed(() => {
    return cart.value?.product
  });

  const inventoryAttributes = computed(() => {
    return cart.value?.updated_inventory?.inventory_attributes
  });

  const  currentAttribute = computed(() => {
    return inventoryAttributes.value?.map(i => {
      return [i?.attribute_value?.attribute?.title, i?.attribute_value?.title]
    })
  });

</script>


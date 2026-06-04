<template>
  <span class="quantity-area ">
    <button
      aria-label="subtract"
      @click.prevent="qty(-1)"
    >
      -
    </button>
    <span class="no-control">{{ qtyComputed }}</span>
    <button
      aria-label="add"
      @click.prevent="qty(1)"
    >
      +
    </button>
  </span>
</template>

<script>
  import {useCommonStore} from "~/store/common";

  export default {
    setup(){
      const commonStore = useCommonStore()
      const {setToastError} = commonStore

      return {setToastError}
    },
    data() {
      return {
        qtyVal: 1,
      }
    },
    props: {
      productInventory: {
        type: Object,
        default: () => {
          return {}
        }
      },
      quantity: {
        type: Number,
        default: 1
      },
      max: {
        type: Number,
        default: 1
      }
    },
    components: {},
    mixins: [],
    computed: {
      qtyComputed() {
        return this.qtyVal
      }
    },
    methods: {
      qty(direction) {
        if(!Object.keys(this.productInventory).length) {
          this.setToastError(this.$t('detailRight.requiredAttributes'))
          return
        }

        if (this.qtyVal + direction > this.max) {
          this.setToastError(this.$t('quantityNav.maximumExceeds'))
          return
        }
        if (this.qtyVal + direction === 0) {
          this.setToastError(this.$t('quantityNav.min'))
          return
        }

        this.qtyVal += direction
        this.$emit('value-changed', {direction: direction, value: this.qtyVal})
      },
    },
    activated() {
      this.qtyVal = this.quantity
    },
    mounted() {
      this.qtyVal = this.quantity
    }
  }
</script>

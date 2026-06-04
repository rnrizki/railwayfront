<template>
  <span>{{formattedPrice}}</span>
</template>

<script>

  import util from "~/mixin/util"
  import {useCommonStore} from "~/store/common";
  import {storeToRefs} from "pinia";

  export default {

    setup(){
      const commonStore = useCommonStore()
      const {currencyIcon, setting, currency} = storeToRefs(commonStore)

      const currencyPosition = computed(() => {
        return setting.value.currency_position;
      })

      return {currencyIcon, setting, currencyPosition, currency}
    },

    name: 'PriceFormat',
    data() {
      return {

      }
    },
    props: {
      price: {
        default: 0,
        required: true
      }
    },
    mixins: [util],
    components: {},
    computed: {
      formattedPrice(){
        return this.priceFormat(this.currencyPosition, this.currencyIcon, this.price, this.setting)
      },
    },
    methods: {

    },
    mounted() {
    }
  }
</script>


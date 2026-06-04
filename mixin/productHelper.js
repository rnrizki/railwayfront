export default {
  data() {
    return {
      ajaxingWishlist: false
    }
  },
  methods: {
    refundable(product){
      return (parseInt(product?.refundable) === 1)
    },
    warranty(product){
      return (parseInt(product?.warranty) === 1) ? this.$t('productHelper.available') : this.$t('productHelper.notAvailable')
    },
    getPriceType(item){
      if(parseInt(item.type) === this.priceType.FLAT){

        return this.priceFormat(this.currencyPosition, this.currencyIcon, item.price, this.setting)

      }else {
        return item.price + '%'
      }
    }
  }
}

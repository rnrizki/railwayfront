<template>
  <div>
    <pop-over
      v-if="!payNow"
      :title="$t('checkout.selectPayment')"
      elem-id="pay-now-pop-over"
      :layer="true"
      class="rating-popup payment-popup popup-top-auto"
      @close="$emit('close')"
    >
      <template v-slot:content>
        <payment-gateways
          page="order"
          :order="order"
          :total-price="parseFloat(amount)"
          @order-status="isOrderPlaced"
          @order-confirm="payNow = true"
          @close="$emit('close')"
        />
      </template>
    </pop-over>
  </div>
</template>
<script>
  import util from '~/mixin/util'
  import PopOver from "./PopOver";
  import RazorpayPayment from "./RazorpayPayment";
  import StripePayment from "./StripePayment";
  import PaymentGateways from "./PaymentGateways";
  import {useCommonStore} from "~/store/common";
  import {storeToRefs} from "pinia";
  import {useUserStore} from "../store/user";

  export default {
    setup(){
      const commonStore = useCommonStore()
      const {currencyIcon, setting, paymentGateway} = storeToRefs(commonStore)
      const {setToastMessage, setToastError} = commonStore;

      const userStore = useUserStore();
      const {profile} = storeToRefs(userStore)

      return {currencyIcon, setting, paymentGateway, setToastMessage, setToastError, profile}
    },

    name: 'PaymentPopup',
    data() {
      return {
        payNow: false
      }
    },
    watch: {},
    props: {
      order: {
        type: Object,
        default(){
          return null
        }
      }
    },
    components: {
      PaymentGateways,
      StripePayment,
      RazorpayPayment,
      PopOver
    },
    computed: {
      userEmail() {
        return this.order?.userEmail || this.profile?.email
      },
      currencyData() {
        return this.order?.currency || this.currency
      },
      userName() {
        return this.order?.userName || this.profile?.name
      },
      razorpayPaymentToken() {
        return this.order?.payment_token || null
      },
      amount() {
        return this.order?.total_amount || 0
      },
      orderId() {
        return this.order?.id || null
      },
    },
    mixins: [util],
    methods: {
      isOrderPlaced(evt){
        if(evt){
          window.location.reload(true)
          this.setToastMessage(this.$t('payButton.placedSuccess'))
          this.payNow = false
        }else{
          this.orderPlaced('closed')
        }
      },
      orderPlaced(type = 'success', event = 'Error') {
        if(type === 'success'){
          this.setToastMessage(this.$t('payButton.placedSuccess'))
          this.$emit('success')
        } else if(type === 'error'){
          this.setToastError(event)
        } else if(type === 'closed'){
          this.payNow = false
        }
      },
    },
  }
</script>


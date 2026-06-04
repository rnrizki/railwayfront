<template>
  <div>

    <ajax-button
      class="primary-btn  plr-30 plr-sm-15"
      type="button"
      :fetching-data="placingOrder"
      :text="btnText"
      @clicked="confirmOrder"
    />

    <p v-if="errorText"
       class="error">
      {{ errorText }}
    </p>

    <span
      class="spinner-wrapper flex layer-white"
      v-if="loading || submitting"
    >
      <spinner
        :radius="50"
      />
    </span>
  </div>

</template>
<script>
  import Spinner from "./Spinner";
  import util from "~/mixin/util";
  import paymentHelper from "~/mixin/paymentHelper";
  import AjaxButton from "./AjaxButton";
  import {useLanguageStore} from "~/store/language";
  import {useUserStore} from "~/store/user";
  import {storeToRefs} from "pinia";
  import {useCommonStore} from "../store/common";

  export default {
    setup(){
      const languageStore = useLanguageStore()
      const {langCode} = storeToRefs(languageStore)

      const userStore = useUserStore()
      const {getUserToken} = userStore

      const commonStore = useCommonStore()
      const {postRequest} = commonStore

      return {postRequest, getUserToken, langCode}
    },
    name: 'FlutterwavePayBtn',
    data() {
      return {
        errorText: '',
        submitting: false,
        placingOrder: false
      }
    },
    props: {
      order: {
        type: Object,
        default() {
          return null
        }
      },
      loading: {
        type: Boolean,
        default: false
      },
      currency: {
        type: String,
        default: 'USD'
      },
      amount: {
        type: Number,
        default: 0
      },
      name: {
        type: String,
        default: ''
      },
      userId: {
        type: String,
        default: ''
      },
      email: {
        type: String,
        default: ''
      },
      publicKey: {
        type: String,
        default: ''
      },
      siteName: {
        type: String,
        default: ''
      },
      headerLogo: {
        type: String,
        default: ''
      },
      btnText: {
        type: String,
        default: ''
      },
    },
    components: {
      AjaxButton,
      Spinner
    },
    mixins: [util, paymentHelper],
    methods: {
      confirmOrder(){
        this.placingOrder = true
        this.$emit('clicked')
      },

      makePayment() {
        this.placingOrder = false
        const self = this

        const fw = FlutterwaveCheckout({
          public_key: this.publicKey,
          tx_ref: "ref_" + this.order.order,
          amount: this.amount,
          currency: this.currency,
          payment_options: "card, banktransfer, ussd",

          meta: {
            consumer_id: this.userId,
          },
          customer: {
            email: this.email,
            user_id:  this.userId,
            name: this.name,
          },
          callback: async (data) => {
            this.submitting = true
            const res = await this.paymentDoneFn(this.order.id, data.transaction_id, this.orderMethods.FLUTTERWAVE)
            fw.close();
          },
          onclose: function() {
            self.$emit('closed', self.order.id)
          },
          customizations: {
            title: this.siteName,
            description: "",
            logo: this.headerLogo
          },
        });
      },
    },
  }
</script>


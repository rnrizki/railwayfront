<template>
  <pop-over
    :title="$t('orderCancelPopup.cancelOrder')"
    @close="$emit('close')"
    elem-id="cancel-order-pop-over"
    :layer="true"
    class="cancel-popup"
  >
    <template v-slot:content>
      <div
        v-if="fetchingCancelledData"
        class="mn-h-200x flex"
      >
        <spinner
          :radius="70"
        />
      </div>
      <div
        v-else
      >
        <div
          class="input-wrap"
          :class="{invalid: !title && hasFormError}"
        >
          <label>
            {{ $t('orderCancelPopup.title') }}
          </label>
          <input
            type="text"
            v-model="title"
            :placeholder="$t('contact.your', { type: $t('orderCancelPopup.titleSmall') })"
          >
          <span
            class="error"
            v-if="!title && hasFormError"
          >
              {{ $t('addressPopup.isRequired', {type: $t('orderCancelPopup.title') }) }}
            </span>
        </div>

        <div
          class="input-wrap mb-0"
          :class="{invalid: !cancellationMessage && hasFormError}"
        >
          <label>{{ $t('addressPopup.message') }}</label>
          <textarea
            v-model="cancellationMessage"
          />
          <span
            class="error"
            v-if="!cancellationMessage && hasFormError"
          >
              {{ $t('addressPopup.isRequired', {type: $t('addressPopup.message') }) }}
            </span>
        </div>
      </div>
    </template>

    <template v-slot:pop-footer>
      <div class="flex j-end gap-10">
        <button
          aria-label="close"
          class="outline-btn plr-30 plr-sm-15"
          @click.prevent="$emit('close')"
        >
          {{ $t('addressPopup.cancel') }}
        </button>
        <ajax-button
          class="primary-btn  plr-30 plr-sm-15"
          type="button"
          :fetching-data="submitting"
          :loading-text="$t('checkoutRight.submitting')"
          :text="$t('orderCancelPopup.SendMessage')"
          :disabled="fetchingCancelledData"
          @clicked="submitForm"
        />
      </div>
    </template>
  </pop-over>
</template>

<script>
  import util from '~/mixin/util'
  import validation from '~/mixin/validation'
  import PopOver from '~/components/PopOver'
  import Spinner from '~/components/Spinner'
  import AjaxButton from "~/components/AjaxButton"
  import {useUserStore} from "~/store/user";
  import {useCommonStore} from "~/store/common";
  import {useOrderStore} from "~/store/order";
  import {useLanguageStore} from "~/store/language";
  import {storeToRefs} from "pinia";
  import {prepareGetUrl} from "../utils/fetchClient";

  export default {
    setup(){
      const userStore = useUserStore()
      const {getUserToken} = userStore

      const commonStore = useCommonStore()
      const {setToastMessage, setToastError, getRequest, postRequest} = commonStore

      const orderStore = useOrderStore()
      const {cancellationFind} = orderStore

      const languageStore = useLanguageStore()
      const {langCode} = storeToRefs(languageStore)

      return {getUserToken, cancellationFind, setToastMessage, getRequest,
        setToastError, langCode, postRequest}
    },
    name: 'OrderCancelPopup',
    data() {
      return {
        title: '',
        cancellationMessage: '',
        submitting: false,
        hasFormError: false,
        fetchingCancelledData: false
      }
    },
    props: {
      orderId: {
        type: Number,
        required: true
      }
    },
    components: {
      AjaxButton,
      PopOver,
      Spinner
    },
    mixins: [util, validation],
    methods: {
      serializing(obj) {
        this.title = obj.title
        this.cancellationMessage = obj.message
      },
      async submitForm() {
        if (this.title && this.cancellationMessage) {
          this.submitting = true
          const data = await this.postRequest({
            api: 'cancelOrder',
            params: {
              user_token: await this.getUserToken(),
              order_id: this.orderId,
              message: this.cancellationMessage,
              title: this.title,
            },
            lang: this.langCode
          })
          this.submitting = false
          if (data?.status === 200) {
            this.$emit('success')
            this.setToastMessage(data.message)

          } else if (data?.status === 204) {

            this.setToastError(data.message)

          } else {
            this.setToastError(data.data?.form.join(', '))
          }
        } else {
          this.hasFormError = true
        }
      },

    },

    async mounted() {
      this.fetchingCancelledData = true
      const data = await this.getRequest({
        api: 'cancellationFind',
        params: `/${this.orderId}?${prepareGetUrl({
          id: this.orderId,
          user_token: await this.getUserToken(),
        })}`,
        lang: this.langCode
      })
      if (data?.status === 200) {
        this.serializing(data.data)
      }
      this.fetchingCancelledData = false
    }
  }
</script>


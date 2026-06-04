<template>
  <client-only>
    <div class="container">
      <section class="home-section">
        <h3>{{ $t('razorpayCallback.wait') }}...</h3>
      </section>
    </div>
  </client-only>
</template>
<script>
  import global from '~/mixin/global'
  import util from '~/mixin/util'
  import {useCommonStore} from "~/store/common";
  import {storeToRefs} from "pinia";
  import {useMetaData} from "~/composables/useMetaData";

  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  })

  export default {
    setup(){
      const commonStore = useCommonStore()
      const {customScripts, site_setting} = storeToRefs(commonStore)

      const {pageMeta} = useMetaData();
      useHead(pageMeta(site_setting.value));

      return {customScripts}
    },
    mixins: [global, util],
    computed: {
      orderId() {
        return parseInt(this.$route.params.id)
      },
    },
    async mounted() {
      this.$router.push(`/user/order/${this.orderId}`)
    }
  }
</script>

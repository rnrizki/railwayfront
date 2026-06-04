<template>
  <client-only>
    <div class="container">
      <section class="home-section">
        <h3>{{ $t('orderTabbing.cancelled') }}</h3>
      </section>
    </div>
  </client-only>
</template>
<script>

  import global from '~/mixin/global'
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
      const {setToastMessage, setToastError, getRequest} = commonStore
      const {customScripts, site_setting} = storeToRefs(commonStore)

      const {pageMeta} = useMetaData();
      useHead(pageMeta(site_setting.value));

      return {setToastMessage, setToastError, getRequest, customScripts}
    },
    mixins: [global],
    computed: {
      orderId() {
        return parseInt(this.$route.params.id)
      },
    },
    async mounted() {
      this.setToastMessage(this.$t('invent.pc'))
      this.$router.push(`/user/order/${this.orderId}`)
    }
  }
</script>

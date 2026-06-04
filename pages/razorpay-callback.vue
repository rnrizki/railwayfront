<template>
  <client-only>
  <div class="container">
    <section class="home-section">
      <h3>{{ $t('razorpayCallback.wait') }}...</h3>
    </section>
  </div>
  </client-only>
</template>
<script setup>

  import {useCommonStore} from "~/store/common";

  definePageMeta({
    middleware: ['common-middleware', 'auth'],
    layout: 'default',
  });

  const commonStore = useCommonStore();
  const {customScripts} = storeToRefs(commonStore);

</script>

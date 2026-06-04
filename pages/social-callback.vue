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
  import {storeToRefs} from "pinia";
  import {useUserStore} from "~/store/user";
  import {useAuthStore} from "~/store/auth";

  definePageMeta({
    middleware: ['common-middleware', 'non-auth'],
    layout: 'default',
  });

  const commonStore = useCommonStore()
  const {customScripts} = storeToRefs(commonStore)

  const userStore = useUserStore();
  const {profile} = storeToRefs(userStore);
  const {setProfile} = userStore;

  const authStore = useAuthStore();
  const {setToken} = authStore;

  const route = useRoute();

  const error = computed(() => {
    return route.query.error || null;
  });

  const id = computed(() => {
    return route.query.id || null;
  });

  const name = computed(() => {
    return route.query.name || null;
  });

  const email = computed(() => {
    return route.query.email || null;
  });

  const token = computed(() => {
    return route.query.token || null;
  });

  onMounted(() => {
    if (error.value) {
      showError({statusCode: 400, message: error.value});
    } else {
      setProfile({email: email.value});
      setToken(token.value);

      setTimeout(() => {
        return navigateTo('/');
      }, 3000)
    }
  });

</script>

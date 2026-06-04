<template>
  <div :class="routeName">
    <transition
      name="fade"
      mode="out-in"
    >
      <div
        v-if="popupWrapperVisible"
        class="popup-banner-wrapper"
      >
        <banner
          class="popup-banner"
          :banner="popupBanner"
          v-outside-click="bannerClosed"
          @close="closedPermanently"
          @clicked="closedPermanently"
        />
      </div>
    </transition>
    <CommonHeader
      @going-next="goingNext"
    />
    <main>
      <slot/>
    </main>
    <CommonFooter/>

    <transition name="fade" mode="out-in">
      <ToastMessage
        v-if="toastMessageStatus"
        :is-error="toastError"
        @hide="hideToast"
        :message="toastMessage"
      />
    </transition>


    <pop-over
      v-if="!isCookieBannerClosed"
      class="cookie-banner"
      elem-id="cookie-pop-over"
      :layer-on-responsive="false"
      :layer="false"
    >
      <template v-slot:content>
        <div class="flex gap-15">
          <p class="f-9">{{ $t('date.cb') }}</p>
          <button @click.prevent="closeCookieBanner" class="outline-btn plr-15">{{ $t('date.gi') }}</button>
        </div>
      </template>
    </pop-over>

  </div>
</template>

<script setup>
  import {storeToRefs} from "pinia";
  import {useUserStore} from "~/store/user";
  import {useLanguageStore} from "~/store/language";
  import {useCommonStore} from "~/store/common";
  import {useMetaData} from "~/composables/useMetaData";
  import {useConstants} from "~/composables/useConstants";

  const userStore = useUserStore();
  const {profile} = storeToRefs(userStore);
  const {setProfile, getUserToken} = userStore;

  const languageStore = useLanguageStore();
  const {currentLanguage} = storeToRefs(languageStore);

  const commonStore = useCommonStore();
  const {setting, site_setting, popupBanner, toastMessage, toastError, toastMessageStatus} = storeToRefs(commonStore);
  const {hideToast, getRequest} = commonStore;

  const {commonMeta} = useMetaData();
  useHead(commonMeta(site_setting.value));

  const route = useRoute();

  const isCookieBannerClosed = ref(true);
  const componentId = ref(null);
  const loading = ref(false);
  const isPopupWrapperVisible = ref(false);

  const {status} = useConstants();

  const popupWrapperVisible = computed(() => {
    return isPopupWrapperVisible.value && parseInt(popupBanner.value?.status) === 1
  });

  const routeName = computed(() => {
    return route?.name?.split('___')[0] || 'error'
  });

  const closeCookieBanner = () => {
    localStorage.setItem('cookieBannerClosed', true)
    isCookieBannerClosed.value = true
  };

  const initializeGoogleAnalytics = (gaId) => {
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      window.dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', gaId);
  };

  const goingNext = ({id, url}) => {
    componentId.value = id + '-' + Date.now()
    router.push({path: url})
  };

  const closedPermanently = () => {
    localStorage.setItem('popupBannerClosed', true);
    bannerClosed();
  };

  const bannerClosed = () => {
    isPopupWrapperVisible.value = false
    document.body.classList.remove('no-scroll')
  };

  const initializeFacebookPixel = (pixelID) => {
    !function (f, b, e, v, n, t, s) {
      if (f.fbq) return;
      n = f.fbq = function () {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    fbq('init', pixelID);
    fbq('track', 'PageView');
  };


  onMounted(() => {
    document.body.classList.add(currentLanguage.value?.direction || 'ltr')

    if (site_setting.value?.primary_color) {
      document.documentElement.style.setProperty('--primary-color', site_setting.value.primary_color)
      document.documentElement.style.setProperty('--primary-hover-color', site_setting.value.primary_hover_color)
    }

    isCookieBannerClosed.value = !setting.value?.cookie_banner || localStorage.getItem('cookieBannerClosed', false)

    if (!localStorage.getItem('popupBannerClosed', false) && parseInt(popupBanner.value?.status) === status.PUBLIC) {
      document.body.classList.add('no-scroll');
      isPopupWrapperVisible.value = true;
    }

    if (setting.value?.enable_ga) {
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + setting.value?.ga_id;
      script.async = true;
      document.head.appendChild(script);
      script.onload = () => {
        initializeGoogleAnalytics(setting.value?.ga_id);
      };
    }

    if (setting.value?.enable_pixel) {
      initializeFacebookPixel(setting.value?.pixel_id);
    }
  });

</script>
<style lang="stylus">
  main
    min-height 650px

  .error
    main
      min-height 300px

  @media only screen and (max-width: 768px)
    main
      min-height 400px
</style>

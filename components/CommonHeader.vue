<template>
  <header :class="{'no-banner': (topBannerLoaded && isTopBannerClosed) || !isPublic}">

    <banner
      v-if="!isTopBannerClosed"
      class="top-banner"
      :banner="topBanner"
      @close="closeTopBanner"
    />

    <div class="top-wrapper">
      <div class="container-fluid">

        <div ref="headerWrapperRef" class="wrap flex sided">
          <div class="left-side wrap flex gap-10">

            <dropdown
              v-if="Object.keys(languages).length"
              :selected-key="currentLanguage.code"
              :options="languages"
              :positionFixed="false"
              key-name="name"
              class="lang-dropdown"
              @clicked="selectedLanguage"
            />

            <a :href="`mailto:${email}`"
               class="flex gap-5"
            >
              <i class="icon email-icon"/>
              <span>
                <span class="hide-md">{{ $t('home.mail') }}</span>
                {{ email }}
              </span>
            </a>

            <template v-if="phone">
              <span>|</span>
              <a :href="`tel:${phone}`"
                 class="flex gap-5"
              >
                <i class="icon phone-icon"/>
                <span><span class="hide-md">{{ $t('home.helpline') }}</span> {{ phone }}</span>
              </a>
            </template>
          </div>

          <div class="flex right-side text-upper">
            <div class="flex gap-5"
                 v-if="!isLoggedIn"
            >
              <template v-if="sellerSignUp">
                <nuxt-link to="/seller/sign-up" class="flex gap-5">
                  {{ $t('date.bav') }}
                </nuxt-link>
                <span>|</span>
              </template>

              <nuxt-link
                to="/login"
                @click="beforeLogin"
                class="flex gap-5"
              >
                <i class="icon login-icon"/>
                {{ $t('header.login') }}
              </nuxt-link>
              <span>|</span>
              <nuxt-link
                to="/register"
                class="flex gap-5"
              >
                <i class="icon register-icon"/>
                {{ $t('header.register') }}
              </nuxt-link>
            </div>

            <nuxt-link
              v-else
              to="/user/profile"
              class="flex gap-5"
            >
              <i class="icon user-icon"/>
              {{ $t('header.profile') }}
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <div class="header-sticky" :class="{sticky: headerSticky}">
      <div class="container-fluid flex pos-rel">
        <div class="left-area">
          <nuxt-link to="/" class="logo">
            <img :src="getImageURL(site_setting.header_logo)"
                 :alt="$t('footer.siteLogo')"
                 height="40"
                 width="139"
            >
          </nuxt-link>
        </div>

        <form class="search-input grow" @submit.prevent="search">
          <input
            @focus="openSearchPopup"
            @blur="blurSearchInput"
            type="text"
            :placeholder="$t('header.searchHere')"
            v-model="searchedText"
          >
          <button
            aria-label="submit"
            type="submit"
            class="flex"
          >
            <i class="icon search-icon"/>
          </button>

          <SearchPopup
            v-if="searchPopup"
            :searched-text="searchedText"
            @close="closeSearchPopup"
          />
        </form>

        <div class="right-area flex gap-15 right">

          <div class="pos-rel"
               v-outside-click="closeDropdown"
          >
            <button
              aria-label="submit"
              class="flex gap-10"
              @click.prevent="toggleDropdown"
            >
              {{ $t('header.account') }}
              <i class="icon arrow-down black"/>
            </button>
            <div class="dropdown"
                 :class="{active: showDropdown}"
            >
              <nuxt-link to="/user/orders"
                @click.prevent="closeDropdown"
              >
                {{ $t('header.orders') }}
              </nuxt-link>
              <nuxt-link
                to="/user/wishlists"
                @click.prevent="closeDropdown"
              >
                {{ $t('header.wishList') }}
              </nuxt-link>
              <nuxt-link
                to="/user/compared"
                @click.prevent="closeDropdown"
              >
                {{ $t('header.comparedList') }}
              </nuxt-link>
              <nuxt-link
                to="/user/vouchers"
                @click.prevent="closeDropdown"
              >
                {{ $t('header.vouchers') }}
              </nuxt-link>
              <button
                aria-label="Logout"
                v-show="isLoggedIn"
                class="clear-btn"
                @click.prevent="userLogOut"
              >
                {{ $t('header.logout') }}
              </button>
            </div>
          </div>
          <nuxt-link to="/cart" class="cart-btn flex pos-rel h-40x gap-5">
            <span v-if="cartCount" class="cart-badge">
              {{ cartCount }}
            </span>
            <i class="icon cart-icon black"/>
            <span class="title">{{ $t('header.cart') }}</span>
          </nuxt-link>
        </div>
      </div>
      <div class="bottom-area text-nowrap">
        <div class="container-fluid">
          <div class="flex sided">
            <div>
              <nuxt-link
                v-for="(item, index) in headerLeft"
                :key="index"
                :to="getUrl(item)"
              >
                <span>
                  {{ getTitle(item) }}
                </span>
              </nuxt-link>
            </div>
            <div>

              <nuxt-link
                v-for="(item, index) in headerRight"
                :key="index"
                :to="getUrl(item)"
              >
                <span>
                  {{ getTitle(item) }}
                </span>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
  import {storeToRefs} from "pinia";
  import {computed, onUnmounted} from "vue";
  import {navigateTo} from "nuxt/app";
  import {useConstants} from "~/composables/useConstants";
  import {onMounted} from "vue";
  import {useLanguageStore} from "~/store/language";
  import {useCartStore} from "~/store/cart";
  import {useUserStore} from "~/store/user";
  import {useCommonStore} from "~/store/common";
  import {useListingStore} from "~/store/listing";
  import {useAuthStore} from "~/store/auth";
  import {useUtils} from "~/composables/useUtils";

  const languageStore = useLanguageStore();
  const {setDefaultLanguage, getLangData} = languageStore;
  const {currentLanguage, languages, langCode} = storeToRefs(languageStore);

  const cartStore = useCartStore();
  const {emptyCartProduct, setCartCount} = cartStore;
  const {cartCount} = storeToRefs(cartStore);

  const userStore = useUserStore();
  const {profile} = storeToRefs(userStore);
  const {setProfile, getUserToken} = userStore;

  const commonStore = useCommonStore();
  const {site_setting, setting, topBanner, headerLinks} = storeToRefs(commonStore);
  const {bgGetRequest} = commonStore;

  const listingStore = useListingStore();
  const {searched} = storeToRefs(listingStore);
  const {updateSearch, setSearchedSuggestion} = listingStore;

  const authStore = useAuthStore();
  const {authenticated} = storeToRefs(authStore);
  const {logUserOut} = authStore;

  const isLoggedIn = computed(() => {
    return authenticated.value || false;
  });

  const route = useRoute();

  const beforeLogin = () => {
    if (import.meta?.client) {
      const redirectionUrl = route.fullPath;
      localStorage.setItem('redirection_url', redirectionUrl);
    }
  };

  const showDropdown = ref(false);

  const closeDropdown = () => {
    showDropdown.value = false;
  };

  const toggleDropdown = () => {
    showDropdown.value = !showDropdown.value;
  };

  const userLogOut = async () => {
    closeDropdown();

    await bgGetRequest({
      params: '',
      lang: langCode.value,
      api: 'logout'
    });

    logUserOut();
    emptyCartProduct();

    const route = useRoute();

    const isAuthPage = route.meta.middleware.findIndex(i => {
      return i === 'auth'
    });
    if (isAuthPage > -1) {
      return navigateTo('/');
    }
  };

  const {setLocale} = useI18n();

  const selectedLanguage = (data) => {
    setLocale(data.key);
    document.cookie = 'currentLanguage=' + data.key + '; path=/; max-age=' + 365 * 60 * 60 * 24;
    location.reload();
  };

  const headerSticky = ref(false);
  const topBannerLoaded = ref(false);
  const isTopBannerClosed = ref(false);
  const searchPopup = ref(false);
  const searchFocused = ref(false);
  const searchedText = ref('');

  const {status} = useConstants();
  const {getImageURL, getUrl, getTitle} = useUtils();

  const isXSmallerDevice = computed(() => {
    return window.innerWidth <= 576;
  });

  const headerLeft = computed(() => {
    return headerLinks.value?.left || [];
  });

  const headerRight = computed(() => {
    return headerLinks.value?.right || [];
  });

  const isPublic = computed(() => {
    return parseInt(topBanner.value?.status) === status.PUBLIC;
  });

  const cartCountCom = computed(() => {
    return profile.value?.cart_count;
  });

  const username = computed(() => {
    return profile.value?.name?.split(' ')[0];
  });

  const email = computed(() => {
    return setting.value?.email;
  });

  const phone = computed(() => {
    return setting.value?.phone;
  });

  const sellerSignUp = computed(() => {
    return setting.value?.vendor_registration;
  });

  watch(cartCountCom, (value) => {
    setCartCount(value);
  })

  watch(searchedText, () => {
    if (!searchPopup.value && searchFocused.value) {
      setSearchedSuggestion();
      openSearchPopup();
    }
  });


  const handleIntersection = (entries) => {
    entries.forEach((entry) => {
      headerSticky.value = !entry.isIntersecting;
    });
  };

  const closeTopBanner = () => {
    const topBannerClosed = useCookie('topBannerClosed', {
      maxAge: 60 * 60 * 24 * 7 * 30,
      path: '/',
      secure: true
    });

    topBannerClosed.value = true;
    isTopBannerClosed.value = true;
  };

  const openSearchPopup = () => {
    if (searchedText.value.length > 0) {
      searchPopup.value = true;
    }
    searchFocused.value = true;
  };

  const blurSearchInput = () => {
    searchFocused.value = false;
    closeSearchPopup();
  };

  const closeSearchPopup = () => {
    setTimeout(() => {
      searchPopup.value = false;
    }, 100);
  };

  const setQFromRoute = () => {
    searchedText.value = route?.query?.q || '';
  };

  const search = () => {
    if (searchedText.value && (searchedText.value !== searched.value || route.name !== 'search')) {
      router.push({path: `/search?q=${searchedText.value}`});
      updateSearch(searchedText.value);
    }
  };

  const headerWrapperRef = ref(null);
  let observer = null;

  const topBannerClosed = useCookie('topBannerClosed');

  if (topBannerClosed.value !== null) {
    isTopBannerClosed.value = topBannerClosed.value;
    topBannerLoaded.value = true;
  } else {
    isTopBannerClosed.value = false;
    topBannerLoaded.value = true;
  }

  onMounted(async () => {
    setQFromRoute();
    updateSearch(searchedText.value);
    if (cartCountCom.value) {
      setCartCount(cartCountCom.value);
    }

    await nextTick();

    let rootMargin = '0px 0px 0px 0px';

    if (isXSmallerDevice.value) {
      rootMargin = '40px 0px 0px 0px';
    }

    observer = new IntersectionObserver(handleIntersection, {
      root: null,
      rootMargin: rootMargin,
      threshold: 0,
    });
    observer.observe(headerWrapperRef.value);
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect();
    }
  });
</script>

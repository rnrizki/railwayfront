<template>
    <div class="body-bg" :class="routeName">
        <section class="section">
            <div class="container">

                <div class="center-text mb-30 mb-sm-15">
                    <nuxt-link to="/">
                        <img class="mx-h-55x"
                             :src="getImageURL(site_setting.header_logo)"
                             :alt="$t('footer.siteLogo')"
                             height="40"
                             width="139"
                        >
                    </nuxt-link>
                </div>

                <div class="user-form">
                    <h4 class="mb-15 bold">
                        {{ $t('empty.welcome', {name: site_setting.site_name }) }}
                    </h4>
                    <slot/>
                    <h5 v-if="facebookLogin || googleLogin"
                        class="bold mtb-15 center-text"
                    >
                        {{ $t('empty.or') }}
                    </h5>
                    <div class="flex flex-xs gap-10">

                        <button
                                v-if="facebookLogin"
                                aria-label="submit"
                                class="flex flex-1 gap-5 primary-btn facebook-btn"
                                @click.prevent="loginWith('facebook')"
                        >
                            <i class="icon facebook-icon"/>
                            {{ $t('empty.loginFacebook') }}
                        </button>

                        <button v-if="googleLogin"
                                aria-label="submit"
                                class="flex flex-1 gap-5 primary-btn google-btn"
                                @click.prevent="loginWith('google')"
                        >
                            <i class="icon google-icon"/>
                            {{ $t('empty.loginGoogle') }}
                        </button>
                    </div>
                    <p class="mt-20 mt-sm-15 f-9 plr-40">
                        {{ $t('empty.agreement') }}
                        <nuxt-link :to="pageLink({slug: 'privacy-policy'})"
                                   class="link"
                        >
                            {{ $t('empty.privacyPolicy') }}
                        </nuxt-link>
                        .
                    </p>
                </div>

                <p class="ptb-15 mt-30 mt-sm-15 b-t center-text">
                    © {{ current_year }} - {{ site_setting.copyright_text }}
                </p>
            </div>
        </section>
        <transition name="fade" mode="out-in">
            <ToastMessage
                    v-if="toastMessageStatus"
                    :is-error="toastError"
                    @hide="hideToast"
                    :message="toastMessage"
            />
        </transition>
    </div>
</template>

<script setup>
    import json from '~/jsConfig.json'
    import {useUtils} from "~/composables/useUtils";
    import {useLanguageStore} from "~/store/language";
    import {useCommonStore} from "~/store/common";
    import {useRuntimeConfig} from "nuxt/app";
    import {onMounted} from "vue";

    const languageStore = useLanguageStore();
    const {currentLanguage} = storeToRefs(languageStore);

    const commonStore = useCommonStore();
    const {site_setting, setting, toastMessage, toastError, toastMessageStatus, current_year} = storeToRefs(commonStore);
    const {hideToast} = commonStore;

    const route = useRoute();

    const googleLogin = computed(() => {
        return setting.value?.google_login;
    });

    const facebookLogin = computed(() => {
        return setting.value?.facebook_login;
    });

    const routeName = computed(() => {
        return route?.name?.split('___')[0] || 'error';
    });

    const {pageLink, getImageURL} = useUtils();

    const loginWith = (service) => {
        window.location.href = socialRedirect(service);
    };

    const socialRedirect = (service) => {
        const config = useRuntimeConfig();
        const baseUrl = config.public.apiBase;

        const apiBase = !baseUrl.trim() ? window.location.origin + '/' : baseUrl;
        return apiBase + json.api.url + json.api.socialLogin + '/' + service;
    };

    onMounted(() => {
        document.body.classList.add(currentLanguage.value?.direction || 'ltr');

        if (site_setting.value?.primary_color) {
            document.documentElement.style.setProperty('--primary-color', site_setting.value.primary_color);
            document.documentElement.style.setProperty('--primary-hover-color', site_setting.value.primary_hover_color);
        }
    });

</script>

<template>
    <form @submit.prevent="formSubmit">
        <ul
                class="error-list mb-15"
                v-if="errors.length"
        >
            <li class="mb-10">
                {{ $t('forgotPassword.errorOccurred') }}
            </li>
            <li
                    v-for="(value, index) in errors"
                    :key="index"
            >
                {{ value }}
            </li>
        </ul>

        <div
                class="input-wrap"
                :class="{invalid: !emailValid && hasFormError}"
        >
            <label>
                {{ $t('addressPopup.email') }}
            </label>
            <div class="icon-input">
                <i
                        class="icon email-icon"
                />
                <input
                        type="text"
                        :placeholder="$t('contact.your', { type: $t('contact.email') })"
                        v-model.trim="email"
                >
            </div>
            <span
                    class="error"
                    v-if="!email && hasFormError"
            >
        {{ $t('addressPopup.isRequired', {type: $t('addressPopup.email')}) }}
      </span>
            <span
                    class="error"
                    v-else-if="invalidEmail && hasFormError"
            >
        {{ $t('contact.invalidEmail') }}
      </span>
        </div>

        <div
                class="input-wrap"
                :class="{invalid: !passwordValid && hasFormError}"
        >
            <label>{{ $t('profile.password') }}</label>
            <password-field
                    :value="password"
                    @on-change="passwordChange"
            />
            <span
                    class="error"
                    v-if="!password && hasFormError"
            >
        {{ $t('addressPopup.isRequired', {type: $t('profile.password') }) }}
      </span>
            <span
                    class="error"
                    v-else-if="invalidPassword && hasFormError"
            >
        {{ $t('profile.invalidLength') }}
      </span>
        </div>

        <div class="no-space flex sided">
            <nuxt-link
                    to="/forgot-password"
                    class="link color-lite"
            >
                {{ $t('login.forgotPassword') }}
            </nuxt-link>

            <ajax-button
                    class="primary-btn plr-30 plr-sm-15"
                    :fetching-data="formSubmitting"
                    :loading-text="$t('login.loggingIn')"
            />
        </div>

        <div class="mt-20 mt-sm-15 mb-10">
            {{ $t('forgotPassword.noAccount') }}
            <nuxt-link
                    to="/register"
                    class="mlr-10 link bold color-primary"
            >
                {{ $t('forgotPassword.createAccount') }}
            </nuxt-link>
        </div>
    </form>
</template>
<script setup>

    import {useUserStore} from "~/store/user";
    import {useLanguageStore} from "~/store/language";
    import {useCommonStore} from "~/store/common";
    import {useAuthStore} from "~/store/auth";
    import {onMounted} from "vue";
    import {useMetaData} from "~/composables/useMetaData";
    import {useValidationHelper} from "~/composables/useValidationHelper";
    import {storeToRefs} from "pinia";
    import {navigateTo} from "nuxt/app";

    definePageMeta({
        middleware: ['common-middleware', 'non-auth'],
        layout: 'empty',
    });

    const commonStore = useCommonStore()
    const {customScripts, site_setting} = storeToRefs(commonStore)
    const {unAuthPost, getRequest} = commonStore

    const email = ref('');
    const password = ref('');

    const userStore = useUserStore()
    const {setProfile, getUserToken} = userStore

    const authStore = useAuthStore()
    const {setToken} = authStore;

    const passwordChange = (evt) => {
        password.value = evt
    };

    const {t} = useI18n();
    const {pageMeta} = useMetaData();

    useHead(pageMeta({
        ...site_setting.value,
        ...{meta_title: `${t('header.login')} | ${site_setting.value.meta_title}`}
    }));


    const languageStore = useLanguageStore()
    const {langCode} = storeToRefs(languageStore)

    const redirectionUrl = ref('');


    onMounted(() => {
        redirectionUrl.value = localStorage.getItem('redirection_url', '')
    });


    const hasFormError = ref(false);
    const errors = ref([]);
    const formSubmitting = ref(false);

    const {isValidEmail, isValidLength} = useValidationHelper();

    const invalidEmail = computed(() => {
        return !isValidEmail(email.value)
    });

    const emailValid = computed(() => {
        return email.value && !invalidEmail.value
    });

    const invalidPassword = computed(() => {
        return !isValidLength(password.value)
    });

    const passwordValid = computed(() => {
        return password.value && !invalidPassword.value
    });


    const formSubmit = async () => {
        errors.value = [];

        if (email.value && password.value && !invalidPassword.value) {
            formSubmitting.value = true;

            const loggedData = await unAuthPost({
                params: {
                    user_token: await getUserToken(),
                    password: password.value,
                    email: email.value
                },
                lang: langCode.value,
                api: 'login'
            });

            if (loggedData.status === 200) {
                setToken(loggedData.data.token)
                const data = await getRequest({
                    params: '',
                    lang: langCode.value,
                    api: 'profile'
                });

                if (data?.status === 200) {
                    hasFormError.value = false;

                    setProfile(data.data);
                    return navigateTo(redirectionUrl.value || '/');

                } else {
                    errors.value = data?.data?.form
                }
            } else {
                errors.value = loggedData?.data?.form
            }
            formSubmitting.value = false
        } else {
            hasFormError.value = true
        }
    }
</script>

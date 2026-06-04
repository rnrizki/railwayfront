<template>
    <div>
        <form @submit.prevent="formSubmit" v-if="!emailSubmitted || !passwordUpdated">

            <ul class="error-list mb-15" v-if="errors.length">
                <li class="mb-10">
                    {{ $t('forgotPassword.errorOccurred') }}
                </li>
                <li v-for="(value, index) in errors" :key="index">{{ value }}</li>
            </ul>

            <div class="input-wrap" :class="{invalid: !emailValid && hasFormError}">
                <label>
                    {{ $t('addressPopup.email') }}
                </label>

                <div class="icon-input">
                    <i
                            class="icon email-icon"
                    />
                    <input
                            type="text"
                            v-model="email"
                            :placeholder="$t('contact.your', { type: $t('contact.email') })"
                    >
                </div>

                <span
                        class="error"
                        v-if="!email && hasFormError"
                >
          {{ $t('addressPopup.isRequired', {type: $t('addressPopup.email') }) }}
        </span>
                <span
                        class="error"
                        v-else-if="invalidEmail && hasFormError"
                >
          {{ $t('contact.invalidEmail') }}
        </span>
            </div>
            <template v-if="emailSubmitted">
                <div class="input-wrap" :class="{invalid: !code && hasFormError}">
                    <label>
                        {{ $t('forgotPassword.code') }}
                    </label>

                    <div class="icon-input">
                        <i
                                class="icon code-icon"
                        />
                        <input
                                type="text"
                                v-model="code"
                                :placeholder="$t('forgotPassword.codeFrom')"
                        >
                    </div>

                    <span
                            class="error"
                            v-if="!code && hasFormError"
                    >
            {{ $t('addressPopup.isRequired', {type: $t('forgotPassword.code') }) }}
            Code is Required
          </span>
                </div>

                <div
                        class="input-wrap"
                        :class="{invalid: !passwordValid && hasFormError}"
                >
                    <label>
                        {{ $t('profile.password') }}
                    </label>

                    <password-field
                            :value="password"
                            @on-change="password = $event"
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

                <div
                        class="input-wrap"
                        :class="{invalid: (!passwordValid || confirmPassword !== password)  && hasFormError}"
                >
                    <label>
                        {{ $t('profile.confirmPassword') }}
                    </label>

                    <password-field
                            :value="confirmPassword"
                            @on-change="confirmPassword = $event"
                    />

                    <span
                            class="error"
                            v-if="!confirmPassword && hasFormError"
                    >
            {{ $t('addressPopup.isRequired', {type: $t('profile.password') }) }}
          </span>
                    <span
                            class="error"
                            v-else-if="confirmPassword !== password && hasFormError"
                    >
            {{ $t('profile.noMatch') }}
          </span>
                </div>
            </template>

            <div class="flex right no-space">
                <ajax-button
                        class="primary-btn plr-20 w-50"
                        :fetching-data="formSubmitting"
                        :loading-text="$t('checkoutRight.submitting')"
                >
                    {{ $t('ajaxButton.submit') }}
                </ajax-button>
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

        <div v-else-if="emailSubmitted && passwordUpdated">
            <h4 class="mb-15 bold">{{ $t('contact.success') }}!!!</h4>
            <p class="mb-15">
                <b>{{ $t('forgotPassword.congratulations') }}</b>.
                {{ $t('forgotPassword.verified') }}
            </p>
            <p class="mb-15">
                {{ $t('forgotPassword.youCan') }}
                <nuxt-link
                        to="/login"
                        class="mlr-10 link bold color-primary"
                >
                    {{ $t('forgotPassword.signIn') }}
                </nuxt-link>
                {{ $t('contact.now') }}.
            </p>
        </div>
    </div>
</template>
<script setup>
    import {useLanguageStore} from "~/store/language";
    import {useCommonStore} from "~/store/common";
    import {storeToRefs} from "pinia";
    import {useMetaData} from "~/composables/useMetaData";
    import {useValidationHelper} from "~/composables/useValidationHelper";

    definePageMeta({
        middleware: ['common-middleware', 'non-auth'],
        layout: 'empty',
    });

    const languageStore = useLanguageStore();
    const {langCode} = storeToRefs(languageStore);

    const commonStore = useCommonStore();
    const {unAuthPost, setToastMessage} = commonStore;
    const {customScripts, site_setting} = storeToRefs(commonStore);

    const {t} = useI18n();
    const {pageMeta} = useMetaData();

    useHead(pageMeta({
      ...site_setting.value,
      ...{meta_title: `${t('login.forgotPassword')} | ${site_setting.value.meta_title}`}
    }));

    const email = ref('');
    const password = ref('');
    const code = ref('');
    const confirmPassword = ref('');
    const errors = ref([]);
    const hasFormError = ref(false);
    const formSubmitting = ref(false);
    const emailSubmitted = ref(false);
    const passwordUpdated = ref(false);

    watch(email, () => {
        if (!invalidEmail.value) {
            hasFormError.value = false
        }
    });

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
        if (!emailSubmitted.value && email.value) {
            if (email.value) {
                formSubmitting.value = true

                const response = await unAuthPost({
                    params: {
                        email: email.value
                    },
                    lang: langCode.value,
                    api: 'forgotPassword'
                });

                if (response.status === 200) {
                    setToastMessage(t('forgotPassword.sentEmail'));
                    emailSubmitted.value = true;
                    hasFormError.value = false;
                    errors.value = [];
                } else {
                    errors.value = response.data.form
                }
                formSubmitting.value = false
            } else {
                hasFormError.value = true
            }
        } else {
            if (code.value && email.value && password.value && (password.value === confirmPassword.value)) {
                formSubmitting.value = true

                const response = await unAuthPost({
                    params: {
                        email: email.value,
                        code: code.value,
                        password: password.value
                    },
                    lang: langCode.value,
                    api: 'updatePassword'
                });

                if (response.status === 200) {
                    passwordUpdated.value = true
                    hasFormError.value = false
                    errors.value = []
                } else {
                    errors.value = response.data.form
                }

                formSubmitting.value = false
            } else {
                hasFormError.value = true
            }
        }
    };



</script>

<template>
    <div>
        <form v-if="!emailVerificationForm && !verified"
              class="seller-form user-form"
              @submit.prevent="formSubmit"
        >
            <div class="center-text mb-30">
                <h6>{{ $t('date.reg') }}</h6>
                <h1 class="mt-10 mb-20 color-primary">{{ $t('date.sr') }}</h1>
                <p>{{ $t('date.pm') }}</p>

            </div>

            <error-handler
                    :errors="errors"
            />

            <div class="input-wrap"
                 :class="{invalid: !name && hasFormError}"
            >
                <label>{{ $t('addressPopup.name') }}</label>

                <div class="icon-input">
                    <i class="icon user-icon"/>
                    <input
                            type="text"
                            v-model="name"
                            :placeholder="$t('contact.your', { type: $t('contact.name') })"
                    >
                </div>

                <span class="error"
                      v-if="!name && hasFormError"
                >
                    {{ $t('addressPopup.isRequired', {type: $t('addressPopup.name') }) }}
                </span>
            </div>

            <div class="input-wrap"
                 :class="{invalid: !storeName && hasFormError}"
            >
                <label>{{ $t('date.sn') }}</label>

                <div class="icon-input">
                    <i class="icon user-icon"/>
                    <input
                            type="text"
                            v-model="storeName"
                            :placeholder="$t('date.sn')"
                    >
                </div>
                <span class="error"
                      v-if="!storeName && hasFormError"
                >
                    {{ $t('addressPopup.isRequired', {type: $t('date.sn') }) }}
                </span>
            </div>

            <div class="input-wrap"
                 :class="{invalid: !emailValid && hasFormError}"
            >
                <label>{{ $t('addressPopup.email') }}</label>

                <div class="icon-input">
                    <i class="icon email-icon"/>
                    <input type="text"
                           v-model="email"
                           :placeholder="$t('contact.your', { type: $t('contact.email') })"
                    >
                </div>

                <span class="error"
                      v-if="!email && hasFormError"
                >
                   {{ $t('addressPopup.isRequired', {type: $t('addressPopup.email') }) }}
                </span>
                <span class="error"
                      v-else-if="invalidEmail && hasFormError"
                >
                  {{ $t('contact.invalidEmail') }}
                </span>
            </div>

            <div class="input-wrap"
                 :class="{invalid: !passwordValid && hasFormError}"
            >
                <label>{{ $t('profile.password') }}</label>
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
                <span class="error"
                      v-else-if="invalidPassword && hasFormError"
                >
                   {{ $t('profile.invalidLength') }}
                </span>
            </div>

            <div class="input-wrap"
                 :class="{invalid: (!passwordValid || confirmPassword !== password)  && hasFormError}"
            >
                <label>
                    {{ $t('profile.confirmPassword') }}
                </label>
                <password-field
                        :value="confirmPassword"
                        @on-change="confirmPassword = $event"
                />
                <span class="error"
                      v-if="!confirmPassword && hasFormError"
                >
                    {{ $t('addressPopup.isRequired', {type: $t('profile.password') }) }}
                </span>
                <span class="error"
                      v-else-if="confirmPassword !== password && hasFormError"
                >
                    {{ $t('profile.noMatch') }}
                </span>
            </div>

            <div class="flex right no-space">
                <ajax-button
                        class="primary-btn plr-20 w-50"
                        :fetching-data="formSubmitting"
                        :loading-text="$t('forgotPassword.registering')"
                >
                    {{ $t('ajaxButton.submit') }}
                </ajax-button>
            </div>
        </form>

        <form class="seller-form user-form"
                @submit.prevent="verifyEmail"
                v-if="emailVerificationForm && !verified"
        >
            <div class="center-text mb-30">
                <h1 class="mt-10 mb-20 color-primary">Verification</h1>
                <p>{{ $t('register.sentEmail') }}</p>
            </div>

            <error-handler
                    :errors="errors"
            />

            <div class="input-wrap"
                 :class="{invalid: !code && hasFormError}"
            >
                <label>
                    {{ $t('forgotPassword.code') }}
                </label>
                <input type="text"
                       v-model="code"
                       :placeholder="$t('forgotPassword.codeFrom')"
                >
                <span class="error"
                        v-if="!code && hasFormError"
                >
           {{ $t('addressPopup.isRequired', {type: $t('forgotPassword.code') }) }}
        </span>
            </div>

            <div class="flex right no-space">
                <ajax-button
                        class="primary-btn plr-20 w-50"
                        :fetching-data="formSubmitting"
                        :loading-text="$t('checkoutRight.submitting')"
                >
                    {{ $t('ajaxButton.submit') }}
                </ajax-button>
            </div>
        </form>

        <div class="seller-form user-form"
             v-else-if="emailVerificationForm && verified"
        >

            <h1 class="mt-10 mb-20 color-primary">{{ $t('contact.success') }}!!!</h1>
            <p class="mb-15">
                <b>{{ $t('forgotPassword.congratulations') }}</b>.
                {{ $t('forgotPassword.verified') }}
            </p>
            <p class="mb-15">
                {{ $t('date.yw') }}
            </p>
            <p class="mb-15">
                <nuxt-link
                        to="/"
                        class="mlr-10 link bold color-primary"
                >
                    {{ $t('date.gh') }}

                </nuxt-link>
            </p>
        </div>

    </div>
</template>
<script setup>

    import {useCommonStore} from "~/store/common";
    import {useLanguageStore} from "~/store/language";
    import {storeToRefs} from "pinia";
    import {showError} from "nuxt/app";
    import {useMetaData} from "~/composables/useMetaData";
    import {onMounted} from "vue";
    import {useValidationHelper} from "~/composables/useValidationHelper";

    definePageMeta({
        middleware: ['common-middleware'],
        layout: 'default',
    });

    const commonStore = useCommonStore();
    const {unAuthPost} = commonStore;
    const {setting, customScripts, site_setting} = storeToRefs(commonStore);

    const languageStore = useLanguageStore();
    const {langCode} = storeToRefs(languageStore)

    const {pageMeta} = useMetaData();
    useHead(pageMeta(site_setting.value));

    const name = ref('');
    const email = ref('');
    const verified = ref(false);
    const code = ref('');
    const password = ref('');
    const storeName = ref('');
    const confirmPassword = ref('');
    const emailVerificationForm = ref(false);
    const formSubmitting = ref(false);
    const hasFormError = ref(false);
    const errors = ref([]);

    const {isValidEmail, isValidLength} = useValidationHelper();

    const invalidEmail = computed(() => {
        return !isValidEmail(email.value);
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

    const sellerSignUp = computed(() => {
        return setting.value?.vendor_registration
    });

    const verifyEmail = async () => {
        if (code.value) {
            formSubmitting.value = true

            const data = await unAuthPost({
                params: {
                    code: code.value,
                    email: email.value
                },
                lang: langCode.value,
                api: 'sellerVerify'
            })

            if (data?.status === 200) {
                verified.value = true
                hasFormError.value = false
                errors.value = []
            } else {
                errors.value = data?.data?.form
            }
            formSubmitting.value = false
        } else {
            hasFormError.value = true
        }
    };

    const formSubmit = async () => {
        if (name.value && email.value && password.value && (password.value === confirmPassword.value)) {
            formSubmitting.value = true

            const data = await unAuthPost({
                params: {
                    name: name.value,
                    store_name: storeName.value,
                    email: email.value,
                    password: password.value
                },
                api: 'sellerRegister'
            })

            if (data?.status === 200) {
                hasFormError.value = false
                errors.value = []
                emailVerificationForm.value = true
            } else {
                errors.value = data?.data?.form
            }

            formSubmitting.value = false
        } else {
            hasFormError.value = true
        }
    };

    onMounted(() => {
        if (!sellerSignUp.value) {
            showError({statusCode: 404, message: t('date.nf')});
        }
    });


</script>

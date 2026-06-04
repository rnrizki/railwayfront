<template>
    <client-only>

        <account-layout
                class="user-profile-wrapper"
                active-route="profile"
                :class="{'email-login': !loggedInWithEmail}"
        >
            <template v-slot:rightArea>

                <div class="card">
                    <h5 class="ptb-10 plr-20 plr-sm-15 b-b bold flex sided mlr-0">
                        {{ $t('accountLayout.myProfile') }}

                        <ajax-button
                                class="primary-btn plr-30 plr-sm-15"
                                type="button"
                                :fetching-data="deletingAccount"
                                @clicked="deleteAccount"
                                :text="$t('date.da')"
                        />
                    </h5>
                    <div class="flex wrap sided align-start p-20 pb-0 p-sm-15 pb-sm pb-xs">
                        <div>

                            <div class="input-wrap">
                                <label>
                                    {{ $t('addressPopup.email') }}
                                </label>
                                <span>{{ email }}</span>
                            </div>

                            <div class="input-wrap">
                                <label>
                                    {{ $t('orders.loggedWith') }}
                                </label>
                                <p>{{ loggedInWith }}</p>
                            </div>

                            <form class="user-form mt-20 mt-sm-15"
                                  @submit.prevent="updateUserProfile"
                            >
                                <p class="form-title">
                                    {{ $t('orders.updateProfile') }}
                                </p>

                                <div class="input-wrap"
                                     :class="{invalid: !name && hasProfileError}"
                                >
                                    <label>
                                        {{ $t('addressPopup.name') }}
                                    </label>
                                    <div class="icon-input">
                                        <i class="icon user-icon"/>
                                        <input
                                                type="text"
                                                v-model="name"
                                                :placeholder="$t('addressPopup.name')"
                                        >
                                    </div>
                                    <span class="error"
                                          v-if="!name && hasProfileError"
                                    >
                                    {{ $t('addressPopup.isRequired', { type: $t('addressPopup.name')}) }}
                                </span>
                                </div>

                                <div class="flex j-end m-0">
                                    <ajax-button
                                            class="primary-btn plr-30 plr-sm-15"
                                            :fetching-data="profileSubmitting"
                                            :text="$t('orders.updateProfile')"
                                    />
                                </div>
                            </form>
                        </div>

                        <div v-if="loggedInWithEmail">
                            <form class="user-form" @submit.prevent="updatePassword">
                                <p class="form-title">
                                    {{ $t('profile.updatePassword') }}
                                </p>

                                <error-handler
                                        class="left-text"
                                        :errors="updatePassError"
                                />

                                <div class="input-wrap"
                                     :class="{invalid: !currentPassword && hasPasswordError}"
                                >
                                    <label>
                                        {{ $t('profile.currentPassword') }}
                                    </label>
                                    <password-field
                                            :value="currentPassword"
                                            @on-change="setCurrentPass"
                                    />
                                    <span
                                            class="error"
                                            v-if="!currentPassword && hasPasswordError"
                                    >
                                    {{ $t('addressPopup.isRequired', {type: $t('profile.password') }) }}
                                </span>
                                </div>

                                <div class="input-wrap" :class="{invalid: !passwordValid && hasPasswordError}">
                                    <label>
                                        {{ $t('profile.password') }}
                                    </label>

                                    <password-field
                                            :value="newPassword"
                                            @on-change="setNewPass"
                                    />
                                    <span
                                            class="error"
                                            v-if="!newPassword && hasPasswordError"
                                    >
                     {{ $t('addressPopup.isRequired', {type: $t('profile.password') }) }}
                  </span>
                                    <span
                                            class="error"
                                            v-else-if="invalidPassword && hasPasswordError"
                                    >
                    {{ $t('profile.invalidLength') }}
                  </span>
                                </div>
                                <div class="input-wrap"
                                     :class="{invalid: (!passwordValid || confirmPassword !== newPassword)  && hasPasswordError}"
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
                                            v-if="!confirmPassword && hasPasswordError"
                                    >
                                     {{ $t('addressPopup.isRequired', {type: $t('profile.password') }) }}
                                  </span>
                                    <span class="error"
                                          v-else-if="confirmPassword !== newPassword && hasPasswordError"
                                    >
                                    {{ $t('profile.noMatch') }}
                                </span>
                                </div>
                                <div class="flex j-end m-0">
                                    <ajax-button
                                            class="primary-btn plr-30"
                                            :fetching-data="passwordSubmitting"
                                            :loading-text="$t('profile.updatingPassword')"
                                            :text="$t('profile.updatePassword')"
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </template>
        </account-layout>
    </client-only>
</template>

<script setup>

    import {useUserStore} from "~/store/user";
    import {useCartStore} from "~/store/cart";
    import {useCommonStore} from "~/store/common";
    import {storeToRefs} from "pinia";
    import {useAuthStore} from "../../store/auth";
    import {navigateTo} from "nuxt/app";
    import {useLanguageStore} from "~/store/language";
    import {useMetaData} from "~/composables/useMetaData";
    import {onMounted} from "vue";
    import {useValidationHelper} from "~/composables/useValidationHelper";

    definePageMeta({
        middleware: ['common-middleware', 'auth'],
        layout: 'default',
    });


    const userStore = useUserStore()
    const {profile} = storeToRefs(userStore)
    const {updateUserPassword, setProfile} = userStore

    const authStore = useAuthStore();
    const {logUserOut} = authStore;

    const cartStore = useCartStore()
    const {emptyCartProduct} = cartStore

    const commonStore = useCommonStore()
    const {setToastMessage, setToastError, deleteRequest, postRequest, bgGetRequest} = commonStore
    const {customScripts, site_setting} = storeToRefs(commonStore)


    const {pageMeta} = useMetaData();
    useHead(pageMeta(site_setting.value));


    const setCurrentPass = (event) => {
        currentPassword.value = event;
    };

    const setNewPass = (event) => {
        newPassword.value = event;
    };

    const languageStore = useLanguageStore();
    const {langCode} = storeToRefs(languageStore);

    const userLogOut = async (apiCall = true) => {

        if (apiCall) {
            await bgGetRequest({
                params: '',
                lang: langCode.value,
                api: 'logout'
            });
        }

        logUserOut();
        emptyCartProduct();
        return navigateTo('/');
    };

    const {t} = useI18n();

    const name = ref('');
    const email = ref('');
    const currentPassword = ref('');
    const updatePassError = ref([]);
    const newPassword = ref('');
    const confirmPassword = ref('');
    const hasProfileError = ref(false);
    const deletingAccount = ref(false);
    const hasPasswordError = ref(false);
    const profileSubmitting = ref(false);
    const passwordSubmitting = ref(false);

    watch(profile, (value) => {
        if (value) {
            email.value = value?.email
            name.value = value?.name
        }
    });


    const loggedInWithGoogle = computed(() => {
        return profile.value?.google_id;
    });

    const loggedInWithFacebook = computed(() => {
        return profile.value?.facebook_id;
    });

    const loggedInWithEmail = computed(() => {
        return !profile.value?.facebook_id && !profile.value?.google_id;
    });

    const loggedInWith = computed(() => {
        if (profile.value) {
            if (loggedInWithGoogle.value) {
                return t('profile.google')
            } else if (loggedInWithFacebook.value) {
                return t('profile.facebook')
            } else {
                return t('addressPopup.email')
            }
        }
    });

    const {isValidLength} = useValidationHelper();

    const invalidPassword = computed(() => {
        return !isValidLength(newPassword.value);
    });

    const passwordValid = computed(() => {
        return newPassword.value && !invalidPassword.value;
    });


    const deleteAccount = async () => {
        if (confirm(t('cartProductTile.deleteAlert'))) {
            deletingAccount.value = true;

            const data = await deleteRequest({
                api: 'deleteAccount',
                params: ''
            });
            deletingAccount.value = false;

            await userLogOut(false);

            if (data?.status === 200) {
                setToastMessage(data.message);
            } else {
                setToastError(data?.data?.form?.join(', '));
            }
        }
    };

    const updatePassword = async () => {
        updatePassError.value = [];

        if (currentPassword.value && newPassword.value && (newPassword.value === confirmPassword.value)) {
            passwordSubmitting.value = true
            const data = await postRequest({
                params: {
                    current_password: currentPassword.value,
                    new_password: newPassword.value
                },
                api: 'updateUserPassword',
                lang: langCode.value
            });

            if (data?.status === 201) {
                updatePassError.value = data.data.form;
            } else if (data?.status === 200) {
                await userLogOut();
                setToastMessage(data.message)
            }
            passwordSubmitting.value = false;
        } else {
            hasPasswordError.value = true;
        }
    };

    const updateUserProfile = async () => {
        if (name.value) {
            profileSubmitting.value = true;

            const data = await postRequest({
                params: {name: name.value},
                api: 'updateProfile',
                lang: langCode.value
            });

            profileSubmitting.value = false
            if (data?.status === 201) {
                setToastError(data?.data?.form?.join(', '));

            } else if (data?.status === 200) {
                const updatedUser = {}
                updatedUser.name = data.data.name;
                setProfile(updatedUser);
                setToastMessage(data.message);
            }
        } else {
            hasProfileError.value = true;
        }
    };


    onMounted(() => {
        if (profile.value) {
            email.value = profile.value?.email
            name.value = profile.value?.name
        }
    });
</script>

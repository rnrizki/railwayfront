<template>
    <div class="container-fluid mtb-20 mtb-sm-15">

        <div class="product-detail checkout-detail">
            <div class="area detail-left pt-10 plr-20 plr-sm-15 pb-20 pb-sm-15 mr-20 mr-sm mb-sm-15">
                <h5 class="b-b pb-10 mb-15 bold">
                    {{ $t('checkout.selectPayment') }}
                </h5>
                <payment-gateways
                        v-if="paymentGateway && totalPrice"
                        ref="paymentGateways"
                        :total-price="totalPrice"
                        :voucher="voucherResult"
                />
            </div>
            <checkout-right
                    route-link="checkout"
                    :checked-product="checkedProduct"
                    :has-shipping="true"
                    :voucher-result="voucherResult"
                    :hide-btn="true"
                    @calculated-price="calculatedPrice"
            >
                <template v-slot:checkout>
                    <div :class="{invalid: !!voucherError}">
                        <form class="mt-15 btn-input">
                            <input
                                    class="pl-15 pr-80"
                                    :placeholder="$t('checkout.voucherCode')"
                                    type="text"
                                    v-model="voucher">

                            <ajax-button
                                    class="primary-btn plr-15"
                                    type="button"
                                    :fetching-data="submitting"
                                    loading-text=""
                                    :disabled="!voucher || !!voucherError || !!voucherResult"
                                    :text="$t('checkout.apply')"
                                    @clicked="checkVoucher"
                            />
                        </form>
                    </div>
                    <span v-if="voucherError" class="error">
                        {{ voucherError }}
                    </span>
                </template>
            </checkout-right>
        </div>
    </div>
</template>
<script setup>

    import {useUserStore} from "~/store/user";
    import {useCommonStore} from "~/store/common";
    import {useLanguageStore} from "~/store/language";
    import {useCartStore} from "~/store/cart";
    import {storeToRefs} from "pinia";
    import {onBeforeMount} from "vue";
    import {useAuthStore} from "~/store/auth";
    import {useMetaData} from "~/composables/useMetaData";
    import {useConstants} from "~/composables/useConstants";
    import {onMounted} from "vue";

    definePageMeta({
        middleware: ['common-middleware'],
        layout: 'default',
    });


    const languageStore = useLanguageStore()
    const {langCode} = storeToRefs(languageStore)

    const commonStore = useCommonStore()
    const {currencyIcon, setting, currency, paymentGateway, customScripts, site_setting} = storeToRefs(commonStore)
    const {setToastMessage, setToastError, deleteRequest, getRequest, setPaymentGateway, postRequest} = commonStore

    const cartStoreStore = useCartStore()
    const {cartProducts} = storeToRefs(cartStoreStore)
    const {getCartByUser, subtractCartProductCount, emptyCartProduct} = cartStoreStore

    const userStore = useUserStore()
    const {userAddressAll, getUserToken} = userStore

    const {t} = useI18n();
    const {pageMeta, preloadScript} = useMetaData();

    let paymentMeta = '';

    const getPaymentMeta = ({paypal_key}) => {
        return {
            link: [
                preloadScript(`https://www.paypal.com/sdk/js?client-id=${paypal_key}&components=buttons,marks&disable-funding=paylater,card`),
                preloadScript('https://checkout.flutterwave.com/v3.js')
            ]
        }
    };

    if (paymentGateway.value) {
        paymentMeta = getPaymentMeta(paymentGateway.value);
    }

    useHead({
        ...pageMeta({
            ...site_setting.value,
            ...{meta_title: `${t('header.checkout')} | ${site_setting.value.meta_title}`}
        }),
        ...paymentMeta
    });

    const authStore = useAuthStore();
    const {authenticated} = storeToRefs(authStore);

    onBeforeMount(async () => {
        if (!setting.value?.guest_checkout) {
            if (!authenticated.value) {
                return navigateTo('/login');
            }
        }
        if (!paymentGateway.value) {
            const data = await getRequest({
                params: '',
                api: 'paymentGateway',
                lang: langCode.value
            });

            setPaymentGateway(data.data);
            useHead(getPaymentMeta(data.data));
        }
    });


    const loading = ref(false);
    const voucher = ref('');
    const voucherError = ref(null);
    const voucherResult = ref(null);
    const submitting = ref(false);
    const placingOrder = ref(false);
    const cartPrice = ref(0);
    const checkedProductQty = ref(0);


    watch(voucher, () => {
        voucherResult.value = null
        voucherError.value = null
    });

    const {status} = useConstants();

    const productPrice = computed(() => {
        return cartPrice.value.totalPriceWithOffer + cartPrice.value.shippingPrice + cartPrice.value.tax
    });

    const totalPrice = computed(() => {
        if (productPrice.value) {
            return productPrice.value - cartPrice.value.voucher
        }
        return 0
    });

    const checkedProduct = computed(() => {
        return cartProducts.value.filter(obj => {
            return parseInt(obj.selected) === 1
        })
    });

    const checkVoucher = async () => {
        submitting.value = true
        const res = await postRequest({
            params: {
                voucher: voucher.value,
                user_token: await getUserToken(),
                price: cartPrice.value?.totalPriceWithOffer
            },
            lang: langCode.value,
            api: 'voucherValidity'
        })
        submitting.value = false
        if (res?.status === 201) {
            voucherError.value = res.data.form[0]
        } else {
            voucherResult.value = res.data
        }
    };

    const calculatedPrice = (evt) => {
        cartPrice.value = evt
    };


    onMounted(async () => {
        voucherError.value = null
        voucherResult.value = null

        if (cartProducts.value.length === 0) {
            await getCartByUser({
                lang: langCode.value,
                params: {
                    user_token: await getUserToken()
                }
            })
        }
    });


</script>

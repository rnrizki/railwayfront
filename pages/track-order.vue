<template>
    <client-only>
        <div class="mtb-20 pb-30">
            <div class="container">
                <breadcrumb
                        :page="pageTitle"
                />

                <div class="track-container">
                    <div class="form-wrapper">

                        <h1 class="page-title mt-10">{{$t('trackOrder.trackOrder')}}</h1>
                        <p class="mt-10 mb-30 mb-sm-15 f-12">{{$t('trackOrder.haveAnOrder')}}</p>
                        <form
                                class="track-form user-form"
                                @submit.prevent="formSubmit"
                        >
                            <ul
                                    class="error-list mb-15"
                                    v-if="errors.length"
                            >
                                <li>
                                    {{ $t('forgotPassword.errorOccurred') }}
                                </li>
                                <li
                                        v-for="(value, index) in errors"
                                        :key="index"
                                >
                                    {{ value }}
                                </li>
                            </ul>

                            <h4 class="mb-30 mb-sm-15"><b>{{$t('trackOrder.enterCode')}}</b></h4>


                            <div
                                    class="input-wrap"
                                    :class="{invalid: !trackingId && hasFormError}"
                            >
                                <label>{{ $t('addressPopup.order') }}</label>

                                <div class="icon-input">
                                    <i
                                            class="icon order-icon"
                                    />
                                    <input
                                            type="text"
                                            v-model="trackingId"
                                            :placeholder="$t('contact.your', { type: $t('addressPopup.order') }) + '. eg. 20230704N2H5X2'"
                                    >
                                </div>

                                <span
                                        class="error"
                                        v-if="!trackingId && hasFormError"
                                >
                                  {{ $t('addressPopup.isRequired', {type: $t('addressPopup.order') }) }}
                                </span>
                            </div>


                            <h6 class="mb-30 mb-sm-15">{{$t('trackOrder.knowProgress')}}</h6>

                            <div ref="submitBtn" class="flex right no-space">
                                <ajax-button
                                        class="primary-btn plr-20 w-50"
                                        :fetching-data="formSubmitting"
                                        :loading-text="$t('forgotPassword.registering')"
                                >
                                    {{ $t('ajaxButton.submit') }}
                                </ajax-button>
                            </div>
                        </form>
                    </div>

                    <div class="img-wrap">
                        <img src="~/assets/images/track-order.png"
                             alt="Error image"
                                height="50"
                                width="50"
                        >
                    </div>
                </div>

                <div v-if="order"
                     class="tracked-result"
                >

                    <h3 class="mb-20 mt-20">{{ $t('trackOrder.orderStatus')}}</h3>
                    <ordered-status
                            class="mb-30 mt-20"
                            :status-of-order="order.status"
                    />

                    <div class="delivery-container">
                        <h3 class="mb-20">{{$t('trackOrder.estimatedDelivery')}}</h3>
                        <div>
                            <div v-for="(value) in order.ordered_products"
                                 class="ordered-product mb-20"
                            >
                                <h5>
                                    <nuxt-link
                                            :to="productLink(value.product)"
                                            class="title"
                                            :title="value.product.title"
                                    >
                                        {{ value.product.title }}
                                    </nuxt-link>
                                </h5>
                                <h5>{{$t('trackOrder.estimated')}}: <b>{{ value.delivery }}</b></h5>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    </client-only>
</template>

<script setup>

    import moment from 'moment'
    import {useLanguageStore} from "~/store/language";
    import {useCommonStore} from "~/store/common";
    import {prepareGetUrl} from "../utils/fetchClient";
    import {nextTick} from "vue";
    import {useMetaData} from "~/composables/useMetaData";

    definePageMeta({
        middleware: ['common-middleware'],
        layout: 'default',
    });

    const commonStore = useCommonStore();
    const {customScripts, site_setting} = storeToRefs(commonStore);
    const {unAuthPost} = commonStore;

    const {t} = useI18n();
    const {pageMeta} = useMetaData();

    useHead(pageMeta({
        ...site_setting.value,
        ...{meta_title: `${t('header.trackOrder')} | ${site_setting.value.meta_title}`}
    }));

    const languageStore = useLanguageStore();
    const {langData, currentLanguage, langCode} = storeToRefs(languageStore);

    const formSubmitting = ref(false);
    const hasFormError = ref(false);
    const errors = ref([]);
    const order = ref(null);
    const trackingId = ref(null);

    const pageTitle = computed(() => {
        return t('header.trackOrder')
    });

    const estimatedDelivery = () => {
        order.value.ordered_products.forEach(i => {
            let newDate = moment(order.value.created_at, "YYYY-MM-DD").add(i.shipping_place.day_needed, 'days')
            const diff = moment().diff(newDate, 'days')
            if (diff >= 0) {
                newDate = moment().add(1, 'days')
            }

            const mon = newDate.format('MMM').toLowerCase()
            const date = newDate.format('DD')
            const year = newDate.format('YYYY')

            i['delivery'] = t('date.MMMDDYYYY', {mon: t(`date.${mon}`), date: date, year: year})
        })

        return order.value
    };

    const submitBtn = ref(null);

    const formSubmit = async () => {
        if (trackingId.value) {
            formSubmitting.value = true

            const data = await unAuthPost({
                params: `?${prepareGetUrl({
                    tracking_id: trackingId.value
                })}`,
                lang: langCode.value,
                api: 'trackOder'
            })

            if (data?.status === 200) {
                hasFormError.value = false
                errors.value = []
                order.value = data.data

                estimatedDelivery();
                await nextTick();

                const el = submitBtn.value;
                if (el) {
                    el.scrollIntoView({behavior: "smooth"});
                }

            } else {
                errors.value = data?.data?.form
            }
            formSubmitting.value = false

        } else {
            hasFormError.value = true
        }
    };

</script>

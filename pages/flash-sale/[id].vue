<template>
    <client-only>
        <div class="container-fluid mtb-20 mtb-sm-15">
            <div class="flash-list">
                <div class="tile-container" v-if="!currentItems">
                    <div class="shimmer-wrapper">
                        <tile-shimmer
                                v-for="index in shimmerCount.FLASH_SALE"
                                :key="index"
                        />
                    </div>
                </div>
                <div class="pos-rel" v-else>

                    <div
                            class="spinner-wrapper flex layer-white"
                            v-if="fetchingProductData"
                    >
                        <spinner
                                :radius="100"
                        />
                    </div>

                    <div
                            v-if="currentItems && !currentItems.length"
                            class="info-msg"
                    >
                        {{ $t('listingLayout.noProductFound') }}
                    </div>

                    <div v-else class="tile-container">
                        <flash-product-tile
                                v-for="(value, index) in currentItems"
                                :key="value.id"
                                :flash-product="value"
                                class="p-tile"
                        />
                    </div>

                    <pagination
                            :total-page="totalPage"
                    />
                </div>
            </div>

        </div>
    </client-only>
</template>

<script setup>

    import {useLanguageStore} from "~/store/language";
    import {useFlashSaleStore} from "~/store/flashSale";
    import {useCommonStore} from "~/store/common";
    import {storeToRefs} from "pinia";
    import {prepareGetUrl} from "../../utils/fetchClient";
    import {useMetaData} from "../../composables/useMetaData";
    import {onMounted} from "vue";
    import {useConstants} from "../../composables/useConstants";

    definePageMeta({
        middleware: ['common-middleware'],
        layout: 'default',
    });


    const {shimmerCount} = useConstants();

    const commonStore = useCommonStore();
    const {customScripts, site_setting} = storeToRefs(commonStore);
    const {unAuthGet} = commonStore;

    const languageStore = useLanguageStore();
    const {langCode} = storeToRefs(languageStore);

    const flashSaleStore = useFlashSaleStore();
    const {products} = storeToRefs(flashSaleStore);
    const {emptyFlashProducts, setFlashProducts} = flashSaleStore;

    const {pageMeta} = useMetaData();
    useHead(pageMeta(site_setting.value));

    const activate = ref(false);
    const fetchingProductData = ref(false);

    const route = useRoute();

    const currentItems = computed(() => {
        return products.value?.data || null
    });

    const totalPage = computed(() => {
        return products.value?.last_page
    });
    const flashId = computed(() => {
        return route?.params?.id
    });

    const fetchingData = async () => {
        fetchingProductData.value = true
        const data = await unAuthGet({
            api: 'flashProducts',
            lang: langCode.value,
            params: `/${flashId.value}?${prepareGetUrl({
                id: flashId.value,
                page: Number(route.query.page) || 1,
            })}`
        });
        setFlashProducts(data?.data);
        fetchingProductData.value = false
    };

    onMounted(async () => {
        emptyFlashProducts();
        await fetchingData();
    });
</script>

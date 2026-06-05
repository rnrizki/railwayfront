<template>
    <div>
        <div class="container-fluid">
            <home-hero
                    :slider="slider"
                    class="home-section"
            />

            <static-section
                    v-if="hasSiteFeatures"
                    :site-features="siteFeatures"
            />

            <flashSale
                    :flash-sales="flashSales"
            />

            <product-banner
                    :banner-data="bannerData"
            />


            <products-slider
                    v-for="(value, index) in productCollection"
                    :key="index"
                    :collection="value"
            />

            <featured
                    class="category-wrapper"
                    :title="$t('searchPopup.categories')"
                    type="subCategory"
                    :item-list="featuredCategories"
            />
            <div class="brands-wrapper"
                    :class="{'full-screen': !featuredBanner}"
            >
                <div class="brands-inner"
                     v-if="featuredBrands"
                >
                    <BrandsFeatured
                            class="featured-brands"
                            :title="$t('listingLayout.brands')"
                            :item-list="featuredBrands"
                    />
                </div>

                <div class="brand-banner">
                    <banner v-if="featuredBanner"
                            :banner="featuredBanner"
                    />
                </div>
            </div>

            <div v-if="productGrid"
                 class="area home-section grid-product-wrapper">

                <div class="flex sided title">
                    <h4>{{ productGrid.title }}</h4>
                    <nuxt-link
                            class="link"
                            :to="collectionLink(productGrid)"
                    >
                        {{ $t('featured.showAll') }}
                    </nuxt-link>
                </div>

                <div class="search-product-tile">
                    <SearchedProductTile
                            v-for="(value, index) in productGrid.products"
                            :key="`prod-${index}`"
                            :product="value"
                    />
                    </div>
            </div>

            <banner
                    v-if="banner5"
                    class="home-section mb-0 br-primary flow-hidden"
                    :banner="banner5"
            />

            <LoadSection
                    v-slot="{renderArea}"
                    class="mn-h-400x"
            >
                <discover
                        v-if="renderArea"
                />
            </LoadSection>

            <banner
                    v-if="banner6"
                    class="home-section mt-0 br-primary flow-hidden"
                    :banner="banner6"
            />
        </div>
    </div>
</template>

<script setup>

    import {useHomeStore} from "~/store/home";
    import {useCommonStore} from "~/store/common";
    import {storeToRefs} from "pinia";
    import {useLanguageStore} from "~/store/language";
    import {useAsyncData} from "nuxt/app";
    import {useUtils} from "~/composables/useUtils";
    import {useMetaData} from "~/composables/useMetaData";
    import {useConstants} from "~/composables/useConstants";

    definePageMeta({
        middleware: ['common-middleware'],
        layout: 'default',
    });

    const languageStore = useLanguageStore();
    const {langCode} = storeToRefs(languageStore);


    const commonStore = useCommonStore();
    const {unAuthGet} = commonStore;
    const {topBanner} = storeToRefs(commonStore);

    const homeStore = useHomeStore();
    const {hasHomeData} = storeToRefs(homeStore);
    const {setHomeData} = homeStore;


    const {data, pending, error} = await useAsyncData('home', async () => {
        if (hasHomeData.value) {
            return null;
        }
        const response = await unAuthGet({api: 'home', params: '', lang: langCode.value});
        setHomeData(response);
        return response.data;
    }
        {
        getCachedData: (key) => null          // ← This forces fresh data (no cache)
    }                                             
                                                     
                                                     
                                                     );

    const {customScripts, site_setting} = storeToRefs(commonStore);
    const {pageMeta, preloadScript} = useMetaData();
    const {getImageURL, collectionLink} = useUtils();

    const {
        featuredCategories, flashSales, collections,
        featuredBrands, slider, banners, siteFeatures
    } = storeToRefs(homeStore);

    const heroMain = computed(() => {
        return slider.value.main[0];
    });

    const heroRightTop = computed(() => {
        return slider.value.right_top;
    });

    const heroRightBottom = computed(() => {
        return slider.value.right_bottom;
    });

    const getPreloadImages = computed(() => {
        return {
            link: [
                preloadScript(getImageURL(heroMain.value.image), 'image'),
                preloadScript(getImageURL(heroRightTop.value.image), 'image'),
                preloadScript(getImageURL(heroRightBottom.value.image), 'image'),
                preloadScript(getImageURL(topBanner.value.image), 'image'),
            ]
        }
    });

    useHead({
        ...pageMeta({
            ...site_setting.value,
            ...{image_url: getImageURL(site_setting.value.header_logo)}
        }),
        ...getPreloadImages.value
    });

    const hasSiteFeatures = computed(() => {
        return siteFeatures.value?.length
    });

    const banner5 = computed(() => {
        return bannerData.value?.banner5;
    });

    const banner6 = computed(() => {
        return bannerData.value?.banner6;
    });

    const featuredBanner = computed(() => {
        return bannerData.value?.banner1;
    });

    const productCollection = computed(() => {
        if (collections.value) {
            const col = [...collections.value];
            col?.pop();
            return col;
        }
        return [];
    });

    const productGrid = computed(() => {
        return collections.value?.slice(-1)?.pop();
    });

    const {bannerType} = useConstants();

    const bannerData = computed(() => {
        let banner = {
            banner1: null,
            banner2: null,
            banner3: null,
            banner4: null,
            banner5: null,
            banner6: null
        };

        banners.value?.forEach(i => {
            banner['banner' + bannerType['BANNER_' + i.type]] = i;
        });
        return banner;
    });

</script>


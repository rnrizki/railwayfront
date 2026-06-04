<template>
    <div class="mt-20 pb-30 pb-sm-20">

        <sitemap v-if="isSitemap"
                 :page-title="pageTitle"
                :page="page"
        />

        <component
                v-else-if="isPageFromComponent"
                :page-title="pageTitle"
                :is="currentComponent"
        />

        <div v-else
             class="mtb-20 mtb-sm-15 html-render"
        >
            <div class="container">
                <breadcrumb :page="pageTitle"/>
                <div class="editor"
                     v-dompurify-html="pageDescription"
                />
            </div>
        </div>
    </div>
</template>

<script setup>

    import Sitemap from "~/components/Sitemap";
    import {useLanguageStore} from "~/store/language";
    import {useCommonStore} from "~/store/common";
    import {storeToRefs} from "pinia";
    import {useAsyncData} from "nuxt/app";
    import {computed, defineAsyncComponent} from "vue";
    import {useMetaData} from "~/composables/useMetaData";
    import {useConstants} from "~/composables/useConstants";

    definePageMeta({
        middleware: ['common-middleware'],
        layout: 'default',
    })

    const commonStore = useCommonStore()
    const {customScripts, site_setting} = storeToRefs(commonStore)

    const route = useRoute();

    const languageStore = useLanguageStore()
    const {langCode} = storeToRefs(languageStore)

    const {data: page, pending, error} = await useAsyncData(`page-${route?.params?.slug}`, async () => {

        const {unAuthGet} = commonStore

        const response = await unAuthGet({
            api: 'page',
            params: `/${route?.params?.slug}`,
            lang: langCode.value
        });

        return response.data;
    });

    const {pageMeta} = useMetaData();

    useHead(pageMeta({
        meta_title: page.value?.meta_title,
        meta_description: page.value?.meta_description,
        meta_keywords: page.value?.meta_keywords,
        image_url: site_setting.value?.image_url
    }));

    const pageDescription = computed(() => {
        return page.value?.description || null
    });

    const currentComponent = computed(() => {
        return defineAsyncComponent(() => import(`@/components/${pageDescription.value}.vue`))
    });

    const allCategories = computed(() => {
        return page.value?.categories || null
    });

    const isSitemap = computed(() => {
        return page.value?.description === 'Sitemap'
    });

    const pageTitle = computed(() => {
        return page.value?.title || ''
    });

    const {status} = useConstants();

    const isPageFromComponent = computed(() => {
        return parseInt(page.value?.page_from_component) === parseInt(status.PUBLIC)
    });

</script>

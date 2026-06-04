<template>
    <client-only>
        <listing-layout
                :result-title="searchedKeyword"
                ref="productListElemRef"
        />
    </client-only>
</template>

<script setup>
    import {useListingStore} from "~/store/listing";
    import {useCommonStore} from "~/store/common";
    import {useMetaData} from "~/composables/useMetaData";
    import {onMounted} from "vue";

    definePageMeta({
        middleware: ['common-middleware'],
        layout: 'default',
    });

    const route = useRoute();
    const commonStore = useCommonStore();
    const {customScripts, site_setting} = storeToRefs(commonStore);

    const {pageMeta} = useMetaData();
    useHead(pageMeta(site_setting.value));

    const listingStore = useListingStore();
    const {searched} = storeToRefs(listingStore);
    const {emptyProducts} = listingStore;

    const productListElemRef = ref(null);

    watch(searched, async () => {
        try {
            productListElemRef.value.clearQuery();
            await productListElemRef.value.fetchingData();

        } catch (e) {
            console.log(e);
        }
    });

    const searchedKeyword = computed(() => {
        return route.query?.q || ''
    });

    const loadData = async () => {
        await productListElemRef.value.fetchingData();
    }

    onMounted(() => {
        emptyProducts()
    });

</script>

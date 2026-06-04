<template>
    <ajax-button
            :class="{'following': following}"
            type="button"
            :color="color"
            loading-text=" "
            :fetching-data="ajaxing"
            :text="followingText"
            @clicked="followStore"
    />
</template>

<script setup>
    import {useCommonStore} from "~/store/common";
    import {useAuthStore} from "../store/auth";
    import {computed} from "vue";

    const props = defineProps({
        color: {
            type: String,
            default: '',
        },
        storeId: {
            required: true
        },
        following: {
            type: Boolean,
            default: false
        }
    });

    const emit = defineEmits(['change-following']);

    const {color, storeId, following} = toRefs(props);

    const commonStore = useCommonStore()
    const {postRequest} = commonStore

    const authStore = useAuthStore();
    const {authenticated} = storeToRefs(authStore);

    const {t} = useI18n();

    const followingText = computed(() => {
        return following.value ? t('store.following') : t('store.follow');
    });

    const ajaxing = ref(false);

    const followStore = async () => {
        if (!authenticated.value) {
            return navigateTo('/login');
        }

        ajaxing.value = true
        const data = await postRequest({
            params: {
                store_id: storeId.value
            },
            api: 'followStore'
        });

        ajaxing.value = false;

        if (data.status === 200) {
            emit('change-following')
        }

    }

</script>

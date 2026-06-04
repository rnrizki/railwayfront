<template>
    <h5 class="toast-message" :class="{'error-toast': isError}">
        <span v-if="isError">{{ $t('toastMessage.error') }}!!!</span>
        {{message}}
    </h5>
</template>

<script setup>

  import {onMounted, toRefs} from "vue";

    const props = defineProps({
        message: {
            type: String,
            default: 'Success'
        },
        isError: {
            type: Boolean,
            default: false
        }
    });

    const {message, isError} = toRefs(props);

    const emit = defineEmits(['hide']);

    const timing = 5000;

    onMounted(() => {
        setInterval(function () {
            emit('hide')
        }, timing)
    })

</script>

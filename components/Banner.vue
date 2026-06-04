<template>

  <nuxt-link
    v-if="isPublic"
    :to="sourceUrl(banner, 'banner')"
    class="block banner-wrapper"
    @click.prevent="onClick"
  >
    <img
      :src="getImageURL(banner.image)"
      :alt="banner.title"
      height="100"
      width="500"
    >
    <button
      v-if="closable"
      aria-label="close"
      class="btn-banner-close"
      @click.prevent="onClose"
    >
      <i class="icon close-icon"/>
    </button>
  </nuxt-link>
</template>

<script setup>
  import {useConstants} from "~/composables/useConstants";
  import {useUtils} from "~/composables/useUtils";

  const props = defineProps({
    banner: {
      type: Object,
      default() {
        return null
      },
    },
  });

  const emit = defineEmits(['close', 'clicked']);

  const {banner} = toRefs(props);
  const {status} = useConstants();

  const {sourceUrl, getImageURL} = useUtils();

  const isPublic = computed(() => {
    return parseInt(banner.value?.status) === status.PUBLIC
  });

  const closable = computed(() => {
    return parseInt(banner.value?.closable) === status.PUBLIC
  });

  const onClose = () => {
    emit('close');
  };

  const onClick = () => {
    emit('clicked');
  };

</script>


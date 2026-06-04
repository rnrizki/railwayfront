<template>
  <button
    v-if="type === 'Submit'"
    class="ajax-btn"
    :aria-label="buttonText"
    :disabled="disable || disabled"
    :type="type"
  >
    <spinner
      v-if="fetchingData"
      :color="color"
      class="mr-15"
    />
    {{ buttonText }}
  </button>
  <button
    v-else
    @click.prevent="btnClicked"
    class="ajax-btn"
    :disabled="disable || disabled"
    :type="type"
    :aria-label="buttonText"
  >
    <spinner
      v-if="fetchingData"
      :color="color"
    />
    <span
      v-if="propLoadingText && fetchingData"
      class="ml-15"
    >
       {{ propLoadingText }}
    </span>
    <span
      v-else-if="!fetchingData"
    >
       {{ buttonText }}
    </span>

  </button>
</template>

<script setup>

  import {toRefs} from "vue";

  const props = defineProps({
    color: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: null
    },
    loadingText: {
      type: String,
      default: null
    },
    fetchingData: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'Submit',
    },
  });

  const emit = defineEmits(['clicked']);

  const { t } = useI18n();

  const {color, text, loadingText, fetchingData, disabled, type} = toRefs(props);

  const btnClicked = () => {
    if (props.type !== 'Submit') {
      emit('clicked')
    }
  };

  const buttonText = computed(() => {
    return text.value || t('ajaxButton.submit');
  });

  const propLoadingText = computed(() => {
    return loadingText.value || t('ajaxButton.gettingResponse');
  });

  const disable = computed(() => {
    return fetchingData.value
  });

</script>


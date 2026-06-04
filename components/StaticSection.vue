<template>
  <div
    class="flex wrap static-container mb-20 mb-sm-15"
  >
    <site-feature
      v-for="(value, i) in siteFeatures"
      :key="i"
      :site-feature="value"
    />
  </div>

</template>

<script setup>

  const props = defineProps({
    siteFeatures: {
      type: Array,
      default: []
    }
  });
</script>


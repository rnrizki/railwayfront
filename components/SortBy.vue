<template>
  <div class="flex gap-10">
    <span class="hide-sm">
      {{ $t('listingLayout.sortBy') }}
    </span>
    <client-only>
      <dropdown
        class="sort-dropdown"
        :options="sortingOptions"
        :selected-key="sortby"
        @clicked="selectedSorting"
      />
    </client-only>
  </div>

</template>

<script setup>

  import {computed, onMounted} from "vue";

  const emit = defineEmits(['fetching-data']);
  const {t} = useI18n();
  const route = useRoute();

  const filterPopup = ref(true);
  const sortingOptions = ref({
    featured: {title: t('featured.featured')},
    price_low_to_high: {title: t('listingLayout.priceLowToHigh')},
    price_high_to_low: {title: t('listingLayout.priceHighToLow')},
    avg_customer_review: {title: t('listingLayout.avgCustomerReview')},
  });
  const sortby = ref(route.query.sortby || '');

  const filteredCount = computed(() => {
    let count = 0
    if (route.query.shipping || '') {
      count++
    }
    if (route.query.rating || 0) {
      count++
    }
    if (route?.query?.min || 0) {
      count++
    }
    if (route?.query?.max || 0) {
      count++
    }
    return count
  });

  const isXsDevice = computed(() => {
    return window && window.innerWidth <= 576;
  });

  const openFilter = () => {
    filterPopup.value = true
    document.body.classList.add('no-scroll')
  };

  const closeFilter = () => {
    filterPopup.value = false
    document.body.classList.remove('no-scroll')
  };

  const selectedSorting = (data) => {
    if (sortby.value) {
      let filtered = Object.assign({}, route.query)
      filtered = {...filtered, ...{sortby: data.key}}
      emit('fetching-data', filtered)

    }
    sortby.value = data.key
  };

  const clearSortby = () => {
    sortby.value = 'featured'
  };

  onMounted(() => {
    if (isXsDevice.value) {
      filterPopup.value = false
    }
  });


</script>

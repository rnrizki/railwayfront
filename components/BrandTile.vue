<template>
  <nuxt-link
    class="block page-link"
    :to="brandLink(brand)"
    :title="brand.title"
  >
    <div class="img-wrapper">
      <ImageLazy
        :lazy-src="thumbImageURL(brand)"
        :title="brand.title"
        :alt="brand.title"
      />
    </div>
    <h5 class="item-title ellipsis ellipsis-1">
      {{brand.title}}
    </h5>
  </nuxt-link>
</template>

<script>
  import ImageLazy from '~/components/ImageLazy'
  import util from '~/mixin/util'

  export default {
    name: 'BrandTile',
    props: {
      brand: {
        type: Object,
        default() {
          return null
        },
      },
    },
    data() {
      return {
      }
    },
    components: {
      ImageLazy
    },
    mixins: [util],
    computed: {
    },
    mounted() {
    },
    methods: {
    },
  };
</script>


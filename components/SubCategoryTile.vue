<template>
  <nuxt-link
    class="block page-link"
    :to="categoryLink(subCategory)"
    :title="subCategory.title"
  >
    <div class="img-wrapper">
      <ImageLazy
        :lazy-src="thumbImageURL(subCategory)"
        :title="subCategory.title"
        :alt="subCategory.title"
      />
    </div>
    <h5 class="item-title ellipsis ellipsis-1">
      {{ subCategory.title }}
    </h5>
  </nuxt-link>
</template>

<script>
  import ImageLazy from '~/components/ImageLazy'
  import util from '~/mixin/util'

  export default {
    name: 'SubCategoryTile',
    props: {
      category: {
        type: Object,
        default() {
          return null
        },
      },
      subCategory: {
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


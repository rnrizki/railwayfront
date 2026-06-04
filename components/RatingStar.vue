<template>
   <span
     :title="$t('ratingStar.outOf', {rating: rating})"
     class="rating-stars"
   >
     <span>☆☆☆☆☆</span>
     <span class="rating" :style="ratingPercent">★★★★★</span>
   </span>
</template>

<script>

  export default {
    name: 'RatingStar',
    props: {
      rating: {
        type: Number,
        default: 5,
      }
    },
    mixins: [],
    computed: {
      ratingPercent() {
        return {
          width: `${parseInt((this.rating / 5) * 100)}%`
        }
      },
    },
  };
</script>


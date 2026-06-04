<template>
  <div class="area home-section">
    <template v-if="brands && brands.length">

      <div class="flex sided title">
        <h4>{{ $t('filter.featured', {title: title}) }}</h4>
        <nuxt-link
          class="link"
          to="/brands"
        >
          {{ $t('featured.showAll') }}
        </nuxt-link>
      </div>
      <div class="area-content">
          <image-slider
            :image-count="brands.length"
            :gap="15"
          >
            <template v-slot:content>
              <li
                v-for="(value, index) in brands"
                :key="index"
                class="center-text"
              >
                <brand-tile
                  v-for="(v, i) in value"
                  :key="i"
                  :brand="v"
                />
              </li>
            </template>
          </image-slider>

      </div>
    </template>
  </div>
</template>

<script setup>

  import {onMounted, toRefs} from "vue";

  const props = defineProps({
    type: {
      type: String,
      default: 'brand'
    },
    title: {
      type: String,
      default: ''
    },
    itemList: {
      type: Array,
      default(){
        return []
      }
    }
  });
  const brands = ref([]);

  const {type, title, itemList} = toRefs(props);

  onMounted(() => {
    let items = []
    for(let i in itemList.value){
      items.push(itemList.value[i])
      if(i % 2 === 0){
        items = []
      } else {
        brands.value.push(items)
      }
    }
  })


</script>


<template>
  <div class="flex start mt-15 mt-sm social-share gap-10">
    <span class="mr-10 color-lite hide-sm">
      {{ $t('socialShare.share') }}:
    </span>

    <share-network
      network="facebook"
      :url="currentURL"
      :title="metaTitle"
      :description="metaDescription"
      :quote="metaTitle"
      :hashtags="productTags"
      v-slot="{ share }"
    >
      <div class="cp flex gap-10" @click="share">
        <i class="icon facebook-icon"/>
        <span class="hide block-sm">{{ $t('socialShare.facebook') }}</span>
      </div>
    </share-network>

    <share-network
      network="twitter"
      :url="currentURL"
      :title="metaTitle"
      :description="metaDescription"
      :quote="metaTitle"
      :hashtags="productTags"
      v-slot="{ share }"
    >
      <div class="mlr-5 cp flex gap-10" @click="share">
        <i class="icon twitter-icon"/>
        <span class="hide block-sm">{{ $t('socialShare.twitter') }}</span>
      </div>
    </share-network>

    <share-network
      network="pinterest"
      :url="currentURL"
      :title="metaTitle"
      :description="metaDescription"
      :quote="metaTitle"
      :hashtags="productTags"
      v-slot="{ share }"
    >
      <div class="cp flex gap-10" @click="share">
        <i class="icon pinterest-icon"/>
        <span class="hide block-sm">{{ $t('socialShare.pinterest') }}</span>
      </div>
    </share-network>
    <!--


          <ShareNetwork
            network="facebook"
            :url="currentURL"
            :title="metaTitle"
            :description="metaDescription"
            :quote="metaTitle"
            :hashtags="productTags"
          >
            <i
              class="icon facebook-icon"
            />
            <span class="hide block-sm">
            {{ $t('socialShare.facebook') }}
          </span>
          </ShareNetwork>

          <ShareNetwork
            network="twitter"
            :url="currentURL"
            :title="metaTitle"
            :description="metaDescription"
            :quote="metaTitle"
            :hashtags="productTags"
            class="mlr-5"
          >
            <i
              class="icon twitter-icon"
            />
            <span class="hide block-sm">
            {{ $t('socialShare.twitter') }}
          </span>
          </ShareNetwork>

          <ShareNetwork
            network="pinterest"
            :url="currentURL"
            :title="metaTitle"
            :description="metaDescription"
            :quote="metaTitle"
            :hashtags="productTags"
          >
            <i
              class="icon pinterest-icon"
            />
            <span class="hide block-sm">
             {{ $t('socialShare.pinterest') }}
          </span>
          </ShareNetwork>

          -->
  </div>
</template>

<script setup>
  import {useCommonStore} from "~/store/common";
  import {storeToRefs} from "pinia";
  import {computed, toRefs} from "vue";

  const props = defineProps({
    product: {
      type: Object
    }
  });

  const {product} = toRefs(props);

  const commonStore = useCommonStore();
  const {site_setting} = storeToRefs(commonStore);

  const route = useRoute();

  const currentURL = computed(() => {
    const baseUrl = window.location.origin
    return route ? baseUrl + route.path : baseUrl
  });

  const metaTitle = computed(() => {
    return product.value?.meta_title || site_setting.value?.meta_title || ""
  });

  const metaDescription = computed(() => {
    return product.value?.meta_description || site_setting.value?.meta_description || ""
  });

  const productTags = computed(() => {
    return product.value?.tags ?? ''
  });

</script>

<template>
  <div>

    <CartStickyBtn
      :product-inventory="selectedInventory"
      :disabled="!statusPublic"
      :product="product"
      @cart-error="hasCartError"
    />

    <div v-if="product">
      <a v-if="product.store && product.store.whatsapp_btn"
         class="whatsapp-btn-wrap"
         target="_blank"
         :href="`https://wa.me/${product.store.whatsapp_number}?text=${product.store.whatsapp_default_msg}`"
      >
        <i class="icon whatsapp-icon"/>
      </a>

      <div
        class="detail-menu hide-sm"
      >
        <div class=" container-fluid">
          <div v-if="currentCategories && currentCategories.length" class="mlr--15">
            <nuxt-link
              v-for="(value, i) in currentCategories"
              :title="value.title"
              :to="categoryLink(value)"
              :key="i"
            >
              {{ value.title }}
            </nuxt-link>
          </div>
          <div class="mlr--15 mn-h-40x" v-else><a></a></div>
        </div>
      </div>
      <div class="container-fluid mtb-15 mt-sm-10 mn-h-700x">
        <div>
          <breadcrumb
            class="mb-20 mb-sm-15"
            :slugs="preparedSlug"
            :page="productTitle"
          />
          <div class="product-detail">
            <div class="detail-left pr-30 pr-sm-0">
              <div class="flex start align-start block-md">
                <div class="product-main">
                  <div class="detail-image-wrapper">
                    <div class="detail-image-inner"
                         :class="{'z-2': imagePopup}"
                    >
                      <product-images
                        v-if="productImage || productImageList"
                        ref="productImagesRef"
                        :title="productTitle"
                        :product="product"
                        :main-image="productImage"
                        :images="productImageList"
                        @image-popup="setImagePopup"
                        @add-to-wishlist="addWishList"
                      />
                    </div>
                  </div>

                  <div class="pl-30 pl-md grow ">
                    <h1 class="f-16">
                      {{ productTitle }}
                    </h1>
                    <div class="mt-10">
                      <rating-star :rating="parseFloat(productRating)"/>
                      <span class="f-10 ml-5 semi-bold color-lite">
                        {{ $t('productReview.reviews', {count: reviewCount}) }}
                      </span>
                    </div>

                    <div class="devider w-md-100 mtb-15">&nbsp;</div>

                    <div v-if="endTime"
                         class="flex sided warning-msg ptb-10 plr-15 mb-15 wrap gap-10"
                    >
                      <h5 class="color-inherit">
                        {{ $t('product.shocking') }}
                      </h5>
                      <div class="gap-10 flex">
                        <h5 class="color-inherit">
                          {{ $t('product.endsIn') }}
                        </h5>
                        <b>
                          <countdown :time-zone="product.time_zone" :end-time="endTime"/>
                        </b>
                      </div>
                    </div>


                    <h4 class="mb-15 bold"
                        :class="[{'color-success': isInStock}, {'color-danger': !isInStock}]"
                    >
                      {{ inStock }}
                    </h4>

                    <template
                      v-if="description"
                    >
                      <div v-if="bundleDeal" class="two-sided mb-15">
                        <h6 class="left">
                          {{ $t('product.bundleDeal') }}
                        </h6>
                        <div class="right bundle-deal">
                          {{ bundleDeal.title }}
                        </div>
                      </div>

                      <div
                        v-if="brand"
                        class="two-sided mb-15"
                      >
                        <h6 class="left">
                          {{ $t('product.brand') }}
                        </h6>
                        <div class="right">

                          <nuxt-link
                            class="link"
                            :to="`/${product.brand.slug}/brand?brand=${product.brand.id}`"
                          >
                            {{ brand }}
                          </nuxt-link>
                        </div>
                      </div>

                      <div ref="attrRef"></div>
                    </template>
                    <template v-else>
                      <div class="two-sided mb-15">
                        <h6 class="left">{{ $t('product.bundleDeal') }}</h6>
                        <div class="right bundle-deal  opacity-0">xxx</div>
                      </div>

                      <div class="two-sided mb-15">
                        <h6 class="left">{{ $t('product.brand') }}</h6>
                        <div class="right  opacity-0">xxx</div>
                      </div>


                      <div class="two-sided mb-15 opacity-0">
                        <span class="left ">xxx</span>
                        <div class="start flex wrap gap-10">
                          <label class="rd-container rd-attr">
                            <span class="input-content">xxx</span>
                          </label>
                        </div>
                      </div>

                      <div class="wrap two-sided mb-15 align-start">
                        <h6 class="left">
                          {{ $t('product.refundWarranty') }}
                        </h6>
                        <div class="right">
                          <div class="mb-5">
                            <div>{{ $t('productHelper.refundable') }}</div>
                            <div class="mb-10 mt-5 block color-lite">
                              {{$t('productHelper.mindChange') }}
                            </div>
                          </div>
                          <div class="mt-5">
                            {{ $t('product.authentic') }}
                          </div>
                        </div>
                      </div>

                      <div class="two-sided mb-15 ">
                        <h6 class="left">
                          {{ $t('accountLayout.vouchers') }}
                        </h6>
                        <div class="pos-rel ">
                          <div class="right mlr--2-5"></div>
                        </div>
                      </div>

                    </template>


                    <div
                      v-for="(value, index) in productAttributes"
                      :key="index"
                      class="two-sided mb-15"
                    >
                      <span class="left">{{value.title}}</span>

                      <div class="start flex wrap gap-10">
                        <label
                          v-for="(av, avIndex) in value.values"
                          :key="`av-${avIndex}`"
                          class="rd-container rd-attr"
                        >
                          <input
                            type="radio"
                            :name="`${value.id}`"
                            v-model="clickedAttributes[value.id]"
                            :value="av.id"
                            @change="selectedAttribute({key: avIndex, value: av})"
                          >
                          <span class="rd-checkmark"></span>

                          <span class="input-content">{{ av.title }}</span>
                        </label>
                      </div>
                    </div>

                    <div
                      v-if="cartError.attribute"
                      class="two-sided mb-15 align-start">
                      <h6 class="left">
                      </h6>
                      <div class="right">
                        <p class="error mb-10">
                          {{cartError.attribute}}
                        </p>
                      </div>
                    </div>

                    <div class="wrap two-sided mb-15 align-start">
                      <h6 class="left">
                        {{ $t('product.refundWarranty') }}
                      </h6>
                      <div class="right">
                        <div class="mb-5">

                          <template v-if="refundable(product)">
                            <div>{{ $t('productHelper.refundable') }}</div>
                            <div class="mb-10 mt-5 block color-lite">{{
                              $t('productHelper.mindChange') }}
                            </div>
                          </template>
                          <template v-else>
                            {{ $t('productHelper.notRefundable') }}
                          </template>
                        </div>

                        <div v-if="product.warranty">{{ warranty(product) }}</div>
                        <div class="mt-5">
                          {{ $t('product.authentic') }}
                        </div>
                      </div>
                    </div>


                    <div v-if="vouchers && vouchers.length"
                         class="two-sided mb-15 ">
                      <h6 class="left">
                        {{ $t('accountLayout.vouchers') }}
                      </h6>
                      <div class="pos-rel ">
                        <div class="right mlr--2-5 cp"
                             data-ignore="voucher-pop-over"
                             @click.passive="toggleVoucherPopOver"
                        >
                          <span v-for="(value, index) in vouchers"
                                :key="index"
                                class="no-click info-msg ptb-5 mlr-2-5 mb-5 f-9"
                          >
                            {{ $t('detailRight.off', { amount: getPriceType(value) }) }}
                          </span>
                        </div>
                        <pop-over
                          v-if="voucherPopOver"
                          :title="$t('filter.shop')"
                          @close="closeVoucherPopOver"
                          elem-id="voucher-pop-over"
                          :layer="false"
                        >
                          <template v-slot:content>
                            <Vouchers ref="voucherPagination"
                                      :changing-route="false"
                            />
                          </template>
                        </pop-over>
                      </div>
                    </div>

                    <div class="editor mt-30 mt-sm-15"
                         v-dompurify-html="overview"
                    />

                  </div><!-- plr-30 grow -->
                </div><!-- flex -->
              </div>

              <div class="ellipsis-para editor mt-30 mt-sm-15"
                   :class="{'expanded': descriptionExpand}"
                   v-dompurify-html="description"
              />
              <button
                @click.prevent="descriptionToggle"
                aria-label="Read less"
                class="link mt-15 mb-5"
              >
                {{ descriptionExpand ? $t('product.readLess') : $t('product.readMore') }}
              </button>
            </div>
            <!-- product-detail -->

            <detail-right
              ref="detailRightEl"
              id="detail-right"
              :product-inventory="selectedInventory"
              :disabled="!statusPublic"
              :product="product"
              @cart-error="hasCartError"
            />
          </div><!-- product-detail -->
        </div>

      </div><!-- container-fluid mtb-15 -->

      <client-only>
        <div :class="{'mx-h-0': !hasReview, 'review-loaded': !reviewLoaded}"
             class="container-fluid suggested-container mn-h-400x"
        >
          <LoadSection v-slot={renderArea}>
            <product-review
              v-if="renderArea"
              :id="product.id"
              class="b-t pt-20 pt-sm-15  "
              @has-review="fetchedReview"
            />
          </LoadSection>
        </div>

        <div class="container-fluid suggested-container mn-h-400x">
          <LoadSection v-slot="{renderArea}">
            <suggested-products
              v-if="renderArea"
              :product-id="productId"
            />
          </LoadSection>
        </div>
      </client-only>
    </div>
  </div>
</template>

<script setup>

  import {useCommonStore} from "~/store/common";
  import {useDetailStore} from "~/store/detail";
  import {useUserStore} from "~/store/user";
  import {ref, nextTick, onMounted, watch, onUnmounted} from 'vue'
  import {useAsyncData} from "nuxt/app";
  import {useLanguageStore} from "~/store/language";
  import {storeToRefs} from "pinia";
  import {prepareGetUrl} from "~/utils/fetchClient";
  import {useMetaData} from "~/composables/useMetaData";
  import {useUtils} from "~/composables/useUtils";
  import {useProductHelper} from "~/composables/useProductHelper";

  definePageMeta({
    middleware: ['common-middleware'],
    layout: 'default',
  });

  const commonStore = useCommonStore();
  const {customScripts} = storeToRefs(commonStore);
  const {fetchLocation} = commonStore;

  const detailStore = useDetailStore();
  const {product} = storeToRefs(detailStore);
  const {emptySuggestedProducts, setProduct} = detailStore;

  const userStore = useUserStore();
  const {emptyVoucher} = userStore;

  const {t} = useI18n();

  const detailRightEl = ref(null);

  const languageStore = useLanguageStore();
  const {langCode} = storeToRefs(languageStore);

  const {pageMeta, route, preloadScript} = useMetaData();
  const {getThumbImageURL, getImageURL, categoryLink} = useUtils();
  const {unAuthGet} = commonStore;


  const settingMetaData = () => {
    useHead({
      ...pageMeta({
        meta_title: product.value?.meta_title,
        meta_description: product.value?.meta_description,
        meta_keywords: product.value?.meta_keywords,
        image_url: getThumbImageURL(product.value?.image)
      }),
      ...{
        link: [
          preloadScript(getThumbImageURL(product.value?.image), 'image'),
        ]
      }
    });
  };

  const fetchingData = async () => {
    return useAsyncData(`product-${route.params.id}`, async () => {
      const response = await unAuthGet({
        api: 'product',
        params: `/${route.params.id}?${prepareGetUrl({id: route.params.id, user_id: ''})}`,
        lang: langCode.value
      });

      setProduct(response.data);
      return response.data;
    });
  }

  if (import.meta.client) {
    fetchingData();
  } else {
    await fetchingData();
  }

  watchEffect(() => {
    settingMetaData();
  })


  const {refundable, warranty, getPriceType} = useProductHelper();

  const handleIntersection = (entries) => {
    entries.forEach((entry) => {

      if (entry.isIntersecting) {
        document.body.classList.remove('show-cart')

      } else {
        document.body.classList.add('show-cart')
      }
    });
  }

  const detailRightDoc = ref(null)
  const sectionObserver = ref(null);

  const initIntersection = async () => {
    if (detailRightDoc.value) {
      return
    }

    await nextTick();
    detailRightDoc.value = document.querySelector('#detail-right');
    if (detailRightDoc.value) {
      sectionObserver.value = new IntersectionObserver(handleIntersection, {});
      sectionObserver.value.observe(detailRightDoc.value);
    }
  };

  watch(product, async () => {
    await initIntersection();

    //Checking if the product has no attribute
    if (product.value?.inventory?.length === 1 && product.value?.inventory[0]?.inventory_attributes?.length === 0) {
      selectedInventory.value = product.value?.inventory[0]
    }
  });


  const clickedAttributes = ref([]);
  const cartError = ref({
    attribute: null,
    quantity: null,
  });
  const selectedInventory = ref({});
  const currentAttributes = ref([])
  const descriptionExpand = ref(false);
  const optionChange = ref(false);
  const productInventory = ref(null);
  const imagePopup = ref(false);
  const hasReview = ref(true);
  const reviewLoaded = ref(true);
  const activatedPage = ref(false);
  const voucherPopOver = ref(false);

  const toggleVoucherPopOver = () => {
    voucherPopOver.value = !voucherPopOver.value;
  };

  const addWishList = () => {
    detailRightEl.value.wishListAction();
  };

  onMounted(async () => {
    await initIntersection();

    emptyVoucher()
    emptySuggestedProducts()

    //Checking if the product has no attribute
    if (product.value?.inventory?.length === 1 && product.value?.inventory[0]?.inventory_attributes?.length === 0) {
      selectedInventory.value = product.value?.inventory[0]
    }

    document.body.classList.add('detail-page');
  });

  onUnmounted(() => {
    sectionObserver.value?.disconnect();
    document.body.classList.remove('detail-page');
  });


  const description = computed(() => {
    return product.value?.description || null
  })
  const overview = computed(() => {
    return product.value?.overview || ''
  });
  const reviewCount = computed(() => {
    return product.value?.review_count || 0
  });
  const productRating = computed(() => {
    return product.value?.rating || 0
  });
  const productImage = computed(() => {
    return product.value?.image || null
  });
  const productImageList = computed(() => {
    return product.value?.images || []
  });

  /*
  const timeDifference = computed(() => {
      const len = product.value.id.toString()?.length
      let highest = ''
      for (let i = 1; i <= len; i++) {
          highest += '9'
      }
      return ((product.value.id / highest) * 100).toFixed(2)
  });
  */

  const endTime = computed(() => {
    return product.value?.end_time || null
  });
  const productId = computed(() => {
    return route.params.id
  });
  const statusPublic = computed(() => {
    return parseInt(product.value?.status) === 1
  });
  const category = computed(() => {
    return product.value?.category
  });
  const currentCategories = computed(() => {
    return product.value?.current_categories
  });
  const productTitle = computed(() => {
    return product.value?.title || ''
  });

  const preparedSlug = computed(() => {
    return categoryData.value?.map(i => {
      return {title: i.title, link: categoryLink(i)};
    })?.reverse();
  });

  const categoryData = computed(() => {
    return product.value?.category_data
  });

  /*
  const productSlug = computed(() => {
      return product.value?.slug
  });
  */

  const bundleDeal = computed(() => {
    return product.value?.bundle_deal
  });

  const isInStock = computed(() => {
    if (optionChange.value) {
      return productInventory.value?.quantity > 0
    }

    if (product.value.in_stock !== undefined) {
      return product.value.in_stock
    }
    return true
  });

  const inStock = computed(() => {
    return isInStock.value ? t('detail.inStock') : t('detail.outOfStock');
  });

  const vouchers = computed(() => {
    return product.value?.vouchers;
  });

  const brand = computed(() => {
    return product.value?.brand?.title || '';
  });

  /*
  const productAttributeImage = computed(() => {
      const attrImg = []
      product.value.product_image_names.forEach((i, key) => {

          if (i.attributes.length) {
              attrImg[i.attributes[0]?.attribute_value_id] = {value: i, key: key}
          }
      });
      return attrImg;
  });
  */

  const productAttributes = computed(() => {
    product.value?.attribute?.forEach(i => {
      clickedAttributes.value[i.id] = []
    });

    return product.value?.attribute?.map(i => {
      return {
        ...i,
        ...{
          values: i.values.reduce((a, item) => {
            a[`${item.attribute_id}-${item.attribute_value_id}`] = item
            return a;
          }, {})
        }
      }
    })
  });

  const attrRef = ref(null);
  const productImagesRef = ref(null);

  const hasCartError = (event) => {
    cartError.value = event
    attrRef.value.scrollIntoView({behavior: 'smooth', block: 'center', inline: 'center'});
  };

  const setImagePopup = (event) => {
    imagePopup.value = event;
  };

  const selectedAttribute = (data) => {
    cartError.value.attribute = null;
    //this.attrHover(data.value)

    currentAttributes.value[data.key.split('-')[0]] = data.value

    const imageMap = []
    product.value.product_image_names.map(i => {
      imageMap[i.attributes.map(j => {
        return j.attribute_value_id
      }).sort().join('-')] = i.image
    })

    const currentSelected = currentAttributes.value.map(i => {
      return i?.attribute_value_id
    }).filter(i => {
      return i
    })

    let bestMatch = null;
    let highestScore = -1;

    Object.keys(imageMap).forEach(key => {
      const splitKey = key.split('-').map(Number);
      const score = splitKey.reduce((acc, value) => acc + (currentSelected.includes(value) ? 1 : 0), 0);

      if (score > highestScore) {
        highestScore = score;
        bestMatch = imageMap[key];
      }
    });

    const selectedImage = highestScore > 0 ? bestMatch : null
    const imageIndex = productImageList.value?.findIndex(i => {
      return i.image === selectedImage
    })
    productImagesRef.value.zoomActiveChange(imageIndex > -1 ? imageIndex + 1 : 0)

    if (Object.values(currentAttributes.value).length === productAttributes.value.length) {

      const selected = Object.values(currentAttributes.value).map(i => {
        return i.attribute_value_id
      })

      const selectedAttr = selected.sort().join('-')

      let currentInventory = null
      const inventoryAttr = []


      for (var i of product.value?.inventory) {
        const invAttr = []
        i.inventory_attributes.forEach(j => {
          invAttr.push(parseInt(j.attribute_value_id))
        })

        inventoryAttr[invAttr.sort().join('-')] = i
      }

      if (inventoryAttr[selectedAttr]) {
        currentInventory = inventoryAttr[selectedAttr]
      }

      selectedInventory.value = currentInventory
      optionChanged(currentInventory)
    } else {
      selectedInventory.value = {}
    }
  };

  const descriptionToggle = () => {
    descriptionExpand.value = !descriptionExpand.value
  };

  const closeVoucherPopOver = () => {
    voucherPopOver.value = false
  };

  const fetchedReview = (evt) => {
    hasReview.value = !!evt
    reviewLoaded.value = !!!evt
  };

  const optionChanged = (evt) => {
    optionChange.value = true
    productInventory.value = evt

  };

  const qty = (direction) => {
    if (quantity.value + direction === 0) {
      return
    }
    quantity.value += direction
  };

</script>


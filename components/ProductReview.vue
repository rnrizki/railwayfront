<template>
  <div class="rating-review pb-5">
    <div class="flex gap-15 start align-initial block-sm">
      <div class="pr-15 pr-sm total-rating">
        <div class="pos-sticky">
          <h4 class="mb-10 bold">
            {{ $t('productReview.customerReviews') }}
          </h4>
          <div class="flex start">

            <rating-star
                class="mr-10"
              :rating="parseFloat(averageRating)"
            />
            <h4>{{ $t('ratingStar.outOf', {rating: averageRating}) }}</h4>
          </div>
          <p class="mb-15">{{ $t('productReview.peopleReviewed', {count: totalReviewCount}) }}</p>

            <table class="mb-15">
              <tbody>

              <tr v-for="value in reviews" :key="value.rating">
                <td>{{ $t('productReview.star', { count: value.rating }) }}</td>
                <td>
                <span class="rating-bar mtb-5 mlr-10">
                  <span
                    :style="{width: `${value.percent}%`}"
                  />
                </span>
                </td>
                <td>{{value.percent}}% ({{ value.total }})</td>
              </tr>
              </tbody>
            </table>
        </div>
      </div>
      <div class="all-review mlr--15">
        <div class="mlr-15">
          <div
            class="spinner-wrapper flex"
            v-if="fetchingReviews"
          >
            <spinner
              :radius="100"
            />
          </div>

          <transition name="fade" mode="out-in">
            <div
              v-if="!fetchingReviews"
              class="review-list"
            >
              <template
                v-if="currentAllReviews.length"
              >
              <div
                v-for="(value, index) in currentAllReviews"
                :key="index"
                class="mb-20 mb-sm-15"
              >
                <div class="flex start align-start gap-15">

                  <div class="user-img flex mt-5">
                    <i
                      class="icon user-icon "
                    />
                  </div>
                  <div class="flex sided grow ">
                    <div>
                      <h5
                        class="semi-bold"
                      >
                        {{ userName(value) }}
                      </h5>
                      <rating-star
                        :rating="parseFloat(value.rating)"
                      />
                    </div>
                    <p class="f-9 color-lite">{{ value.created }}</p>
                  </div>
                </div>

                <p class="mb-15"
                   v-if="!noReview(value.review)"
                >
                  {{ value.review }}
                </p>
                <div
                  v-if="value.review_images && value.review_images.length"
                  class="flex start m--5"
                >
                  <div
                    v-for="(img, i) in value.review_images"
                    :key="i"
                    class="w-70x m-5 img-wrap"
                    @click="imagePopupOpen(value, i)"
                  >
                    <div class="img-wrapper">
                      <ImageLazy
                        :lazy-src="getThumbImageURL(img.image)"
                        :title="value.created"
                        :alt="value.created"
                        class="p-5"
                      />
                    </div>
                  </div>
                </div>
              </div>
              </template>
              <p v-else>
                {{ $t('detailRight.noReview') }}
              </p>
            </div>
          </transition>
          <pagination
            class="mb-15"
            ref="ratingPagination"
            :total-page="totalPage"
            :changing-route="false"
            @fetching-data="paginationFetch"
          />
        </div>
        <banner
          v-if="banner"
          :banner="banner"
          class="rating-banner mb-15 mlr-15"
        />
      </div>
    </div>
    <image-popup
      v-if="imagePopup"
      :active-id="activeImage"
      :image-list="reviewImages"
      @close-popup="imagePopup = false"
    />
  </div>
</template>

<script>
  import util from '~/mixin/util'
  import routeParamHelper from '~/mixin/routeParamHelper'
  import Spinner from '~/components/Spinner'
  import ImageLazy from '~/components/ImageLazy'
  import ImagePopup from '~/components/ImagePopup'
  import Pagination from '~/components/Pagination'
  import RatingStar from "~/components/RatingStar"
  import {storeToRefs} from "pinia";
  import {prepareGetUrl} from "../utils/fetchClient";
  import {useCommonStore} from "../store/common";
  import {useLanguageStore} from "../store/language";

  export default {
    setup(props, { emit }) {
      const languageStore = useLanguageStore()
      const {langCode} = storeToRefs(languageStore)

      const commonStore = useCommonStore()
      const {unAuthGet} = commonStore

      const emitHasReview = (pageCount) => {
        emit("has-review", pageCount);
      }


      return {unAuthGet, langCode, emitHasReview}
    },

    name: 'ProductReview',
    data() {
      return {
        reviewData: null,
        avgRating: 0,
        totalRating: null,
        fetchingReviews: false,
        fetchingTotal: false,
        imagePopup: false,
        activeImage: 0,
        reviewImages: [],
        paginationParam: null
      }
    },
    watch: {
    },
    props: {
      id: {
        type: Number,
        required: true
      }
    },
    components: {
      RatingStar,
      Spinner,
      ImageLazy,
      ImagePopup,
      Pagination
    },
    computed: {
      allReviews() {
        return this.reviewData?.all || null
      },
      reviews() {
        const outputArray = [];
        const total = this.totalReviewCount


        for (let i = 1; i <= 5; i++) {
          const ratingObj = this.totalReviews.find(obj => obj.rating === i);
          let percent = 0
          let ratingCount = 0
          if(ratingObj) {
            percent = (ratingObj.total / total) * 100
            ratingCount = ratingObj.total
          }

          outputArray.push({
            percent: percent.toFixed(2),
            rating: i,
            total: ratingCount
          });
        }

        return outputArray

      },
      totalReviews() {
        return this.reviewData?.total || []
      },
      banner() {
        return this.reviewData?.banner
      },
      isSmallerDevice() {
        return window.innerWidth <= 768
      },
      totalReviewCount() {
        return this.totalReviews.reduce((acc, review) => acc + review.total, 0);
      },
      averageRating() {
        const totalReviewCount = this.totalReviewCount;
        const totalRating = this.totalReviews.reduce((acc, review) => acc + review.total * review.rating, 0);
        return totalReviewCount > 0 ? (totalRating / totalReviewCount).toFixed(2) : 0;
      },
      totalPage() {
        return this.allReviews?.last_page
      },
      pageCount() {
        return this.allReviews?.total
      },
      currentAllReviews() {
        return this.allReviews?.data || []
      },
    },
    mixins: [util, routeParamHelper],
    methods: {
      userName(review){
        if(review?.user){
          return review?.user?.name
        } else if(review?.guest_user){
          return review?.guest_user?.name
        }
        return ""
      },
      imagePopupOpen(data, index) {
        this.reviewImages = data.review_images
        this.activeImage = index
        this.imagePopup = true
      },
      noReview(review) {
        return !review || review === 'null'
      },
      async paginationFetch(evt) {
        this.paginationParam = evt
        await this.fetchingData()
      },
      async fetchingData() {

        this.settingParam(this.paginationParam)
        this.fetchingReviews = true

        const response = await this.unAuthGet({
          api: 'reviews',
          params: `/${this.id}?${prepareGetUrl({
                    id: this.id,
                    time_zone: this.timeZone,
                    order_by: this.orderBy,
                    type: this.orderByType,
                    get_total: !this.totalReviews.length > 0,
                    page: this.page,
                    q: this.search
                  }
          )}`,
          lang: this.langCode
        })
        this.reviewData = response.data
        this.fetchingReviews = false
        this.emitHasReview(this.pageCount)
      },

    },
    created() {
    },
    async mounted() {
      this.fetchingTotal = false
      await this.fetchingData()
      this.fetchingTotal = true
    }
  }
</script>


<template>
    <div>
        <div class="flex sided align-start">
            <h4 class="bold">{{ title }}</h4>
            <p class="mn-w-90x right-text">
                {{ $t('productDynamic.pageOf', { current: currentPage, total: totalPage }) }}
            </p>
        </div>

        <div class="c_slider__wrapper">
            <div class="c_slider__nav">
                <button
                        aria-label="submit"
                        class="prev-btn clear-height"
                        @click.prevent="change(-1)"
                >
                    <i
                            class="icon arrow-left black m-0"
                    />
                </button>
                <button
                        aria-label="submit"
                        class="next-btn clear-height"
                        @click.prevent="change(1)"
                >
                    <i
                            class="icon arrow-right black m-0"
                    />
                </button>
            </div>

            <suggested-ajax-slider
                    v-if="!isMobile()"
                    class="touch-action"
                    v-drag="{  onDragging, onDragEnd }"
                    :item-list="itemList"
                    :current-pagination="currentPagination"
                    :total-page="totalPage"
                    :current-page="currentPage"
                    :dragged-width="draggedWidth"
            />
            <suggested-ajax-slider
                    v-else
                    v-drag="{ onDragging, onDragEnd }"
                    class="touch-action"
                    :item-list="itemList"
                    :current-pagination="currentPagination"
                    :total-page="totalPage"
                    :current-page="currentPage"
                    :dragged-width="draggedWidth"
            />

        </div>
    </div>
</template>

<script>
    import util from '~/mixin/util.js'
    import SuggestedAjaxSlider from '~/components/SuggestedAjaxSlider'

    export default {
        name: 'ProductsDynamic',
        data() {
            return {
                currentPage: 1,
                draggedWidth: 0,
                pagination: [6, 4, 3, 2, 2]
            }
        },
        watch: {},
        props: {
            itemList: {
                type: Array,
                default() {
                    return []
                }
            },
            title: {
                type: String,
                default: ''
            },
            totalItem: {
                type: Number
            },
            perPage: {
                type: Number
            }
        },
        components: {
            SuggestedAjaxSlider
        },
        computed: {
            loadedPage() {
                const count = this.itemList.length
                const rem = count % this.itemPerPage
                return (count - rem) / this.itemPerPage
            },
            totalPage() {
                if (this.currentPagination < this.totalItem) {
                    const mod = this.totalItem % parseInt(this.currentPagination)
                    return ((this.totalItem - mod) / parseInt(this.currentPagination)) + (mod > 0 ? 1 : 0)
                }
                return 1
            },
            itemPerPage() {
                if (window.innerWidth > 1200) return this.pagination[0]
                else if (window.innerWidth > 992) return this.pagination[1]
                else if (window.innerWidth >= 768) return this.pagination[2]
                else if (window.innerWidth > 576) return this.pagination[3]
                else return this.pagination[4]
            },
            currentPagination() {
                return this.itemPerPage < this.perPage ? this.itemPerPage : this.perPage
            }
        },
        mixins: [util],
        methods: {
            onDragging(deltaX) {
                this.draggedWidth = -1 * deltaX
            },
            onDragEnd() {
                if (this.draggedWidth > 0) {
                    this.change(1)
                } else if (this.draggedWidth < 0) {
                    this.change(-1)
                }
            },
            change(data) {
                this.currentPage += data
                if (this.currentPage < 1) {
                    this.currentPage = this.totalPage
                } else if (this.currentPage > this.totalPage) {
                    this.currentPage = 1
                }
                this.draggedWidth = 0
                if (this.loadedPage < this.currentPage) {
                    this.$emit('change', data)
                }
            }
        },
        created() {
        },
        mounted() {
        }
    }
</script>

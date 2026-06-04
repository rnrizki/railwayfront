const state = () => ({
  imgSrcUrl: '',
  defaultImage: '',
  thumbPrefix: '',
})

const actions = {
  setMediaData({default_image, img_src_url, thumb_prefix}){
    this.defaultImage = default_image
    this.imgSrcUrl = img_src_url
    this.thumbPrefix = thumb_prefix
  },
}

export const useIndexStore = defineStore('index', {
  state,
  actions
});

export default {
  data() {
    return {
      sliderLoaded: false
    }
  },
  methods: {
    changed({index}, id="home-hero"){
      const self = this
      const img = this.loadedImage(index, id)

      const setLoadingState = () => {
        img.style.opacity = 1
      }

      img?.addEventListener('load', setLoadingState)
      img?.addEventListener('error', () => {
        img.style.opacity = 1
        img.src = self?.getImageURL()
      })
    },
    firstImgLoaded(index = 0, id="home-hero"){
      const self = this
      const img = this.loadedImage(index, id)
      const setLoadingState = () => {
        this.sliderLoaded = true
        img.style.opacity = 1
      }

      img?.addEventListener('load', setLoadingState)

      img?.addEventListener('error', () => {
        this.sliderLoaded = true
        img.style.opacity = 1
        img.src = self?.getImageURL()
      })
    },
    loadedImage(index = 0, id="home-hero") {
      const firstImg = document.getElementById(`${id}-${index}`)
      firstImg?.setAttribute('src', firstImg?.getAttribute('data-src'))

      return firstImg
    },
  }
}

import {useIndexStore} from "~/store/index";
import {useConstants} from "~/composables/useConstants";

export function useUtils() {

  const formatPrice = (num) => {
    return parseFloat(num).toFixed(2);
  };

  const {imgSrcUrl, thumbPrefix, defaultImage} = storeToRefs(useIndexStore())

  const getThumbImageURL = (image = null) => {
    return imgSrcUrl.value + thumbPrefix.value + (image || defaultImage.value)
  };

  const getImageURL = (image = null) => {
    return imgSrcUrl.value + (image || defaultImage.value)
  };

  const getVideoURL = (video = null) => {
    return imgSrcUrl.value + video;
  };

  const collectionLink = (item) => {
    if (item) {
      return `/${item?.slug}/collection?collection=${item?.id}`
    }
  };

  const productLink = (item) => {
    if (item) {
      return `/${item?.slug}/product/${item?.id}`
    }
  };

  const categoryLink = (item) => {
    if (item) {
      return `/all/${item?.slug}`;
    }
  };

  const pageLink = (page) => {
    return `/page/${page.slug}`;
  };



  const sourceUrl = (item, query = 'home_spm') => {
    const {productSourcesIn} = useConstants();
    if (parseInt(item?.source_type) === parseInt(productSourcesIn.URL)) {
      return item?.url?.toString() || '/'
    }
    if (item) {
      return `/${item?.slug}/products?${query}=${item.id}`
    }
  };


  const getTimeZone = () => {
    const tz = Intl.DateTimeFormat()?.resolvedOptions()?.timeZone
    if (tz === 'Asia/Calcutta') return 'Asia/Kolkata'
    return tz
  };

  const dataFromObject = (data, key, defaultData = '') => {
    return data && (data[key] !== undefined) && data[key] ? data[key] : defaultData
  };

  const getUrl = (item) => {
    return item?.url || '/'
  };

  const getTitle = (item) => {
    return item?.title || ''
  };

  return {
    getThumbImageURL, getImageURL, collectionLink, productLink, categoryLink, sourceUrl,
    pageLink, formatPrice, getTimeZone, dataFromObject, getUrl, getTitle, getVideoURL
  }
}



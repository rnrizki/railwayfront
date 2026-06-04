import {storeToRefs} from "pinia";
import {useCommonStore} from "../store/common";
import {useConstants} from "./useConstants";

export function useProductHelper() {
  const refundable = (product) => {
    return (parseInt(product?.refundable) === 1);
  };

  const warranty = (product) => {
    const {t} = useI18n();
    return (parseInt(product?.warranty) === 1) ? t('productHelper.available') : t('productHelper.notAvailable');
  };


  const getPriceType = (item) => {
    const {currencyIcon, setting} = storeToRefs(useCommonStore());
    const {priceType} = useConstants();

    return (parseInt(item.type) === priceType.FLAT)
      ? priceFormat(currencyIcon.value, item.price, setting.value)
      : `${decimalSeparator(item.price)}%`;
  };

  const decimalSeparator = (price, decimalSeparator = 'en-US') => {
    if (!decimalSeparator) {
      decimalSeparator = 'en-US'
    }

    return parseFloat(price).toLocaleString(decimalSeparator, {maximumFractionDigits: 2});
  };

  const priceFormat = (currencyIcon, price, setting) => {
    const {currencyPositionsIn} = useConstants();

    if (parseInt(setting.currency_position) === currencyPositionsIn.PRE) {
      return currencyIcon + decimalSeparator(price, setting.decimal_format)
    }
    return `${decimalSeparator(price, setting.decimal_format)}${currencyIcon}`;
  };


  const arraySimilarity = (arr1, arr2) => {
    let similarity = 0;
    for (let item of arr1) {
      if (arr2.includes(item)) {
        similarity++;
      }
    }
    return similarity;
  };

  const findBestMatchKey = (targetArray, object) => {
    let bestMatchKey = null;
    let bestSimilarity = -1;

    for (const key in object) {
      if (Object.hasOwnProperty.call(object, key)) {
        const array = object[key];
        const similarity = arraySimilarity(targetArray, array);
        if (similarity > bestSimilarity) {
          bestSimilarity = similarity;
          bestMatchKey = key;
        }
      }
    }
    return bestMatchKey;
  };


  const getProductImage = (product, inventoryAttributes) => {
    return attrImage(product, inventoryAttributes) || product?.image
  };

  const attrImage = (product, inventoryAttributes) => {
    const images = {}
    const imageData = {}
    product?.product_images?.forEach(i => {
      i?.attributes.forEach(j => {
        if (!images[i?.id]) {
          images[i.id] = []
          imageData[i.id] = i?.image
        }
        images[i.id].push(j?.attribute_value_id)
      })
    })

    const attributeValues = inventoryAttributes?.map(i => {
      return i?.attribute_value_id
    })

    const matched = findBestMatchKey(attributeValues, images)
    return imageData[matched]
  };

  return {
    refundable, warranty, getPriceType, getProductImage
  }
}



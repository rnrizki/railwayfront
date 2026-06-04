export const useConstants = () => {
  const currencyPositionsIn = {
    PRE: 1,
    POST: 2
  };

  const priceType = {
    FLAT: 1,
    PERCENT: 2
  };

  const status = {
    PUBLIC: 1,
    PRIVATE: 2
  };

  const bannerType = {
    BANNER_1: 1,
    BANNER_2: 2,
    BANNER_3: 3,
    BANNER_4: 4,
    BANNER_5: 5,
    BANNER_6: 6,
    BANNER_7: 7,
    BANNER_8: 8,
    BANNER_9: 9,
  };

  const productSourcesIn = {
    CATEGORIES: 1,
    SUB_CATEGORIES: 2,
    TAGS: 3,
    BRANDS: 4,
    PRODUCTS: 5,
    URL: 6
  };

  const shimmerCount = {
    PRODUCT: 21,
    FLASH_SALE: 21
  };

  const {t} = useI18n();

  const orderStatus = {
    1: {title: t('util.pending')},
    2: {title: t('util.confirmed')},
    3: {title: t('util.pickedUp')},
    4: {title: t('util.onWay')},
    5: {title: t('util.delivered')}
  };

  const paymentStatus = {
    1: t('orderTabbing.paid'),
    0: t('orderTabbing.unPaid')
  };

  const paymentStatusIn = {
    PAID: 1,
    UNPAID: 0,
  };

  const orderMethods = {
    RAZORPAY: 1,
    CASH_ON_DELIVERY: 2,
    STRIPE: 3,
    PAYPAL: 4,
    FLUTTERWAVE: 5,
    IYZICO_PAYMENT: 6,
    BANK: 7,
    PAYFAST: 8,
  };

  const orderStatusIn = {
    PENDING: 1,
    CONFIRMED: 2,
    PICKED_UP: 3,
    ON_THE_WAY: 4,
    DELIVERED: 5
  };


  const orderMethodsIn = {
    1: t('util.creditDebit'),
    2: t('orderTabbing.cod'),
    3: t('util.creditDebit'),
    4: t('util.paypal'),
    5: t('util.flutterwave'),
    6: t('filter.iyzicoPayment'),
    7: t('date.bt'),
    8: t('invent.pf'),
  };

  const shippingTypes = {
    1: t('util.location'),
    2: t('util.pickup')
  };

  const shippingTypeIn = {
    location: 1,
    pickup: 2
  }

  return {
    currencyPositionsIn, priceType, status, bannerType, paymentStatus, paymentStatusIn,
    productSourcesIn, shimmerCount, orderStatus, orderMethods, orderStatusIn, orderMethodsIn,
    shippingTypes, shippingTypeIn
  }
}

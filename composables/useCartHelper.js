import {storeToRefs} from "pinia";
import {useUserStore} from "../store/user";
import {useLanguageStore} from "../store/language";
import {useCommonStore} from "../store/common";
import {useAuthStore} from "../store/auth";
import {useCartStore} from "../store/cart";
import {useDetailStore} from "../store/detail";

export function useCartHelper({product, productInventory, emit}) {

    const ajaxingWishlist = ref(false);
    const ajaxing = ref(false);
    const buyingNow = ref(false)
    const quantity = ref(1);
    const cartError = ref({
        attribute: null,
        quantity: null,
    });
    const router = useRouter();

    const languageStore = useLanguageStore();
    const {langCode} = storeToRefs(languageStore);

    const cartStore = useCartStore();
    const {cartAction, buyNow} = cartStore;

    const userStore = useUserStore();
    const {getUserToken} = userStore;
    const {profile} = storeToRefs(userStore);

    const commonStore = useCommonStore();
    const {setting} = storeToRefs(commonStore);
    const {setToastError, postRequest, setToastMessage} = commonStore;


    const authStore = useAuthStore();
    const {authenticated} = storeToRefs(authStore);

    const detailStore = useDetailStore();
    const {updateWishlist} = detailStore;
    const {t} = useI18n();

    const wishListed = computed(() => {
        return profile.value?.id && product.value?.wishlisted;
    });


    const wishListAction = async () => {
        if(!authenticated.value){
            return navigateTo('/login');
        }
        ajaxingWishlist.value = true;

        const data = await postRequest({
            api: 'userWishlistAction',
            params: {
                product_id: product.value.id
            }
        });

        ajaxingWishlist.value = false;

        if(data?.status === 200){
            setToastMessage(data.message)
            updateWishlist(data)
        }else{
            setToastError(data.data.form.join(', '))
        }
    };

    const emitCartError = () => {
        emit('cart-error', cartError.value)
    };

    const addToCart = async (isBuyNow = false) => {
        if (!setting.value?.guest_checkout) {
            if (!authenticated.value) {
                return navigateTo('/login');
            }
        }

        cartError.value = {
            attribute: null,
            quantity: null
        };

        if (!product.value?.in_stock) {
            setToastError(t('detailRight.outOfStock'))
            return false
        }

        if (Object.values(productInventory.value).length === 0) {
            const attr = product.value?.attribute.map(i => {
                return i?.title
            })
            cartError.value.attribute = t('detailRight.requiredAttributes')
            if (attr.length) {
                cartError.value.attribute += `(${attr.join(' / ')})`
            }
            emitCartError();
            return false
        }

        if (productInventory.value.quantity < quantity.value) {

            cartError.value.quantity = t('detailRight.exceedsInventory')
            emitCartError()
            return false
        }
        if (isBuyNow) {
            await buyNowProduct()
            setTimeout(() => {
                router.push({path: '/shipping'})
            }, 300)

        } else {
            await cartAdd()
        }
    };


    const buyNowProduct = async () => {
        const {langCode} = storeToRefs(useLanguageStore());

        const userStore = useUserStore()
        const {getUserToken} = userStore
        buyingNow.value = true;

        const data = await buyNow({
            payload: {
                user_token: await getUserToken(),
                product_id: product.value.id,
                inventory_id: productInventory.value.id,
                quantity: quantity.value
            },
            lang: langCode.value
        })

        buyingNow.value = false;

        return data;
    };

    const cartAdd = async () => {
        ajaxing.value = true;
        const userToken = await getUserToken();

        await cartAction({
            payload: {
                user_token: userToken,
                apiVal: {
                    user_token: userToken,
                    product_id: product.value.id,
                    inventory_id: productInventory.value?.id,
                    quantity: quantity.value
                },
                isBundle: !!product.value?.bundle_deal,
                storeVal: {
                    product: {
                        id: product.value.id,
                        title: product.value.title,
                        offered: product.value.offered,
                        selling: product.value.selling,
                        image: product.value.image,
                        shipping_rule: product.value.shipping_rule
                    },
                    inventory: productInventory.value,
                    quantity: quantity.value,
                    selected: 1,
                    offered: 0,
                    bundle_deal: product.value?.bundle_deal,
                    shipping_type: 1
                }
            },
            lang: langCode.value

        })
        ajaxing.value = false;
    };

    return {wishListAction, cartAdd, cartError, ajaxingWishlist, buyingNow,
        addToCart, quantity, ajaxing, wishListed}
}



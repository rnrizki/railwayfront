import {prepareGetUrl} from "../utils/fetchClient";
import {showError} from "nuxt/app";
import {useUtils} from "./useUtils";
import {useCommonStore} from "../store/common";
import {useUserStore} from "../store/user";
import {storeToRefs} from "pinia";
import {useResourceStore} from "../store/resource";

export function useAddressHelper({submittingAddressData, hasAddressErrors, ajaxDeleting}) {
    const {t} = useI18n();
    const fetchingAddressData = ref(false);

    const resourceStore = useResourceStore()
    const {countryList} = storeToRefs(resourceStore)

    const route = useRoute();

    const commonStore = useCommonStore()
    const {postRequest, setToastMessage, setToastError, deleteRequest, getRequest} = commonStore

    const userStore = useUserStore()
    const {getUserToken, updateAddress, setAllAddress} = userStore

    const addressAction = async (addressData) => {
        if (addressData.value.email && addressData.value.city && addressData.value.phone && addressData.value.name &&
            addressData.value.zip && addressData.value.country && addressData.value.address_1) {

            submittingAddressData.value = true;

            const data = await postRequest({
                api: 'userAddressAction',
                params: {
                    ...addressData.value,
                    ...{
                        user_token: await getUserToken()
                    }
                }
            });

            if (data?.status === 200) {
                hasAddressErrors.value = false;
                updateAddress(data?.data)
                setToastMessage(data.message)

            } else if (data?.status === 201) {
                setToastError(data.data?.form?.join(', '))

            } else {

                showError({
                    statusCode: 400,
                    message: data.data?.form[0]
                })

            }
            submittingAddressData.value = false

        } else {
            hasAddressErrors.value = true
        }
    };

    const deleteAddress = async (address) => {
        if (confirm(t('cartProductTile.deleteAlert'))) {
            ajaxDeleting.value = address.id;

            const data = await deleteRequest({
                api: 'userAddressDelete',
                params: `/${address.id}?${prepareGetUrl({
                    user_token: await getUserToken()
                })}`
            });

            if (data?.status === 200) {
                setToastMessage(data.message);
                await fetchingData();
            } else {
                setToastError(data?.data?.form?.join(', '));
            }
            ajaxDeleting.value = 0
        }
    };

    const formatAddress = (obj) => {
        let addArr = []

        addArr.push(obj.address_1)
        if (obj.address_2) {
            addArr.push(obj.address_2)
        }
        addArr.push(obj.city + '-' + obj.zip)

        if (countryList.value[obj.country]) {
            const country = countryList.value[obj.country]

            if (country.states[obj.state]) {
                addArr.push(country.states[obj.state].name)
            }

            addArr.push(country.name)
        }

        return addArr.filter(function (el) {
            return el != null;
        }).join(', ');
    };

    const {getTimeZone} = useUtils();

    const fetchingData = async () => {


        fetchingAddressData.value = true;

        const data = await getRequest({
            api: 'userAddressAll',
            params: `?${prepareGetUrl({
                time_zone: getTimeZone(),
                order_by: route.query.orderBy || 'created_at',
                type: route.query.orderByType || 'desc',
                page: route.query.page || 1,
                user_token: await getUserToken(),
                q: route.query.q || null
            })}`
        });

        if (data?.status !== 200) {
            showError({
                statusCode: 400,
                message: data.data?.form[0]
            })
        } else {
            setAllAddress(data?.data)
        }
        fetchingAddressData.value = false
    }

    return {formatAddress, addressAction, fetchingAddressData, deleteAddress, fetchingData}
}



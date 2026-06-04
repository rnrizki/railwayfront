import {useAuthStore} from "../store/auth";
import {storeToRefs} from "pinia";
import {useCommonStore} from "../store/common";

export function useCompareHelper({product, emit}) {
    const ajaxingCompare = ref(false);

    const authStore = useAuthStore();
    const {authenticated} = storeToRefs(authStore)

    const commonStore = useCommonStore();
    const {setToastMessage,setToastError, postRequest} = commonStore;

    const addToCompare = async () => {
        if(!authenticated.value){
            return navigateTo('/login');
        }

        ajaxingCompare.value = true;
        const data = await postRequest({
            params: {product_id: product.value.id},
            api: 'compareListAction'
        });
        ajaxingCompare.value = false;

        if (data?.status === 200){
            if(!data.data) {
                emit('removed');
            }
            setToastMessage(data.message);
        }else {
            setToastError(data?.data?.form.join(', '));
        }
    };

    return {ajaxingCompare, addToCompare}
}



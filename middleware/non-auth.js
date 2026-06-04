import { useAuthStore } from '~/store/auth';
export default defineNuxtRouteMiddleware((to) => {

    const { authenticated, token } = storeToRefs(useAuthStore());
    const config = useRuntimeConfig();
    const tkn = useCookie(config.public.auth_token_key);

    if (tkn?.value) {
        authenticated.value = true;
        token.value = tkn.value;
        return navigateTo('/');
    }
});

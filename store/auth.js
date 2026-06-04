
const state = () => ({
  authenticated: false,
  token: null
});

const actions = {
  setToken(token) {
    const config = useRuntimeConfig();
    const tkn = useCookie(config.public.auth_token_key);
    this.authenticated = true;
    this.token = token;
    tkn.value = token;
  },
  logUserOut() {
    const config = useRuntimeConfig();
    const token = useCookie(config.public.auth_token_key);
    this.authenticated = false;
    this.token = null;
    token.value = null;
  }
};

export const useAuthStore = defineStore('auth', {
  state,
  actions
});

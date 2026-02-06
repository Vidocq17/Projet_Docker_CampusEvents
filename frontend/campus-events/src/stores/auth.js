import { defineStore } from "pinia";
import { login as apiLogin, register as apiRegister, me as apiMe, getErrorMessage } from "../api/api";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("token") || null,
    user: JSON.parse(localStorage.getItem("user") || "null"), // {id,email,role}
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === "admin",
  },

  actions: {
    async init() {
      if (this.token && !this.user) {
        await this.fetchMe();
      }
    },

    async fetchMe() {
      this.loading = true;
      this.error = null;
      try {
        const user = await apiMe();
        this.user = user;
        localStorage.setItem("user", JSON.stringify(user));
      } catch (err) {
        this.error = getErrorMessage(err);
        this.logout();
      } finally {
        this.loading = false;
      }
    },

    async login({ email, password }) {
      this.loading = true;
      this.error = null;
      try {
        const data = await apiLogin({ email, password });

        const token = data.token || data.access_token;
        if (!token) throw new Error("Token manquant dans la réponse API");

        this.token = token;
        localStorage.setItem("token", token);

        await this.fetchMe();
        return true;
      } catch (err) {
        this.error = getErrorMessage(err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    async register({ email, password }) {
      this.loading = true;
      this.error = null;
      try {
        await apiRegister({ email, password });
        return await this.login({ email, password });
      } catch (err) {
        this.error = getErrorMessage(err);
        return false;
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.token = null;
      this.user = null;
      this.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

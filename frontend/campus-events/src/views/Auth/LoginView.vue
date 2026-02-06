<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");

async function onSubmit() {
  const ok = await auth.login({ email: email.value, password: password.value });
  if (ok) {
    const redirect = route.query.redirect || "/";
    router.push(redirect);
  }
}
</script>

<template>
    <main class="page">
        <h1>Connexion</h1>

        <form @submit.prevent="onSubmit" class="card">
            <label>
                Email
                <input v-model.trim="email" type="email" required autocomplete="email" />
            </label>

            <label>
                Mot de passe
                <input v-model="password" type="password" required autocomplete="current-password" />
            </label>

            <button :disabled="auth.loading" type="submit">
                {{ auth.loading ? "Connexion..." : "Se connecter" }}
            </button>

            <p v-if="auth.error" class="error">{{ auth.error }}</p>
        </form>
    </main>
</template>

<style scoped>
.page {
    max-width: 520px;
    margin: 24px auto;
    padding: 0 16px;
}

.card {
    display: grid;
    gap: 12px;
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

label {
    display: grid;
    gap: 6px;
}

input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
}

button {
    padding: 10px;
    border-radius: 6px;
    border: 1px solid #333;
    background: #fff;
    cursor: pointer;
}

.error {
    color: #b00020;
}
</style>

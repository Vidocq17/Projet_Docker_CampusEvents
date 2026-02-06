<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";

const auth = useAuthStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const confirm = ref("");
const localError = ref(null);

async function onSubmit() {
    localError.value = null;

    if (password.value.length < 6) {
        localError.value = "Le mot de passe doit faire au moins 6 caractères.";
        return;
    }
    if (password.value !== confirm.value) {
        localError.value = "Les mots de passe ne correspondent pas.";
        return;
    }

    const ok = await auth.register({ email: email.value, password: password.value });
    if (ok) router.push("/");
}
</script>

<template>
    <main class="page">
        <h1>Inscription</h1>

        <form @submit.prevent="onSubmit" class="card">
            <label>
                Email
                <input v-model.trim="email" type="email" required autocomplete="email" />
            </label>

            <label>
                Mot de passe
                <input v-model="password" type="password" required autocomplete="new-password" />
            </label>

            <label>
                Confirmer le mot de passe
                <input v-model="confirm" type="password" required autocomplete="new-password" />
            </label>

            <button :disabled="auth.loading" type="submit">
                {{ auth.loading ? "Création..." : "Créer mon compte" }}
            </button>

            <p v-if="localError" class="error">{{ localError }}</p>
            <p v-else-if="auth.error" class="error">{{ auth.error }}</p>
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

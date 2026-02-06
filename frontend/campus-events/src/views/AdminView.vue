<script setup>
import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();
</script>

<template>
    <main class="page">
        <h1>Admin</h1>

        <section class="card">
            <p>Connecté en tant que :</p>
            <pre>{{ auth.user }}</pre>

            <p v-if="!auth.isAdmin" class="error">
                Vous n’êtes pas admin (normalement vous ne devriez pas voir cette page si le guard est actif).
            </p>
        </section>

        <section class="card">
            <h2>Actions admin (placeholder)</h2>
            <ul>
                <li>Gérer les utilisateurs (si endpoint Symfony)</li>
                <li>Supprimer un événement (si vous le gérez côté API ou via storage local)</li>
            </ul>
            <p class="hint">Pour le TP : cette page suffit à prouver la protection par rôle.</p>
        </section>
    </main>
</template>

<style scoped>
.page {
    max-width: 820px;
    margin: 24px auto;
    padding: 0 16px;
    display: grid;
    gap: 14px;
}

.card {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 16px;
}

pre {
    background: #fafafa;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #eee;
    overflow: auto;
}

.error {
    color: #b00020;
}

.hint {
    opacity: 0.8;
    font-size: 13px;
}
</style>

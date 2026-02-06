
<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { fetchEventByIdLocal } from "../api/api";
import { useAuthStore } from "../stores/auth";

const auth = useAuthStore();
const route = useRoute();

const loading = ref(false);
const event = ref(null);
const error = ref(null);
const message = ref(null);

const storageKey = computed(() => `registrations:${route.params.id}`);
const registrations = ref([]);

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" });
  } catch {
    return iso;
  }
}

function loadRegistrations() {
  const raw = localStorage.getItem(storageKey.value);
  registrations.value = raw ? JSON.parse(raw) : [];
}

function saveRegistrations() {
  localStorage.setItem(storageKey.value, JSON.stringify(registrations.value));
}

const isRegistered = computed(() => {
  const email = auth.user?.email;
  if (!email) return false;
  return registrations.value.includes(email);
});

function register() {
  error.value = null;
  message.value = null;

  if (!auth.user?.email) {
    error.value = "Vous devez être connecté.";
    return;
  }
  if (registrations.value.length >= (event.value?.capacite || 0)) {
    error.value = "Événement complet.";
    return;
  }
  if (isRegistered.value) return;

  registrations.value.push(auth.user.email);
  saveRegistrations();
  message.value = "Inscription enregistrée.";
}

function unregister() {
  error.value = null;
  message.value = null;

  const email = auth.user?.email;
  if (!email) return;

  registrations.value = registrations.value.filter((x) => x !== email);
  saveRegistrations();
  message.value = "Désinscription enregistrée.";
}

onMounted(async () => {
  loading.value = true;
  error.value = null;
  try {
    event.value = await fetchEventByIdLocal(String(route.params.id));
    loadRegistrations();
  } catch (err) {
    error.value = err?.message || "Erreur au chargement.";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
    <main class="page">
        <p><router-link to="/">← Retour</router-link></p>

        <p v-if="loading">Chargement...</p>
        <p v-else-if="!event">Événement introuvable.</p>

        <section v-else class="card">
            <h1>{{ event.nom }}</h1>
            <p class="meta">{{ formatDate(event.date) }} — {{ event.localisation }}</p>

            <img v-if="event.image" :src="event.image" :alt="event.nom" class="cover" />

            <p>{{ event.description_rapide }}</p>

            <p class="tags">
                <span v-for="t in event.tags" :key="t" class="tag">{{ t }}</span>
            </p>

            <hr />

            <div class="row">
                <p>
                    Capacité : <strong>{{ event.capacite }}</strong> —
                    Inscrits : <strong>{{ registrations.length }}</strong>
                </p>

                <div class="actions">
                    <button v-if="auth.isAuthenticated && !isRegistered" @click="register">
                        S’inscrire
                    </button>
                    <button v-if="auth.isAuthenticated && isRegistered" @click="unregister">
                        Se désinscrire
                    </button>
                    <router-link v-if="auth.isAuthenticated" to="/event-form">Éditer</router-link>
                </div>
            </div>

            <p v-if="message" class="info">{{ message }}</p>
            <p v-if="error" class="error">{{ error }}</p>

            <div v-if="auth.isAdmin" class="card sub">
                <h3>Liste des inscrits (admin)</h3>
                <ul>
                    <li v-for="u in registrations" :key="u">{{ u }}</li>
                </ul>
            </div>
        </section>
    </main>
</template>

<style scoped>
.page {
    max-width: 820px;
    margin: 24px auto;
    padding: 0 16px;
}

.card {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 16px;
}

.meta {
    opacity: 0.8;
    margin-top: -8px;
}

.cover {
    width: 100%;
    height: 260px;
    object-fit: cover;
    border-radius: 10px;
    border: 1px solid #eee;
    margin: 12px 0;
}

.row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
}

.actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
}

button {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #333;
    background: #fff;
    cursor: pointer;
}

.tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
}

.tag {
    font-size: 12px;
    border: 1px solid #ddd;
    padding: 2px 8px;
    border-radius: 999px;
}

.error {
    color: #b00020;
}

.info {
    color: #0b5;
}

.sub {
    margin-top: 14px;
}
</style>

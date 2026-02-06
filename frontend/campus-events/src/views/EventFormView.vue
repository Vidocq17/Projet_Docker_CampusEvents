<script setup>
import { onMounted, ref } from "vue";

const STORAGE_KEY = "customEvents";

const form = ref({
    id: "",
    nom: "",
    date: "",
    localisation: "",
    description_rapide: "",
    image: "",
    tags: [],
    capacite: 10,
});

const tagsText = ref("");
const customEvents = ref([]);
const message = ref(null);
const error = ref(null);

function loadCustom() {
    const raw = localStorage.getItem(STORAGE_KEY);
    customEvents.value = raw ? JSON.parse(raw) : [];
}

function saveCustom() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customEvents.value));
}

function reset() {
    message.value = null;
    error.value = null;
    form.value = {
        id: "",
        nom: "",
        date: "",
        localisation: "",
        description_rapide: "",
        image: "",
        tags: [],
        capacite: 10,
    };
    tagsText.value = "";
}

function normalizeTags(text) {
    return text
        ? text.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
        : [];
}

function toIsoFromDatetimeLocal(dt) {
    // dt: "YYYY-MM-DDTHH:mm"
    // On le convertit en ISO complet
    try {
        const d = new Date(dt);
        return d.toISOString();
    } catch {
        return dt;
    }
}

function onSubmit() {
    message.value = null;
    error.value = null;

    const tags = normalizeTags(tagsText.value);
    if (!tags.length) {
        // pas obligatoire, mais utile
    }

    const id = `custom-${crypto.randomUUID()}`;

    const event = {
        ...form.value,
        id,
        tags,
        date: toIsoFromDatetimeLocal(form.value.date),
    };

    customEvents.value.unshift(event);
    saveCustom();
    message.value = "Événement enregistré en localStorage.";
    reset();
}

function remove(id) {
    customEvents.value = customEvents.value.filter((e) => e.id !== id);
    saveCustom();
}

onMounted(() => {
    loadCustom();
});
</script>

<template>
    <main class="page">
        <h1>Créer / Éditer un événement</h1>

        <form class="card" @submit.prevent="onSubmit">
            <label>Nom
                <input v-model.trim="form.nom" required />
            </label>

            <label>Date et heure (ISO ou datetime-local)
                <input v-model="form.date" type="datetime-local" required />
            </label>

            <label>Localisation
                <input v-model.trim="form.localisation" required />
            </label>

            <label>Description rapide
                <textarea v-model.trim="form.description_rapide" rows="3" required />
            </label>

            <label>Image (URL)
                <input v-model.trim="form.image" placeholder="https://..." />
            </label>

            <label>Tags (virgules)
                <input v-model.trim="tagsText" placeholder="campus, tech" />
            </label>

            <label>Capacité
                <input v-model.number="form.capacite" type="number" min="1" required />
            </label>

            <div class="row">
                <button type="submit">Enregistrer (local)</button>
                <button type="button" @click="reset">Reset</button>
            </div>

            <p v-if="message" class="info">{{ message }}</p>
            <p v-if="error" class="error">{{ error }}</p>
        </form>

        <section class="card list">
            <h2>Événements ajoutés localement</h2>
            <ul v-if="customEvents.length">
                <li v-for="e in customEvents" :key="e.id">
                    <router-link :to="`/events/${e.id}`">{{ e.nom }}</router-link>
                    — <button @click="remove(e.id)" class="linklike">supprimer</button>
                </li>
            </ul>
            <p v-else>Aucun événement local pour le moment.</p>
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
    display: grid;
    gap: 12px;
}

label {
    display: grid;
    gap: 6px;
}

input,
textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 100%;
}

.row {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
}

button {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #333;
    background: #fff;
    cursor: pointer;
}

.linklike {
    border: none;
    padding: 0;
    text-decoration: underline;
    cursor: pointer;
    background: transparent;
}

.error {
    color: #b00020;
}

.info {
    color: #0b5;
}

.list ul {
    margin: 0;
    padding-left: 18px;
}
</style>

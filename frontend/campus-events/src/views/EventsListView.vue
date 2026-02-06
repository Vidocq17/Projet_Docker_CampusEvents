<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "../stores/auth";
import { fetchEventsLocal } from "../api/api";

const auth = useAuthStore();

const loading = ref(false);
const error = ref(null);
const events = ref([]);

const from = ref("");
const to = ref("");
const tagsText = ref("");

const filters = ref({
    from: null,
    to: null,
    tags: [],
});

function formatDate(iso) {
    try {
        return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
    } catch {
        return iso;
    }
}

function applyFilters() {
    filters.value = {
        from: from.value ? new Date(from.value) : null,
        to: to.value ? new Date(to.value) : null,
        tags: tagsText.value
            ? tagsText.value.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
            : [],
    };
}

function resetFilters() {
    from.value = "";
    to.value = "";
    tagsText.value = "";
    applyFilters();
}

const filteredEvents = computed(() => {
    const f = filters.value;

    return events.value
        .slice()
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .filter((e) => {
            const d = new Date(e.date);
            if (f.from && d < f.from) return false;
            if (f.to) {
                // inclure toute la journée "to"
                const end = new Date(f.to);
                end.setHours(23, 59, 59, 999);
                if (d > end) return false;
            }
            if (f.tags.length) {
                const eventTags = (e.tags || []).map((x) => String(x).toLowerCase());
                const ok = f.tags.every((t) => eventTags.includes(t));
                if (!ok) return false;
            }
            return true;
        });
});

onMounted(async () => {
    loading.value = true;
    error.value = null;
    try {
        events.value = await fetchEventsLocal();
        applyFilters();
    } catch (err) {
        error.value = err?.message || "Impossible de charger les événements.";
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <main class="page">
        <header class="header">
            <h1>Événements</h1>
            <div class="actions">
                <router-link v-if="auth.isAuthenticated" to="/event-form">Créer / Éditer</router-link>
                <router-link v-if="auth.isAdmin" to="/admin">Admin</router-link>
            </div>
        </header>

        <section class="filters card">
            <div>
                <label>Du</label>
                <input type="date" v-model="from" />
            </div>
            <div>
                <label>Au</label>
                <input type="date" v-model="to" />
            </div>
            <div class="grow">
                <label>Tags (séparés par des virgules)</label>
                <input v-model.trim="tagsText" placeholder="campus, tech" />
            </div>
            <button @click="applyFilters">Filtrer</button>
            <button @click="resetFilters" type="button">Reset</button>
        </section>

        <p v-if="loading">Chargement...</p>
        <p v-else-if="error" class="error">{{ error }}</p>

        <ul v-else class="list">
            <li v-for="e in filteredEvents" :key="e.id" class="card item">
                <img v-if="e.image" :src="e.image" :alt="e.nom" />
                <div class="content">
                    <h2>{{ e.nom }}</h2>
                    <p class="meta">
                        {{ formatDate(e.date) }} — {{ e.localisation }}
                    </p>
                    <p>{{ e.description_rapide }}</p>
                    <p class="tags">
                        <span v-for="t in e.tags" :key="t" class="tag">{{ t }}</span>
                    </p>
                    <router-link :to="`/events/${e.id}`">Voir le détail</router-link>
                </div>
            </li>
        </ul>
    </main>
</template>

<style scoped>
.page {
    max-width: 980px;
    margin: 24px auto;
    padding: 0 16px;
}

.header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.actions {
    display: flex;
    gap: 10px;
}

.card {
    border: 1px solid #ddd;
    border-radius: 10px;
    padding: 12px;
}

.filters {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    margin: 12px 0 18px;
    align-items: end;
}

.filters .grow {
    flex: 1;
    min-width: 240px;
}

label {
    display: block;
    font-size: 12px;
    opacity: 0.8;
    margin-bottom: 4px;
}

input {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    width: 100%;
}

button {
    padding: 10px 12px;
    border-radius: 6px;
    border: 1px solid #333;
    background: #fff;
    cursor: pointer;
}

.list {
    list-style: none;
    padding: 0;
    display: grid;
    gap: 12px;
}

.item {
    display: grid;
    grid-template-columns: 180px 1fr;
    gap: 12px;
}

img {
    width: 180px;
    height: 120px;
    object-fit: cover;
    border-radius: 8px;
    border: 1px solid #eee;
}

.meta {
    font-size: 13px;
    opacity: 0.8;
    margin-top: -6px;
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

@media (max-width: 720px) {
    .item {
        grid-template-columns: 1fr;
    }

    img {
        width: 100%;
        height: 180px;
    }
}
</style>

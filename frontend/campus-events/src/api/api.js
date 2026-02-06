import axios from "axios";
import eventsData from "../data/events.json";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

function getToken() {
  return localStorage.getItem("token");
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getErrorMessage(err) {
  if (err?.response?.data?.message) return err.response.data.message;
  if (err?.response?.data?.detail) return err.response.data.detail;
  if (err?.message) return err.message;
  return "Une erreur est survenue";
}

export async function login(payload) {
  const { data } = await api.post("/login", payload);
  return data;
}

export async function register(payload) {
  const { data } = await api.post("/register", payload);
  return data;
}

export async function me() {
  const { data } = await api.get("/me");
  return data;
}

export async function fetchEventsLocal() {
  // Simule une requête async (utile pour loading states)
  return Promise.resolve(eventsData);
}

export async function fetchEventByIdLocal(id) {
  const all = eventsData;
  return Promise.resolve(all.find((e) => e.id === id) || null);
}
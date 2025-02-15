import axios from "axios";
import { auth } from "@/lib/firebase";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3009";

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Add interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

export const createDecision = async (choices: string[], multiplier: number) => {
  try {
    const response = await api.post("/decisions", {
      choices,
      requiredComparisonsPerPair: multiplier,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating decision:", error);
    throw error;
  }
};

export const getNextComparison = async (decisionId: string) => {
  try {
    const response = await api.get(`/decisions/${decisionId}/comparisons/next`);
    return response.status === 204 ? null : response.data;
  } catch (error) {
    console.error("Error fetching next comparison:", error);
    throw error;
  }
};

export const submitComparison = async (
  decisionId: string,
  choice1Id: number,
  choice2Id: number,
  chosenOption: string
) => {
  try {
    const response = await api.post(`/decisions/${decisionId}/comparisons`, {
      choice1Id,
      choice2Id,
      chosenOption,
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting comparison:", error);
    throw error;
  }
};

export const getResults = async (decisionId: string) => {
  try {
    const response = await api.get(`/decisions/${decisionId}/results`);
    return response.status === 204 ? null : response.data;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
};

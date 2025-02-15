import { auth } from "@/lib/firebase";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3009";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
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

export const createDecision = async (
  title: string | null,
  choices: string[],
  multiplier: number
) => {
  try {
    const response = await api.post("/decisions", {
      title,
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

export const generateTitle = async (choices: string[]) => {
  try {
    const response = await api.post("/generate-title", {
      choices,
    });
    return response.data;
  } catch (error) {
    console.error("Error generating title:", error);
    throw error;
  }
};

export const getMyDecisions = async (
  type: "all" | "created" | "voted" = "all"
) => {
  try {
    const response = await api.get(
      `/my-decisions${type !== "all" ? `?type=${type}` : ""}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching decisions:", error);
    throw error;
  }
};

export const getVoterCount = async (decisionId: string) => {
  try {
    const response = await api.get(`/decisions/${decisionId}/voter-count`);
    return response.data;
  } catch (error) {
    console.error("Error fetching voter count:", error);
    throw error;
  }
};

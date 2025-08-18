// src/services/api.js
import axios from 'axios';

const API_URL = "http://localhost:5000/pamoja/api/saleArticles/report"; // adapte si nécessaire

export async function fetchSalesReport(filters) {
  try {
    const res = await axios.get(`${API_URL}/saleArticles/report`, {
      params: filters,
    });
    return res.data;
  } catch (error) {
    console.error("❌ Erreur API fetchSalesReport:", error);
    throw error;
  }
}

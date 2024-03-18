import axios from "axios";
import { Coin } from "./type";

export const apiKey = import.meta.env.VITE_API_KEY;
export const baseURL = import.meta.env.VITE_API_URL;

export async function fetchTopCoins(limit = 200): Promise<Coin[]> {
  try {
    const response = await axios.get(`/api/v1/cryptocurrency/listings/latest`, {
      params: { limit },
      headers: { 'X-CMC_PRO_API_KEY': apiKey },
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching top coins: ", error);
    return [];
  }
}
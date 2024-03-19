import axios from "axios";
import { Coin, Historical } from "./type";

export const apiKey = import.meta.env.VITE_API_KEY;
export const baseURL = import.meta.env.VITE_API_URL;


// LIST
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


// HISTORICAL
export async function fetchHistoricalData(
  coinId: string, startDate: string, count = 365
): Promise<Historical | null> {
  try {
    const params = `?id=${coinId}&time_start=${startDate}&count=${count}&interval=daily`;
    const response = await axios.get(`/api/v2/cryptocurrency/ohlcv/historical${params}`, {
      headers: {
        'X-CMC_PRO_API_KEY': apiKey,
      },
    });

    // 데이터 열 추가
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching data for ${coinId}: `, error);
    return null;
  }
}


export function formattedDate (date: Date) {
  return date.getFullYear() + '-' + String(date.getMonth() + 1).padStart(2, '0') + '-' + date.getDate();
}
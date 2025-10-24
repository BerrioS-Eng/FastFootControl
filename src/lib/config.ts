// Centralized app configuration
// Reads API base URL from the environment with a sensible default for local/dev

export const API_BASE_URL = "https://fast-food-back-uh35.onrender.com";
//process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
//http://172.16.0.242:8080
export const ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    sales: `${API_BASE_URL}/sales`,
    reports: `${API_BASE_URL}/reports`,
} as const;

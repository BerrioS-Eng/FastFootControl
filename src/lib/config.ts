// Centralized app configuration
// Reads API base URL from the environment with a sensible default for local/dev

export const API_BASE_URL = "https://fast-food-back-uh35.onrender.com";
//process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "")
export const ENDPOINTS = {
    products: `${API_BASE_URL}/products`,
    sales: `${API_BASE_URL}/sales`,
    reports: `${API_BASE_URL}/reports`,
    expenses: `${API_BASE_URL}/expenses`,
    auth: `${API_BASE_URL}/auth`,
    users: `${API_BASE_URL}/users`,
} as const;

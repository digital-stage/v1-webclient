export const AUTH_URL: string = process.env.AUTH_URL || "https://auth.digital-stage.org";
export const ROUTERS_URL: string = process.env.ROUTERS_URL || "https://routers.digital-stage.org";
export const API_URL: string = process.env.API_URL || process.env.NODE_ENV === "production" ? "wss://api.digital-stage.org" : "ws://localhost:4000";

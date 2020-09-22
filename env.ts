export const AUTH_URL: string = "http://localhost:5000";
export const API_URL: string = process.env.NODE_ENV === "production" ? "wss://api.digital-stage.org/" : "ws://localhost:4000";

export const AUTH_URL: string = "https://auth.api.digital-stage.org";
export const API_URL: string = process.env.NODE_ENV === "production" ? "wssd//api.digital-stage.org/" : "ws://localhost:4000";

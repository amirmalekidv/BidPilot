// Edit these values or set them in .env
// Providers: "openai" | "deepseek"

export const API_PROVIDER = import.meta.env.VITE_API_PROVIDER || 'deepseek'

export const API_KEY =
  API_PROVIDER === 'deepseek'
    ? import.meta.env.VITE_DEEPSEEK_API_KEY || '[PUT_API_KEY_HERE]'
    : import.meta.env.VITE_OPENAI_API_KEY || '[PUT_API_KEY_HERE]'

export const MODEL = import.meta.env.VITE_MODEL || '[PUT_MODEL_NAME_HERE]'

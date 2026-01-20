// Configuration for Backend API
// Backend Team: Update VITE_API_URL in .env or hardcode here
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Toggle to enable/disable real-time chat if backend is missing
export const ENABLE_CHAT_SOCKET = Boolean(import.meta.env.VITE_API_URL);

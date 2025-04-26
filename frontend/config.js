import * as dotenv from "dotenv";
dotenv.config();

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

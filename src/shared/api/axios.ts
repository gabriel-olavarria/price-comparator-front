import axios from "axios";
import { environment } from "../config/environment";

export const httpClient = axios.create({
    baseURL: environment.apiUrl,
    timeout: 90000,
    headers: {
        "Content-Type": "application/json",
    },
});
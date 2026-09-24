interface Environment {
    apiUrl: string;
}
export const environment: Environment = {
    apiUrl: import.meta.env.VITE_API_URL,
};
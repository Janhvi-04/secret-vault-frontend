import axios from "axios";
console.log("Current API URL:", import.meta.env.VITE_API_URL);
const API=axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
API.interceptors.request.use((config)=>{
    const token=localStorage.getItem('token');
    if(token) {
        config.headers['x-auth-token']=token;
    }
    return config;
});
export default API;
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  // 1. LocalStorage se 'user' nikalen (kyunki aap wahi use kar rahi hain)
  const userData = localStorage.getItem("user");
  
  if (userData) {
    const user = JSON.parse(userData);
    // 2. Check karein ki token user object ke andar hai ya nahi
    if (user && user.token) {
      req.headers.Authorization = `Bearer ${user.token}`;
    }
  }
  
  return req;
});

export default API;
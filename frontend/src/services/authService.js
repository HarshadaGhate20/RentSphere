// 🟢 FIX: Import 'api' as a named export or default depending on your api.js
import api from "./api"; 

export const login = async (user) => {
    // If your api.js uses axios.create, use it directly as an object:
    const response = await api.post("/auth/login", user);
    return response.data;
};

export const register = async (user) => {
    const payload = {
        fullName: user.name,
        email: user.email,
        phone: user.phone,
        password: user.password,
        role: user.role.toUpperCase()
    };

    // 🟢 This will now resolve perfectly without crashing
    const response = await api.post("/auth/register", payload);
    return response.data;
};

export const requestPasswordOtp = async (email) => (await api.post("/auth/forgot-password", { email })).data;
export const verifyPasswordOtp = async (email, otp) => (await api.post("/auth/verify-otp", { email, otp })).data;
export const resetPassword = async (email, otp, newPassword) => (await api.post("/auth/reset-password", { email, otp, newPassword })).data;

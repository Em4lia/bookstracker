import { jwtDecode } from 'jwt-decode';

export const login = (token) => {
    localStorage.setItem('token', token);
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const getCurrentUser = () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        return jwtDecode(token);
    } catch (error) {
        console.error("Error decoding token", error);
        return null;
    }
};

export const isLoggedIn = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const isAdmin = () => {
    const user = getCurrentUser();
    return user && user.role === 'admin';
};
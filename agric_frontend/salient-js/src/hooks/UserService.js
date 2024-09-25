import axios from "axios";

class UserService {
    static BASE_URL = "http://localhost:8080";

    // Utility to get the token
    static getToken() {
        return localStorage.getItem('token');
    }

    static async login(email, password) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/login`, { email, password });
            return response.data;
        } catch (err) {
            console.error("Error during login:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async register(userData, token) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err) {
            console.error("Error during registration:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async UserRegister(userData) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/auth/register`, userData);
            return response.data;
        } catch (err) {
            console.error('Error during registration:', err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async resendVerification(email) {
        try {
            const response = await axios.post(`${UserService.BASE_URL}/resend-verification`, null, {
                params: { email },
            });
            return response.data;
        } catch (err) {
            console.error("Error resending verification email:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async getAllUsers() {
        const token = this.getToken();
        try {
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-all-users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err) {
            console.error("Error fetching users:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async getUserProfile() {
        const token = this.getToken();
        try {
            const response = await axios.get(`${UserService.BASE_URL}/user/profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err) {
            console.error("Error fetching user profile:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async getProfile() {
        const token = this.getToken();
        try {
            const response = await axios.get(`${UserService.BASE_URL}/adminuser/get-profile`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err) {
            console.error("Error fetching admin profile:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async getUserById(userId) {
        const token = this.getToken();
        try {
            console.log(`Fetching user data for ID: ${userId}`);
            const response = await axios.get(`${UserService.BASE_URL}/admin/get-users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            console.log('UserService response:', response.data); // Log the entire response
            return response.data;
        } catch (err) {
            console.error("Error fetching user by ID:", err.response ? err.response.data : err.message);
            throw err;
        }
    }
    
    

    static async deleteUser(userId) {
        const token = this.getToken();
        try {
            const response = await axios.delete(`${UserService.BASE_URL}/admin/delete/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err) {
            console.error("Error deleting user:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async updateUser(userId, userData) {
        const token = this.getToken();
        try {
            const response = await axios.put(`${UserService.BASE_URL}/admin/update/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err) {
            console.error("Error updating user:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async updateUserForUser(userId, userData) {
        const token = this.getToken();
        try {
            const response = await axios.put(`${UserService.BASE_URL}/adminuser/update/${userId}`, userData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err) {
            console.error("Error updating user:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static async makePayment(paymentData) {
        const token = this.getToken();
        try {
            const response = await axios.post(`${UserService.BASE_URL}/api/payment/stkpush`, paymentData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err) {
            console.error("Error making payment:", err.response ? err.response.data : err.message);
            throw err;
        }
    }
    

   

    static async getPayedUserDetailsById(userId) {
        const token = this.getToken();
        try {
            const response = await axios.get(`${UserService.BASE_URL}/api/payment/user/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        } catch (err) {
            console.error("Error fetching user by ID:", err.response ? err.response.data : err.message);
            throw err;
        }
    }

    static logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
    }

    static isAuthenticated() {
        return !!this.getToken();
    }

    static isAdmin() {
        const role = localStorage.getItem('role');
        return role === 'ADMIN';
    }

    static isUser() {
        const role = localStorage.getItem('role');
        return role === 'USER';
    }

    static adminOnly() {
        return this.isAuthenticated() && this.isAdmin();
    }
}

export default UserService;

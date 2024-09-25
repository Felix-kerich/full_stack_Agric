import axios from "axios";

class PaypalPayment {
    static BASE_URL = "http://localhost:8081";

    // Utility to get the token
    static getToken() {
        return localStorage.getItem('token');
    }

    // Function to make the PayPal payment
    static async makePaypalPayment(paymentData) {
        const token = this.getToken();  // Retrieve the token
        if (!token) {
            throw new Error('Authorization token is missing.');
        }

        try {
            console.log('Initiating PayPal payment with data:', paymentData);

            const response = await axios.post(
                `${this.BASE_URL}/api/paypal/payment/create`,
                paymentData,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            console.log('PayPal Payment Response:', response.data);

            // Assuming response contains a redirect_url
            if (response.data && response.data.redirect_url) {
                return response.data.redirect_url; // Return the redirect URL for the PayPal payment
            } else {
                throw new Error('No redirect URL found in PayPal response.');
            }

        } catch (err) {
            this.handleError(err);
            throw err;  // Re-throw the error for further handling
        }
    }

    // Centralized error handling
    static handleError(err) {
        if (err.response) {
            // Handle specific status codes
            switch (err.response.status) {
                case 400:
                    console.error("Bad Request: Invalid syntax.", err.response.data);
                    break;
                case 401:
                    console.error("Unauthorized: Client must authenticate.", err.response.data);
                    break;
                case 500:
                    console.error("Internal Server Error: A condition prevented the request.", err.response.data);
                    break;
                default:
                    console.error(`Unexpected error occurred with status ${err.response.status}:`, err.response.data);
            }
        } else if (err.request) {
            // No response received
            console.error("No response received from server. Possible network error:", err.request);
        } else {
            // Other errors
            console.error("Error in setting up request:", err.message);
        }
    }
}

export default PaypalPayment;

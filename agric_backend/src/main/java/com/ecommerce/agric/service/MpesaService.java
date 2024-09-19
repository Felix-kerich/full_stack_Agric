package com.ecommerce.agric.service;

import com.ecommerce.agric.dtos.PaymentDTO;
import com.ecommerce.agric.models.OurUsers;
import com.ecommerce.agric.models.Payment;
import com.ecommerce.agric.repository.PaymentRepo;
import com.ecommerce.agric.repository.UsersRepo;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Base64;
import java.util.Date;

@Service
public class MpesaService {

    @Autowired
    private PaymentRepo paymentRepo;

    @Autowired
    private UsersRepo ourUsersRepo; // Repository to find users

    private final OkHttpClient client = new OkHttpClient().newBuilder().build();

    private static final Logger logger = LoggerFactory.getLogger(MpesaService.class);

    // Generates the password for Mpesa authentication
    private String generatePassword(String shortCode, String passkey, String timestamp) {
        String dataToEncode = shortCode + passkey + timestamp;
        return Base64.getEncoder().encodeToString(dataToEncode.getBytes());
    }

    // Retrieves the access token required for Mpesa API requests
    private String getAccessToken() throws IOException {
        String consumerKey = "w2ABSyiW0KFRn8ZxODClm2AALpO15jO4uhZ0jFmtGtyWPAFQ"; 
        String consumerSecret = "aBSGz6o2w2Sgjn5kY7tieUONCPQAEq4YBuPOCaoDp0wW6XgGNsHsvG6TFjJmj9Zm"; 
        String auth = Credentials.basic(consumerKey, consumerSecret);

        Request request = new Request.Builder()
                .url("https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials")
                .get()
                .addHeader("Authorization", auth)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (response.isSuccessful()) {
                String responseBody = response.body().string();
                logger.info("Access token response: {}", responseBody);
                JsonObject jsonObject = JsonParser.parseString(responseBody).getAsJsonObject();
                return jsonObject.get("access_token").getAsString(); // Extract the access token from the response
            } else {
                String responseBody = response.body().string();
                logger.error("Failed to fetch access token, response: {}", responseBody);
                throw new IOException("Failed to fetch access token, response: " + responseBody);
            }
        }
    }

    // Method to perform the Mpesa STK Push
    public String performStkPush(PaymentDTO paymentDTO) throws IOException {
        // Fetch the user by ID
        OurUsers user = ourUsersRepo.findById(paymentDTO.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Validate user details based on existing fields
        if (!user.getEmail().equals(paymentDTO.getEmail()) || !user.getName().equals(paymentDTO.getName())) {
            throw new IllegalArgumentException("User details do not match!");
        }

        String shortCode = "174379";
        String passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
        String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String password = generatePassword(shortCode, passkey, timestamp);
        String accessToken = getAccessToken();

        MediaType mediaType = MediaType.parse("application/json");
        String json = "{"
                + "\"BusinessShortCode\": \"" + shortCode + "\","
                + "\"Password\": \"" + password + "\","
                + "\"Timestamp\": \"" + timestamp + "\","
                + "\"TransactionType\": \"CustomerPayBillOnline\","
                + "\"Amount\": " + paymentDTO.getAmount() + ","
                + "\"PartyA\": \"" + paymentDTO.getPhoneNumber() + "\","
                + "\"PartyB\": \"" + shortCode + "\","
                + "\"PhoneNumber\": \"" + paymentDTO.getPhoneNumber() + "\","
                + "\"CallBackURL\": \"https://eaf9-102-215-32-244.ngrok-free.app/api/mpesa/callback\","
                + "\"AccountReference\": \"" + paymentDTO.getName() + "\","
                + "\"TransactionDesc\": \"Payment of product\""
                + "}";

        logger.info("STK Push request JSON: {}", json);

        @SuppressWarnings("deprecation")
        RequestBody body = RequestBody.create(mediaType, json);
        Request request = new Request.Builder()
                .url("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest")
                .post(body)
                .addHeader("Content-Type", "application/json")
                .addHeader("Authorization", "Bearer " + accessToken)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String responseBody = response.body().string();
                logger.error("STK Push failed with status: {} and response body: {}", response.code(), responseBody);
                throw new IOException("Failed STK Push, response: " + responseBody);
            }
            String responseBody = response.body().string();
            logger.info("STK Push response: {}", responseBody);

            // Save payment details
            Payment payment = new Payment();
            payment.setEmail(paymentDTO.getEmail());
            payment.setName(paymentDTO.getName());
            payment.setPhoneNumber(paymentDTO.getPhoneNumber());
            payment.setAmount(paymentDTO.getAmount());
            payment.setTransactionId("Pending"); // Update this with actual ID when received from callback
            payment.setIsPaymentComplete(false);
            paymentRepo.save(payment);

            return responseBody;
        }
    }
}

package com.payment.paypal_rest_api.controller;

import com.payment.paypal_rest_api.dtos.PaymentRequest;
import com.payment.paypal_rest_api.dtos.PaymentResponseDTO;
import com.payment.paypal_rest_api.service.PaypalService;
import com.paypal.api.payments.Payment;
import com.paypal.base.rest.PayPalRESTException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/paypal")
@RequiredArgsConstructor
@Slf4j
public class PaymentController {
    private final PaypalService paypalService;

    @PostMapping("/payment/create")
    public ResponseEntity<String> createPayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            Payment payment = paypalService.createPayment(paymentRequest);
            for (com.paypal.api.payments.Links links : payment.getLinks()) {
                if (links.getRel().equals("approval_url")) {
                    return ResponseEntity.ok(links.getHref());
                }
            }
        } catch (PayPalRESTException e) {
            log.error("Error Occurred: ", e);
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Payment creation failed.");
    }

    @PostMapping("/payment/success")
    public ResponseEntity<PaymentResponseDTO> paymentSuccess(
          @RequestParam("paymentId") String paymentId,
          @RequestParam("PayerID") String payerId
    ) {
        try {
            log.debug("Executing payment with paymentId: " + paymentId + " and payerId: " + payerId);
            Payment payment = paypalService.executePayment(paymentId, payerId);
            log.debug("Payment executed successfully. Payment state: " + payment.getState());

            if (payment.getState().equals("approved")) {
                paypalService.savePaymentDetails(payment);
                return ResponseEntity.ok(new PaymentResponseDTO("success", "Payment saved successfully."));
            } else {
                log.debug("Payment not approved.");
                return ResponseEntity.ok(new PaymentResponseDTO("failure", "Payment not approved."));
            }
        } catch (PayPalRESTException e) {
            log.error("PayPal error occurred: ", e);
        } catch (Exception e) {
            log.error("General error occurred: ", e);
        }

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new PaymentResponseDTO("failure", "Payment failed."));
    }

    @GetMapping("/payment/success")
    public ResponseEntity<String> paymentSuccessRedirect(
        @RequestParam("paymentId") String paymentId,
        @RequestParam("token") String token,
        @RequestParam("PayerID") String payerId
    ) {
        // Redirect to the frontend success URL with necessary query parameters.
        return ResponseEntity.status(HttpStatus.SEE_OTHER)
                .header("Location", "http://localhost:3000/payment/success?paymentId=" + paymentId + "&PayerID=" + payerId)
                .build();
    }

    @GetMapping("/payment/cancel")
    public String paymentCancel() {
        return "Payment canceled by the user.";
    }

    @GetMapping("/payment/error")
    public String paymentError() {
        return "An error occurred during the payment process.";
    }
}

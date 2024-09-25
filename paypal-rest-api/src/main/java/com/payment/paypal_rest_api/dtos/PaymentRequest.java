package com.payment.paypal_rest_api.dtos;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class PaymentRequest {
    private String method;
    private Double amount;
    private String currency;
    private String description;
    // private String successUrl = "http://localhost:8081/api/paypal/payment/success";
    // private String cancelUrl = "http://localhost:8081/api/paypal/payment/cancel";

}

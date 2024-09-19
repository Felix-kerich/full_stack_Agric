package com.ecommerce.agric.dtos;

import com.ecommerce.agric.models.Payment;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
public class PaymentDTO {

    private Integer id;
    private String email;
    private String name;
    private String phoneNumber;
    private double amount;
    private String transactionId;
    private Boolean isPaymentComplete;
    private String message;
    private String error;
    private Payment payment;

    

}

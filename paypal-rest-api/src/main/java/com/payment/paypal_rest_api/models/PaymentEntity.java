package com.payment.paypal_rest_api.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.OffsetDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "payments")
public class PaymentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String paypalPaymentId;
    private String intent;
    private String state;
    private String cart;
    private String paymentMethod;
    private String payerStatus;
    private String payerId;
    private String payerEmail;
    private String payerFirstName;
    private String payerLastName;
    private String currency;
    private Double totalAmount;
    private String transactionId;
    private String transactionState;
    private Double transactionFee;    
    private String paymentMode;
    private OffsetDateTime createTime;
    private OffsetDateTime updateTime;
}

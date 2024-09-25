package com.payment.paypal_rest_api.service;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import com.payment.paypal_rest_api.dtos.PaymentRequest;
import com.payment.paypal_rest_api.models.PaymentEntity;
import com.payment.paypal_rest_api.repositories.PaymentRepository;
import com.paypal.api.payments.Amount;
import com.paypal.api.payments.Payer;
import com.paypal.api.payments.Payment;
import com.paypal.api.payments.PaymentExecution;
import com.paypal.api.payments.RedirectUrls;
import com.paypal.api.payments.Transaction;
import com.paypal.base.rest.APIContext;
import com.paypal.base.rest.PayPalRESTException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PaypalService {
    private final APIContext apiContext; 
    private final PaymentRepository paymentRepository; 
    private static final Logger logger = LoggerFactory.getLogger(PaypalService.class);

    public Payment createPayment(PaymentRequest paymentRequest) throws PayPalRESTException {
        Amount amount = new Amount();
        amount.setCurrency(paymentRequest.getCurrency());
        amount.setTotal(String.format(Locale.forLanguageTag(paymentRequest.getCurrency()), "%.2f", paymentRequest.getAmount()));
        
        Transaction transaction = new Transaction();
        transaction.setDescription(paymentRequest.getDescription());
        transaction.setAmount(amount);

        List<Transaction> transactions = new ArrayList<>();
        transactions.add(transaction);

        Payer payer = new Payer();
        payer.setPaymentMethod(paymentRequest.getMethod());

        Payment payment = new Payment();
        payment.setIntent("sale");
        payment.setPayer(payer);
        payment.setTransactions(transactions);
        
        RedirectUrls redirectUrls = new RedirectUrls();
        redirectUrls.setCancelUrl("http://localhost:8081/api/paypal/payment/cancel");
        redirectUrls.setReturnUrl("http://localhost:8081/api/paypal/payment/success");
        
        payment.setRedirectUrls(redirectUrls);
        return payment.create(apiContext);
    }

    public Payment executePayment(String paymentId, String payerId) throws PayPalRESTException {
        Payment payment = new Payment();
        payment.setId(paymentId);

        PaymentExecution paymentExecution = new PaymentExecution();
        paymentExecution.setPayerId(payerId);

        return payment.execute(apiContext, paymentExecution);
    }

    public void savePaymentDetails(Payment payment) {
        // Create a new PaymentEntity and populate it with payment details
        PaymentEntity paymentEntity = new PaymentEntity();
        paymentEntity.setPaypalPaymentId(payment.getId());
        paymentEntity.setIntent(payment.getIntent());
        paymentEntity.setState(payment.getState());
        paymentEntity.setCart(payment.getCart());
        paymentEntity.setPaymentMethod(payment.getPayer().getPaymentMethod());
        paymentEntity.setPayerStatus(payment.getPayer().getStatus());
        paymentEntity.setPayerId(payment.getPayer().getPayerInfo().getPayerId());
        paymentEntity.setPayerEmail(payment.getPayer().getPayerInfo().getEmail());
        paymentEntity.setPayerFirstName(payment.getPayer().getPayerInfo().getFirstName());
        paymentEntity.setPayerLastName(payment.getPayer().getPayerInfo().getLastName());
        paymentEntity.setCurrency(payment.getTransactions().get(0).getAmount().getCurrency());
        paymentEntity.setTotalAmount(Double.valueOf(payment.getTransactions().get(0).getAmount().getTotal()));
        paymentEntity.setTransactionId(payment.getTransactions().get(0).getRelatedResources().get(0).getSale().getId());
        paymentEntity.setTransactionState(payment.getTransactions().get(0).getRelatedResources().get(0).getSale().getState());
        paymentEntity.setTransactionFee(Double.valueOf(payment.getTransactions().get(0).getRelatedResources().get(0).getSale().getTransactionFee().getValue()));
        paymentEntity.setPaymentMode(payment.getTransactions().get(0).getRelatedResources().get(0).getSale().getPaymentMode());
        paymentEntity.setCreateTime(OffsetDateTime.parse(payment.getCreateTime()));
        paymentEntity.setUpdateTime(OffsetDateTime.parse(payment.getUpdateTime()));
        
        // Save the payment entity to the database
        paymentRepository.save(paymentEntity);
        logger.debug("Payment saved successfully: {}", paymentEntity);
    }
}

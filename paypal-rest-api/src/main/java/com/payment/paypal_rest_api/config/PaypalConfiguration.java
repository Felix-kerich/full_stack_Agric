package com.payment.paypal_rest_api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.paypal.base.rest.APIContext;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class PaypalConfiguration {

    @Value("${paypal.client-id}")
    private String clientId;

    @Value("${paypal.client-secret}")
    private String clientSecret;

    @Value("${paypal.mode}")
    private String mode;


    @Bean
    public APIContext apiContext(){
        return new APIContext(clientId, clientSecret, mode);
    }

}

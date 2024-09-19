package com.ecommerce.agric.service.mailing;

import org.springframework.web.util.UriComponentsBuilder;

import com.ecommerce.agric.models.OurUsers;

public class AccountVerificationEmailContext extends AbstractEmailContext {
    private String token;

    @Override
    public <T> void init(T context) {
        OurUsers user = (OurUsers) context; 
        put("firstName", user.getName());
        setTemplateLocation("mailing/email-verification");
        setSubject("Complete your registration");
        setFrom("oddsstore.com@gmail.com");
        setTo(user.getEmail());
    }

    public void setToken(String token) {
        this.token = token;
        put("token", token);
    }

    public void buildVerificationUrl(final String baseURL, final String token) {
        final String url = UriComponentsBuilder.fromHttpUrl(baseURL)
                .path("/register/verify")
                .queryParam("token", token)
                .toUriString();
        put("verificationURL", url);
        setBody("Please verify your email using the following link: " + url); // Set the body here
    }

    public String getVerificationURL() {
        return (String) getContext().get("verificationURL");
    }
}



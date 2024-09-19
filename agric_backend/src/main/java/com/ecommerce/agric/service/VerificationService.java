package com.ecommerce.agric.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.ecommerce.agric.exeptions.InvalidTokenException;
import com.ecommerce.agric.models.OurUsers;
import com.ecommerce.agric.models.SecureToken;
import com.ecommerce.agric.repository.UsersRepo;
import com.ecommerce.agric.service.mailing.AccountVerificationEmailContext;
import com.ecommerce.agric.service.mailing.EmailService;

import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class VerificationService {

    private static final Logger logger = LoggerFactory.getLogger(VerificationService.class);

    @Autowired
    private DefaultSecureTokenService secureTokenService;

    @Autowired
    private UsersRepo userRepository;

    @Autowired
    private EmailService emailService;

    @Value("${app.base.url}")
    private String baseURL; // Externalize the base URL

    @Transactional
    public boolean verifyUser(String token) throws InvalidTokenException {
        logger.info("Verifying user with token: {}", token);

        // Retrieve the secure token
        SecureToken secureToken = secureTokenService.findByToken(token);

        // Check if the token is valid or expired
        if (secureToken == null || secureToken.isExpired()) {
            logger.error("Token is not valid or expired.");
            throw new InvalidTokenException("Token is not valid or expired.");
        }

        // Fetch the user associated with the secure token
        Optional<OurUsers> userOptional = userRepository.findById(secureToken.getUser().getId());
        if (userOptional.isEmpty()) {
            logger.error("User associated with the token not found.");
            return false;
        }

        OurUsers user = userOptional.get();

        // Update user verification status
        user.setAccountVerified(true);
        user.setLoginDisabled(false);  // Allow the user to log in after verification
        userRepository.save(user);

        // Remove the token after verification
        secureTokenService.removeToken(secureToken);

        logger.info("User verified successfully.");
        return true;
    }

    @Transactional
    public String resendVerificationToken(String email) {
        logger.info("Resending verification token to email: {}", email);

        // Fetch the user associated with the provided email
        Optional<OurUsers> userOptional = userRepository.findByEmail(email);
        if (userOptional.isEmpty()) {
            logger.error("User not found.");
            return "User not found";
        }

        OurUsers user = userOptional.get();

        // Check if the user is already verified
        if (user.isAccountVerified()) {
            logger.info("User is already verified.");
            return "User is already verified";
        }

        // Remove any existing tokens for this user
        secureTokenService.removeTokensByUser(user);

        // Generate a new verification token
        SecureToken newToken = secureTokenService.createSecureToken(user.getEmail());

        // Create email context
        AccountVerificationEmailContext emailContext = new AccountVerificationEmailContext();
        emailContext.init(user);
        emailContext.setToken(newToken.getToken());
        emailContext.buildVerificationUrl(baseURL, newToken.getToken());
        emailContext.setBody("Please verify your email using the following link: " + emailContext.getVerificationURL());

        try {
            // Send the new verification token to the user via email
            emailService.sendMail(emailContext);
        } catch (Exception e) {
            logger.error("Failed to send verification email: {}", e.getMessage());
            return "Failed to send verification email";
        }

        logger.info("Verification email sent successfully.");
        return "Verification email sent";
    }
}

package com.ecommerce.agric.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.ecommerce.agric.models.OurUsers;
import com.ecommerce.agric.models.SecureToken;
import com.ecommerce.agric.repository.SecureTokenRepo;
import com.ecommerce.agric.repository.UsersRepo;
import com.ecommerce.agric.security.JWTUtils;

import java.time.LocalDateTime;

@Service
public class DefaultSecureTokenService implements SecureTokenService {

    @Value("${app.token.validity.seconds:86400}") // 24 hours in seconds by default
    private int tokenValidityInSeconds;

    @Autowired
    private SecureTokenRepo secureTokenRepository;

    @Autowired
    private UsersRepo ourUserRepository;

    @Autowired
    private JWTUtils jwtUtils;

    @Autowired
    private OurUserDetailsService ourUserDetailsService;

    @Override
    public SecureToken createSecureToken(String username) {
        // Load the user details
        UserDetails userDetails = ourUserDetailsService.loadUserByUsername(username);

        // Generate JWT token
        String tokenValue = jwtUtils.generateToken(userDetails);

        // Fetch user entity from database
        OurUsers user = ourUserRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create and set up the secure token
        SecureToken secureToken = new SecureToken();
        secureToken.setToken(tokenValue);
        secureToken.setExpireAt(LocalDateTime.now().plusSeconds(tokenValidityInSeconds));
        secureToken.setUser(user);  // Associate the user with the token

        // Save the token
        this.saveSecureToken(secureToken);

        return secureToken;
    }

    @Override
    public void saveSecureToken(SecureToken secureToken) {
        secureTokenRepository.save(secureToken);
    }

    @Override
    public SecureToken findByToken(String token) {
        return secureTokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));
    }

    @Override
    public void removeToken(SecureToken token) {
        secureTokenRepository.delete(token);
    }

    @Override
    public void removeTokensByUser(OurUsers user) {
        secureTokenRepository.deleteByUser(user); // Implement the deletion by user
    }

    @Override
    public void removeTokenByUserId(Long userId) {
        secureTokenRepository.deleteByUserId(userId);
    }
}

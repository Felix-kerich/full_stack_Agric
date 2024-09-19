package com.ecommerce.agric.service;

import com.ecommerce.agric.models.OurUsers;
import com.ecommerce.agric.models.SecureToken;

public interface SecureTokenService {

    SecureToken createSecureToken(String username);

    void saveSecureToken(SecureToken secureToken);

    SecureToken findByToken(String token);

    void removeToken(SecureToken token);

    void removeTokenByUserId(Long userId);

    void removeTokensByUser(OurUsers user); 
}

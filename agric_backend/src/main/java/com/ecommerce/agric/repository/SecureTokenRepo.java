package com.ecommerce.agric.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.agric.models.OurUsers;
import com.ecommerce.agric.models.SecureToken;

import java.util.Optional;

@Repository
public interface SecureTokenRepo extends JpaRepository<SecureToken, Long> {
    
    Optional<SecureToken> findByToken(String token);

    void deleteByUserId(Long userId);

    void deleteByUser(OurUsers user);
}

package com.ecommerce.agric.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.ecommerce.agric.models.OurUsers;

import java.util.Optional;

public interface UsersRepo extends JpaRepository<OurUsers, Integer> {

    Optional<OurUsers> findByEmail(String email);

    
}
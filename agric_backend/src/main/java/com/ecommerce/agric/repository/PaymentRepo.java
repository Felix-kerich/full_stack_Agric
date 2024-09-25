package com.ecommerce.agric.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ecommerce.agric.models.Payment;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long>{    


}

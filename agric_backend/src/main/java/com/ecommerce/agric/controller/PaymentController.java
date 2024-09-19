package com.ecommerce.agric.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.agric.dtos.PaymentDTO;
import com.ecommerce.agric.models.OurUsers;
import com.ecommerce.agric.repository.UsersRepo;
import com.ecommerce.agric.service.MpesaService;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private MpesaService mpesaService;

    @Autowired
    private UsersRepo usersRepo;

    @PostMapping("/stkpush")
    public ResponseEntity<String> performStkPush(@RequestBody PaymentDTO paymentDTO) {
        try {
            String response = mpesaService.performStkPush(paymentDTO);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/user/{id}")
    public ResponseEntity<OurUsers> getUserById(@PathVariable("id") Integer id) {
        try {
            OurUsers user = usersRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null);
        }
    }
}


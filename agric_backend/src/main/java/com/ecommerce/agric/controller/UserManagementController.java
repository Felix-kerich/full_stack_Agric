package com.ecommerce.agric.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.agric.dtos.ReqRes;
import com.ecommerce.agric.exeptions.InvalidTokenException;
import com.ecommerce.agric.models.OurUsers;
import com.ecommerce.agric.service.UsersManagementService;
import com.ecommerce.agric.service.VerificationService;

@RestController
public class UserManagementController {

    private final UsersManagementService usersManagementService;
    private final VerificationService verificationService;

    @Autowired
    public UserManagementController(UsersManagementService usersManagementService, VerificationService verificationService) {
        this.usersManagementService = usersManagementService;
        this.verificationService = verificationService;
    }

    @PostMapping("/auth/register")
    public ResponseEntity<ReqRes> register(@RequestBody ReqRes reg) {
        return ResponseEntity.ok(usersManagementService.register(reg));
    }

    @GetMapping("/register/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam("token") String token) throws InvalidTokenException {
        boolean isVerified = verificationService.verifyUser(token);
        if (isVerified) {
            return ResponseEntity.ok("Account verified successfully. You can now log in.");
        } else {
            return ResponseEntity.status(400).body("Invalid or expired verification token.");
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<String> resendVerification(@RequestParam("email") String email) {
        // Call the service to resend the verification email
        String result = verificationService.resendVerificationToken(email);

        // Check the result and respond accordingly
        if (result.equals("Verification email sent")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(400).body(result);
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<ReqRes> login(@RequestBody ReqRes req) {
        return ResponseEntity.ok(usersManagementService.login(req));
    }

    @PostMapping("/auth/refresh")
    public ResponseEntity<ReqRes> refreshToken(@RequestBody ReqRes req) {
        return ResponseEntity.ok(usersManagementService.refreshToken(req));
    }

    @GetMapping("/admin/get-all-users")
    public ResponseEntity<ReqRes> getAllUsers() {
        return ResponseEntity.ok(usersManagementService.getAllUsers());
    }

    @GetMapping("/admin/get-users/{userId}")
    public ResponseEntity<ReqRes> getUserById(@PathVariable Integer userId) {
    System.out.println("Fetching user with ID: " + userId);
    ReqRes response = usersManagementService.getUsersById(userId);
    System.out.println("Fetched user data: " + response);
    return ResponseEntity.ok(response);
}


    @PutMapping("/admin/update/{userId}")
    public ResponseEntity<ReqRes> updateUser(@PathVariable Integer userId, @RequestBody OurUsers reqres) {
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    @PutMapping("/adminuser/update/{userId}")
    public ResponseEntity<ReqRes> updateUserForUser(@PathVariable Integer userId, @RequestBody OurUsers reqres) {
        return ResponseEntity.ok(usersManagementService.updateUser(userId, reqres));
    }

    @GetMapping("/adminuser/get-profile")
    public ResponseEntity<ReqRes> getMyProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        ReqRes response = usersManagementService.getMyInfo(email);
        return ResponseEntity.status(response.getStatusCode()).body(response);
    }

    @DeleteMapping("/admin/delete/{userId}")
    public ResponseEntity<ReqRes> deleteUser(@PathVariable Integer userId) {
        return ResponseEntity.ok(usersManagementService.deleteUser(userId));
    }

    //...
}

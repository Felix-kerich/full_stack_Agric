package com.ecommerce.agric.service;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.ecommerce.agric.dtos.ReqRes;
import com.ecommerce.agric.models.OurUsers;
import com.ecommerce.agric.models.SecureToken;
import com.ecommerce.agric.repository.UsersRepo;
import com.ecommerce.agric.security.JWTUtils;
import com.ecommerce.agric.service.mailing.AccountVerificationEmailContext;
import com.ecommerce.agric.service.mailing.EmailService;

import jakarta.mail.MessagingException;

import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class UsersManagementService {

    @Autowired
    private UsersRepo usersRepo;
    @Autowired
    private JWTUtils jwtUtils;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;
    @Autowired
    private DefaultSecureTokenService secureTokenService;
    @Autowired
    private VerificationService verificationService;
    


    public ReqRes register(ReqRes registrationRequest) {
        ReqRes resp = new ReqRes();
        try {
            // Check for existing user by email
            Optional<OurUsers> existingUser = usersRepo.findByEmail(registrationRequest.getEmail());
            if (existingUser.isPresent()) {
                resp.setStatusCode(400);
                resp.setError("Email already in use");
                return resp;
            }
    
            // Validate email format
            if (!registrationRequest.getEmail().matches("^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$")) {
                resp.setStatusCode(400);
                resp.setError("Invalid email format");
                return resp;
            }
    
            // Create and save new user
            OurUsers ourUser = new OurUsers();
            ourUser.setEmail(registrationRequest.getEmail());
            ourUser.setCity(registrationRequest.getCity());
            ourUser.setRole(registrationRequest.getRole());
            ourUser.setName(registrationRequest.getName());
            ourUser.setPassword(passwordEncoder.encode(registrationRequest.getPassword()));
            ourUser.setAccountVerified(false); // Ensure the account is unverified by default
            ourUser.setLoginDisabled(true); // Prevent login until verification
    
            // Save the user to the database
            OurUsers savedUser = usersRepo.save(ourUser);
            if (savedUser != null) {
                // Generate token and send verification email
                String token = generateSecureTokenForUser(savedUser.getEmail());
                AccountVerificationEmailContext emailContext = new AccountVerificationEmailContext();
                emailContext.init(savedUser);
                emailContext.setToken(token);
                emailContext.buildVerificationUrl("http://localhost:8080", token);
                emailContext.setBody("Please verify your email using the following link: " + emailContext.getVerificationURL());
    
                // Send the verification email
                emailService.sendMail(emailContext);
    
                resp.setOurUsers(savedUser);
                resp.setMessage("User saved successfully. Verification email sent.");
                resp.setStatusCode(200);
            } else {
                resp.setStatusCode(500);
                resp.setError("Failed to save user.");
            }
        } catch (MessagingException e) {
            resp.setStatusCode(500);
            resp.setError("Email sending failed: " + e.getMessage());
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError("An unexpected error occurred: " + e.getMessage());
        }
        return resp;
    }
    

    public ReqRes resendVerificationEmail(String email) {
        ReqRes resp = new ReqRes();
        try {
            // Call the verification service to resend the verification token
            String result = verificationService.resendVerificationToken(email);

            // Handle response based on the result from verificationService
            if (result.equals("User not found")) {
                resp.setStatusCode(404);
                resp.setError("User not found");
            } else if (result.equals("User is already verified")) {
                resp.setStatusCode(400);
                resp.setError("User is already verified");
            } else if (result.equals("Verification email sent")) {
                resp.setStatusCode(200);
                resp.setMessage("Verification email sent");
            } else {
                resp.setStatusCode(500);
                resp.setError("Failed to resend verification email");
            }
        } catch (Exception e) {
            resp.setStatusCode(500);
            resp.setError("An unexpected error occurred: " + e.getMessage());
        }
        return resp;
    }
    
    

    // Method to generate a secure token for user verification
    private String generateSecureTokenForUser(String username) {
        SecureToken secureToken = secureTokenService.createSecureToken(username);
        return secureToken.getToken();
    }


    public ReqRes login(ReqRes loginRequest){
        ReqRes response = new ReqRes();
        try {
            authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getEmail(),
                            loginRequest.getPassword()));
            var user = usersRepo.findByEmail(loginRequest.getEmail()).orElseThrow();
            var jwt = jwtUtils.generateToken(user);
            var refreshToken = jwtUtils.generateRefreshToken(new HashMap<>(), user);
            response.setStatusCode(200);
            response.setToken(jwt);
            response.setRole(user.getRole());
            response.setRefreshToken(refreshToken);
            response.setExpirationTime("24Hrs");
            response.setMessage("Successfully Logged In");

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
        }
        return response;
    }





    public ReqRes refreshToken(ReqRes refreshTokenReqiest){
        ReqRes response = new ReqRes();
        try{
            String ourEmail = jwtUtils.extractUsername(refreshTokenReqiest.getToken());
            OurUsers users = usersRepo.findByEmail(ourEmail).orElseThrow();
            if (jwtUtils.isTokenValid(refreshTokenReqiest.getToken(), users)) {
                var jwt = jwtUtils.generateToken(users);
                response.setStatusCode(200);
                response.setToken(jwt);
                response.setRefreshToken(refreshTokenReqiest.getToken());
                response.setExpirationTime("24Hr");
                response.setMessage("Successfully Refreshed Token");
            }
            response.setStatusCode(200);
            return response;

        }catch (Exception e){
            response.setStatusCode(500);
            response.setMessage(e.getMessage());
            return response;
        }
    }


    public ReqRes getAllUsers() {
        ReqRes reqRes = new ReqRes();

        try {
            List<OurUsers> result = usersRepo.findAll();
            if (!result.isEmpty()) {
                reqRes.setOurUsersList(result);
                reqRes.setStatusCode(200);
                reqRes.setMessage("Successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("No users found");
            }
            return reqRes;
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
            return reqRes;
        }
    }


    public ReqRes getUsersById(Integer id) {
        ReqRes reqRes = new ReqRes();
        try {
            OurUsers usersById = usersRepo.findById(id).orElseThrow(() -> new RuntimeException("User Not found"));
            reqRes.setOurUsers(usersById);
            reqRes.setStatusCode(200);
            reqRes.setMessage("Users with id '" + id + "' found successfully");
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred: " + e.getMessage());
        }
        return reqRes;
    }


    public ReqRes deleteUser(Integer userId) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                usersRepo.deleteById(userId);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User deleted successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for deletion");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while deleting user: " + e.getMessage());
        }
        return reqRes;
    }

    public ReqRes updateUser(Integer userId, OurUsers updatedUser) {
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findById(userId);
            if (userOptional.isPresent()) {
                OurUsers existingUser = userOptional.get();
    
                // Only update fields if they are not null
                if (updatedUser.getEmail() != null && !updatedUser.getEmail().isEmpty()) {
                    existingUser.setEmail(updatedUser.getEmail());
                }
                if (updatedUser.getName() != null && !updatedUser.getName().isEmpty()) {
                    existingUser.setName(updatedUser.getName());
                }
                if (updatedUser.getCity() != null && !updatedUser.getCity().isEmpty()) {
                    existingUser.setCity(updatedUser.getCity());
                }
                if (updatedUser.getRole() != null) {
                    existingUser.setRole(updatedUser.getRole());
                }
    
                // Check if password is present in the request and not empty
                if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                    existingUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
                }
    
                OurUsers savedUser = usersRepo.save(existingUser);
                reqRes.setOurUsers(savedUser);
                reqRes.setStatusCode(200);
                reqRes.setMessage("User updated successfully");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }
        } catch (Exception e) {
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while updating user: " + e.getMessage());
        }
        return reqRes;
    }
    


    public ReqRes getMyInfo(String email){
        ReqRes reqRes = new ReqRes();
        try {
            Optional<OurUsers> userOptional = usersRepo.findByEmail(email);
            if (userOptional.isPresent()) {
                reqRes.setOurUsers(userOptional.get());
                reqRes.setStatusCode(200);
                reqRes.setMessage("successful");
            } else {
                reqRes.setStatusCode(404);
                reqRes.setMessage("User not found for update");
            }

        }catch (Exception e){
            reqRes.setStatusCode(500);
            reqRes.setMessage("Error occurred while getting user info: " + e.getMessage());
        }
        return reqRes;

    }
}

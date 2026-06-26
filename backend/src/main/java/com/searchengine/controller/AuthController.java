package com.searchengine.controller;

import com.searchengine.dto.AuthResponse;
import com.searchengine.dto.LoginRequest;
import com.searchengine.dto.RegisterRequest;
import com.searchengine.model.User;
import com.searchengine.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    UserRepository userRepository;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());
        
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            // Simple plain-text password check for simplicity (as requested)
            if (user.getPassword().equals(loginRequest.getPassword())) {
                // Return a simple mock token to satisfy frontend
                String mockToken = "mock-token-" + user.getId();
                return ResponseEntity.ok(new AuthResponse(mockToken, 
                                                         user.getId(), 
                                                         user.getUsername(), 
                                                         user.getEmail()));
            }
        }
        
        return ResponseEntity.badRequest().body("Error: Invalid username or password!");
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity
                    .badRequest()
                    .body("Error: Email is already in use!");
        }

        // Create new user's account with plain text password for maximum simplicity
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(signUpRequest.getPassword());

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }
}

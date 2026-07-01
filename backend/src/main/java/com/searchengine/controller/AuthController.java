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

    @Autowired
    private org.springframework.security.authentication.AuthenticationManager authenticationManager;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @Autowired
    private com.searchengine.security.JwtService jwtService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        try {
            org.springframework.security.core.Authentication authentication = authenticationManager.authenticate(
                    new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()));

            User user = userRepository.findByUsername(loginRequest.getUsername()).orElseThrow();
            String jwt = jwtService.generateToken(user);

            return ResponseEntity.ok(new AuthResponse(jwt,
                    "Bearer",
                    user.getId(),
                    user.getUsername(),
                    user.getEmail()));
        } catch (org.springframework.security.core.AuthenticationException e) {
            return ResponseEntity.status(401).body("Error: Invalid username or password!");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest signUpRequest) {

        Optional<User> existingUser = userRepository.findByEmail(signUpRequest.getEmail());
        if (existingUser.isEmpty()) {
            existingUser = userRepository.findByUsername(signUpRequest.getUsername());
        }

        User user;
        if (existingUser.isPresent()) {
            user = existingUser.get();
            // Update password for the existing user so they can login with BCrypt
            user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
            userRepository.save(user);
            return ResponseEntity.ok("User updated successfully!");
        }

        user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok("User registered successfully!");
    }

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok("Search Engine Backend is running");
    }
}

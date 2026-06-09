package com.example.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import com.example.backend.model.User;
import com.example.backend.repository.UserRepository;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {
    
    private final UserRepository userRepository;
    
    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        System.out.println("=== REGISTER REQUEST ===");
        System.out.println("FullName: " + user.getFullName());
        System.out.println("Email: " + user.getEmail());
        System.out.println("Password: " + user.getPassword());
        
        if (user.getFullName() == null || user.getEmail() == null || user.getPassword() == null) {
            System.out.println("❌ Missing fields!");
            Map<String, String> error = new HashMap<>();
            error.put("message", "All fields are required!");
            return ResponseEntity.badRequest().body(error);
        }
        
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser.isPresent()) {
            System.out.println("❌ Email already exists!");
            Map<String, String> error = new HashMap<>();
            error.put("message", "Email already exists!");
            return ResponseEntity.badRequest().body(error);
        }
        
        user.setRole("user");
        User savedUser = userRepository.save(user);
        System.out.println("✅ User saved with ID: " + savedUser.getId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Registration successful!");
        response.put("user", savedUser);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");
        
        Optional<User> user = userRepository.findByEmail(email);
        
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Login successful!");
            response.put("user", user.get());
            response.put("role", user.get().getRole());
            return ResponseEntity.ok(response);
        }
        
        Map<String, String> error = new HashMap<>();
        error.put("message", "Invalid email or password!");
        return ResponseEntity.badRequest().body(error);
    }
}
package com.jutahindustani.controller;

import com.jutahindustani.dto.MessageResponse;
import com.jutahindustani.dto.UserProfileRequest;
import com.jutahindustani.entity.User;
import com.jutahindustani.repository.UserRepository;
import com.jutahindustani.security.UserPrincipal;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/api/v1/user", "/api/user"})
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        try {
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userPrincipal.getId()));
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UserProfileRequest profileRequest) {
        try {
            User user = userRepository.findById(userPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("User not found with id: " + userPrincipal.getId()));

            // If email is changed, check if it's already taken by someone else
            if (!user.getEmail().equalsIgnoreCase(profileRequest.getEmail())) {
                if (userRepository.existsByEmail(profileRequest.getEmail())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
                }
                user.setEmail(profileRequest.getEmail());
            }

            user.setName(profileRequest.getName());
            user.setPhone(profileRequest.getPhone());
            user.setAddress(profileRequest.getAddress());

            // Handle password change if requested
            if (StringUtils.hasText(profileRequest.getCurrentPassword()) && StringUtils.hasText(profileRequest.getNewPassword())) {
                if (!passwordEncoder.matches(profileRequest.getCurrentPassword(), user.getPassword())) {
                    return ResponseEntity.badRequest().body(new MessageResponse("Error: Current password does not match!"));
                }
                user.setPassword(passwordEncoder.encode(profileRequest.getNewPassword()));
            }

            User updatedUser = userRepository.save(user);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}

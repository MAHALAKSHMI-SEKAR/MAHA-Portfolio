package com.backend.portfolio.controller;

import com.backend.portfolio.dto.ContactRequest;
import com.backend.portfolio.service.EmailService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:3000",
                "https://maha-portfolio-1p8tz3rmi-mahalakshmi-sekar.vercel.app"
        }
)
public class ContactController {

    @Autowired
    private EmailService emailService;

    @PostMapping
    public ResponseEntity<String> sendMessage(
            @RequestBody ContactRequest request
    ) {

        // Validate name
        if (request.getName() == null ||
                request.getName().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Name is required");
        }

        // Validate email
        if (request.getEmail() == null ||
                request.getEmail().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Email is required");
        }

        // Validate message
        if (request.getMessage() == null ||
                request.getMessage().trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("Message is required");
        }

        try {

            emailService.sendContactEmail(request);

            return ResponseEntity
                    .ok("Message sent successfully");

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to send message");
        }
    }
}
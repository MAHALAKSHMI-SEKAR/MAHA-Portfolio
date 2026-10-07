package com.backend.portfolio.controller;

import com.backend.portfolio.dto.ContactRequest;
import com.backend.portfolio.service.EmailServices;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:3000",
                "https://maha-portfolio-1p8tz3rmi-mahalakshmi-sekar.vercel.app",
                "https://maha-portfolio-xi.vercel.app"
        }
)
public class ContactController {

    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    private final EmailServices emailService;

    public ContactController(EmailServices emailService) {
        this.emailService = emailService;
    }

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
            logger.error("Contact email delivery failed", e);

            return ResponseEntity
                    .internalServerError()
                    .body("Failed to send message");
        }
    }
}

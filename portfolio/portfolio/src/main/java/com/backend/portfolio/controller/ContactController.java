package com.backend.portfolio.controller;

import com.backend.portfolio.dto.ContactRequest;
import com.backend.portfolio.service.EmailDeliveryException;
import com.backend.portfolio.service.EmailServices;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(originPatterns = {"http://localhost:5173", "http://localhost:3000", "https://*.vercel.app"})
public class ContactController {
    private static final Logger logger = LoggerFactory.getLogger(ContactController.class);
    private final EmailServices emailServices;

    public ContactController(EmailServices emailServices) {
        this.emailServices = emailServices;
    }

    @PostMapping
    public ResponseEntity<String> sendMessage(@Valid @RequestBody ContactRequest request) {
        try {
            emailServices.sendContactEmail(request);
            return ResponseEntity.ok("Message sent successfully");
        } catch (EmailDeliveryException exception) {
            logger.error("Portfolio contact email delivery failed: {}", exception.getMessage(), exception);
            return ResponseEntity.status(exception.getStatus()).body(exception.getPublicMessage());
        }
    }
}

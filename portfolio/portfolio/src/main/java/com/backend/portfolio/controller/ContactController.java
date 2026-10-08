package com.backend.portfolio.controller;

import com.backend.portfolio.dto.ContactRequest;
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
import org.springframework.mail.MailException;

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
        } catch (MailException exception) {
            logger.error("Portfolio contact email delivery failed", exception);
            return ResponseEntity.internalServerError().body("Email delivery failed. Check the backend SMTP configuration and logs.");
        }
    }
}

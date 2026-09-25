package com.backend.portfolio.controller;

import com.backend.portfolio.dto.ContactRequest;
import com.backend.portfolio.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<?> handleContact(@Valid @RequestBody ContactRequest request) {
        try {
            emailService.sendContactMessage(request);
            return ResponseEntity.ok().body(new SuccessResponse("Message sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(new ErrorResponse("Failed to send message"));
        }
    }

    record SuccessResponse(String message) {}
    record ErrorResponse(String error) {}
}
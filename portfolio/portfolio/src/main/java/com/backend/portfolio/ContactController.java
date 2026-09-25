package com.backend.portfolio;

import com.backend.portfolio.dto.ContactRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    private static final Logger logger =
            LoggerFactory.getLogger(ContactController.class);

    private final JavaMailSender mailSender;

    public ContactController(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    @PostMapping
    public ResponseEntity<String> sendMessage(
            @RequestBody ContactRequest request) {

        try {
            // Basic validation
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Name is required");
            }

            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Email is required");
            }

            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity
                        .badRequest()
                        .body("Message is required");
            }

            SimpleMailMessage mail = new SimpleMailMessage();

            // Your receiving email
            mail.setTo("mahanushya3001@gmail.com");

            // Email subject
            mail.setSubject(
                    "Portfolio Inquiry from " + request.getName()
            );

            // Email body
            mail.setText(
                    "New message from your portfolio website\n\n" +
                    "Name: " + request.getName() + "\n" +
                    "Email: " + request.getEmail() + "\n\n" +
                    "Message:\n" +
                    request.getMessage()
            );

            // Send email
            // Log request details for debugging
            logger.debug("Contact request received: name={}, email={}, message={}", request.getName(), request.getEmail(), request.getMessage());
            // Send email
            mailSender.send(mail);
            return ResponseEntity.ok("Message sent successfully");

        } catch (Exception e) {

            logger.error(
                    "Failed to send portfolio contact email",
                    e
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send email. Please try again later.");
        }
    }
}
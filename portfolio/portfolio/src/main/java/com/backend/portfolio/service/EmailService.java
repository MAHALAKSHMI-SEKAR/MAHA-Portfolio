package com.backend.portfolio.service;

import com.backend.portfolio.dto.ContactRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromAddress;

    @Value("${contact.recipient:${spring.mail.username}}")
    private String recipientAddress;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendContactMessage(ContactRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(recipientAddress);
        message.setReplyTo(request.getEmail());
        message.setSubject("Portfolio contact form: " + request.getName());
        message.setText(
            "Name: " + request.getName() + "\n" +
            "Email: " + request.getEmail() + "\n\n" +
            "Message:\n" + request.getMessage()
        );
        mailSender.send(message);
    }
}
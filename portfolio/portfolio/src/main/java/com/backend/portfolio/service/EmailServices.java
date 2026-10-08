package com.backend.portfolio.service;

import com.backend.portfolio.dto.ContactRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServices {
    private final JavaMailSender mailSender;
    private final String senderEmail;
    private final String recipientEmail;

    public EmailServices(
            JavaMailSender mailSender,
            @Value("${spring.mail.username}") String senderEmail,
            @Value("${portfolio.contact.recipient:${spring.mail.username}}") String recipientEmail) {
        this.mailSender = mailSender;
        this.senderEmail = senderEmail;
        this.recipientEmail = recipientEmail;
    }

    public void sendContactEmail(ContactRequest request) {
        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setFrom(senderEmail);
        mail.setTo(recipientEmail);
        mail.setReplyTo(request.getEmail().trim());
        mail.setSubject("Portfolio contact — " + request.getName().trim());
        mail.setText("New message from your portfolio website.\n\n"
                + "Name: " + request.getName().trim() + "\n"
                + "Email: " + request.getEmail().trim() + "\n\n"
                + "Message:\n" + request.getMessage().trim());
        mailSender.send(mail);
    }
}

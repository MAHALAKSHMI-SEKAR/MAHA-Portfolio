package com.backend.portfolio.service;

import com.backend.portfolio.dto.ContactRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailServices {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String myEmail;

    public void sendContactEmail(ContactRequest request) {

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setFrom(myEmail);
        mail.setTo("mahanushya3001@gmail.com");
        mail.setReplyTo(request.getEmail());
        mail.setSubject(
                "Portfolio Contact - " + request.getName()
        );
        mail.setText(
                "You received a new message from your portfolio website."
                        + "\n\n"
                        + "Name: " + request.getName()
                        + "\n"
                        + "Email: " + request.getEmail()
                        + "\n\n"
                        + "Message:"
                        + "\n"
                        + request.getMessage()
                        + "\n\n"
                        + "----------------------------"
                        + "\n"
                        + "Sent from Maha's Portfolio"
        );

        mailSender.send(mail);
    }
    
}
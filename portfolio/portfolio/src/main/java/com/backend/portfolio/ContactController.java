package com.backend.portfolio;

import com.backend.portfolio.dto.ContactRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

@RestController 
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private JavaMailSender mailSender;

    @PostMapping
    public String sendMessage(@RequestBody ContactRequest request) {

        SimpleMailMessage mail = new SimpleMailMessage();

        mail.setTo("mahanushya3001@gmail.com");
        mail.setSubject("Portfolio inquiry from " + request.getName());

        mail.setText(
            "Name: " + request.getName() + "\n" +
            "Email: " + request.getEmail() + "\n\n" +
            "Message:\n" + request.getMessage()
        );

        mailSender.send(mail);

        return "Message sent successfully";
    }
}

package com.backend.portfolio.service;

import com.backend.portfolio.dto.ContactRequest;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
public class EmailServices {
    private static final Logger logger = LoggerFactory.getLogger(EmailServices.class);
    private static final URI RESEND_EMAILS_ENDPOINT = URI.create("https://api.resend.com/emails");

    private final HttpClient httpClient;
    private final String apiKey;
    private final String fromEmail;
    private final String recipientEmail;

    public EmailServices(
            @Value("${resend.api-key:}") String apiKey,
            @Value("${resend.from-email:onboarding@resend.dev}") String fromEmail,
            @Value("${portfolio.contact.recipient:mahanushya3001@gmail.com}") String recipientEmail) {
        this.apiKey = apiKey == null ? "" : apiKey.trim();
        this.fromEmail = fromEmail;
        this.recipientEmail = recipientEmail;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(8))
                .build();
    }

    public void sendContactEmail(ContactRequest request) {
        if (apiKey.isBlank()) {
            throw new EmailDeliveryException(
                    "RESEND_API_KEY is not configured.",
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Email service is not configured yet.");
        }

        String safeName = request.getName().trim().replaceAll("[\\r\\n]+", " ");
        String sender = fromEmail.trim();
        String recipient = recipientEmail.trim();
        String subject = "Portfolio contact — " + safeName;
        String text = "New message from your portfolio website.\n\n"
                + "Name: " + safeName + "\n"
                + "Email: " + request.getEmail().trim() + "\n\n"
                + "Message:\n" + request.getMessage().trim();

        String payload = "{"
                + "\"from\":" + jsonString(sender) + ","
                + "\"to\":[" + jsonString(recipient) + "],"
                + "\"reply_to\":" + jsonString(request.getEmail().trim()) + ","
                + "\"subject\":" + jsonString(subject) + ","
                + "\"text\":" + jsonString(text)
                + "}";

        HttpRequest httpRequest = HttpRequest.newBuilder(RESEND_EMAILS_ENDPOINT)
                .timeout(Duration.ofSeconds(20))
                .header("Authorization", "Bearer " + apiKey)
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(payload, StandardCharsets.UTF_8))
                .build();

        try {
            HttpResponse<String> response = httpClient.send(
                    httpRequest,
                    HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                String details = response.body() == null ? "" : response.body();
                logger.warn("Resend rejected contact email with HTTP {}: {}",
                        response.statusCode(), abbreviate(details, 500));
                throw new EmailDeliveryException(
                        "Resend returned HTTP " + response.statusCode(),
                        HttpStatus.BAD_GATEWAY,
                        "The email provider could not send your message. Please try again later.");
            }
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new EmailDeliveryException(
                    "Contact email request was interrupted.",
                    HttpStatus.BAD_GATEWAY,
                    "The email provider could not send your message. Please try again later.",
                    exception);
        } catch (IOException exception) {
            throw new EmailDeliveryException(
                    "Could not reach the Resend email API.",
                    HttpStatus.BAD_GATEWAY,
                    "The email provider could not send your message. Please try again later.",
                    exception);
        }
    }

    private static String jsonString(String value) {
        StringBuilder escaped = new StringBuilder(value.length() + 2).append('"');
        for (int i = 0; i < value.length(); i++) {
            char character = value.charAt(i);
            switch (character) {
                case '"' -> escaped.append("\\\"");
                case '\\' -> escaped.append("\\\\");
                case '\b' -> escaped.append("\\b");
                case '\f' -> escaped.append("\\f");
                case '\n' -> escaped.append("\\n");
                case '\r' -> escaped.append("\\r");
                case '\t' -> escaped.append("\\t");
                default -> {
                    if (character < 0x20) {
                        escaped.append(String.format("\\u%04x", (int) character));
                    } else {
                        escaped.append(character);
                    }
                }
            }
        }
        return escaped.append('"').toString();
    }

    private static String abbreviate(String value, int maxLength) {
        return value.length() <= maxLength ? value : value.substring(0, maxLength) + "…";
    }
}

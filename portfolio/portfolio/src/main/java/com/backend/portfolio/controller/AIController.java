package com.backend.portfolio.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestClientResponseException;

import com.backend.portfolio.service.AIService;


@RestController 
@RequestMapping("/api/ai")
@CrossOrigin(originPatterns = {
    "http://localhost:5173",
    "http://localhost:3000",
    "https://maha-portfolio-xi.vercel.app",
    "https://*.vercel.app"
})
public class AIController {
    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }
    @PostMapping({"", "/", "/chat"})
    public ResponseEntity<String> chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        if (userMessage == null || userMessage.isBlank()) {
            return ResponseEntity.badRequest().body("Please enter a message.");
        }

        try {
            return ResponseEntity.ok(aiService.getAIResponse(userMessage, request.getOrDefault("context", "")));
        } catch (RestClientResponseException error) {
            if (error.getStatusCode().value() == 401) {
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body("The backend GROQ_API_KEY is invalid. Replace it with a valid Groq API key and restart the backend.");
            }
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body("AI provider returned HTTP " + error.getStatusCode().value() + ". Check the backend API key and provider response.");
        } catch (ResourceAccessException error) {
            return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                .body("The AI provider did not respond in time. Please try again shortly.");
        } catch (IllegalStateException error) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(error.getMessage());
        } catch (RestClientException error) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body("The backend could not complete its request to the AI provider.");
        } catch (RuntimeException error) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body("The AI request failed on the backend. Check the Render logs for the cause.");
        }
    }
}

package com.backend.portfolio.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public String chat(@RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        return aiService.getAIResponse(userMessage);
    }
}

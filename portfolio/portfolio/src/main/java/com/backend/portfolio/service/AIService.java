package com.backend.portfolio.service;

import java.util.Map;
import java.net.http.HttpClient;
import java.time.Duration;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.JdkClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.http.MediaType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import tools.jackson.databind.JsonNode;

@Service 
public class AIService {
    private static final Logger logger = LoggerFactory.getLogger(AIService.class);
    
    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.api.model}")
    private String model;

    private final RestClient restClient;

    public AIService() {
        var httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();
        var requestFactory = new JdkClientHttpRequestFactory(httpClient);
        requestFactory.setReadTimeout(Duration.ofSeconds(35));
        this.restClient = RestClient.builder()
            .requestFactory(requestFactory)
            .build();
    }

    public String getAIResponse(String userMessage, String portfolioContext) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GROQ_API_KEY is not configured on the backend.");
        }

        Map<String, Object> request = Map.of(
            "model", model,
            "messages", new Object[] {
                Map.of("role", "system", "content", "You are the AI assistant for Maha's portfolio. Answer portfolio questions using the supplied portfolio data. Be concise and conversational. If the data does not contain an answer, say you do not have that detail instead of inventing it.\n\nPortfolio data:\n" + portfolioContext),
                Map.of("role", "user", "content", userMessage)
            },
            "max_completion_tokens", 512
        );

        try {
            JsonNode response = restClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(JsonNode.class);

            if (response != null) {
                String text = response.path("choices").path(0).path("message").path("content").asString("").trim();
                if (!text.isEmpty()) return text;
                String providerError = response.path("error").path("message").asString("");
                if (!providerError.isBlank()) {
                    throw new IllegalStateException("Groq returned an error: " + providerError);
                }
            }
            throw new IllegalStateException("Groq response did not contain any output text.");
        } catch (RestClientResponseException error) {
            logger.error("Groq API returned HTTP {}: {}", error.getStatusCode().value(), error.getResponseBodyAsString());
            throw error;
        } catch (RuntimeException error) {
            logger.error("AI request failed: {}", error.getMessage(), error);
            throw error;
        }
    }
}

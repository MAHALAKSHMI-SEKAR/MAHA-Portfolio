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
    
    @Value("${openai.api.key}")
    private String apikey;

    @Value("${openai.api.url}")
    private String apiUrl;

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

    public String getAIResponse(String userMessage) {
        if (apikey == null || apikey.isBlank()) {
            throw new IllegalStateException("OPENAI_API_KEY is not configured on the backend.");
        }

        Map<String, Object> request = Map.of(
            "model", "gpt-4.1-mini",
            "input", userMessage
        );

        try {
            JsonNode response = restClient.post()
                .uri(apiUrl)
                .header("Authorization", "Bearer " + apikey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(request)
                .retrieve()
                .body(JsonNode.class);

            if (response != null) {
                JsonNode output = response.path("output");
                for (JsonNode item : output) {
                    for (JsonNode content : item.path("content")) {
                        if (content.hasNonNull("text")) {
                            String text = content.path("text").asString("").trim();
                            if (!text.isEmpty()) return text;
                        }
                    }
                }
                String providerError = response.path("error").path("message").asString("");
                if (!providerError.isBlank()) {
                    throw new IllegalStateException("OpenAI returned an error: " + providerError);
                }
            }
            throw new IllegalStateException("OpenAI response did not contain any output text.");
        } catch (RestClientResponseException error) {
            logger.error("OpenAI API returned HTTP {}: {}", error.getStatusCode().value(), error.getResponseBodyAsString());
            throw error;
        } catch (RuntimeException error) {
            logger.error("AI request failed: {}", error.getMessage(), error);
            throw error;
        }
    }
}

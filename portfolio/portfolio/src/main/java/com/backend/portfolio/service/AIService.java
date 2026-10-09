package com.backend.portfolio.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.http.MediaType;
import tools.jackson.databind.JsonNode;

@Service 
public class AIService {
    
    @Value("${openai.api.key}")
    private String apikey;

    @Value("${openai.api.url}")
    private String apiUrl;

    private final RestClient restClient = RestClient.create();

    public String getAIResponse(String userMessage) {
    Map<String, Object> request = Map.of(
        "model", "gpt-4.1-mini",
        "input", userMessage
    );

    JsonNode response = restClient.post()
        .uri(apiUrl)
        .header("Authorization", "Bearer " + apikey)
        .contentType(MediaType.APPLICATION_JSON)
        .body(request)
        .retrieve()
        .body(JsonNode.class);

    return response.path("output")
        .get(0)
        .path("content")
        .get(0)
        .path("text")
        .asText();
    }
}

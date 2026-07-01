package com.searchengine.service;

import com.searchengine.model.CodeFile;
import com.searchengine.repository.CodeFileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AIService {

    @Value("${nvidia.api.key}")
    private String apiKey;

    @Value("${nvidia.api.url}")
    private String apiUrl;

    @Autowired
    private CodeFileRepository codeFileRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    public String explainCode(String fileId) throws Exception {
        return callNvidia(fileId, "Please explain the following source code in detail:");
    }

    public String summarizeCode(String fileId) throws Exception {
        return callNvidia(fileId, "Please provide a concise summary of what this code does:");
    }

    public String suggestImprovements(String fileId) throws Exception {
        return callNvidia(fileId, "Please review this code and suggest improvements, optimizations, and best practices:");
    }

    private String callNvidia(String fileId, String promptInstruction) throws Exception {
        CodeFile file = codeFileRepository.findById(fileId)
                .orElseThrow(() -> new Exception("File not found with ID: " + fileId));

        if (file.getFileContent() == null || file.getFileContent().isEmpty()) {
            throw new Exception("Source file is empty.");
        }

        if (apiKey == null || apiKey.equals("YOUR_API_KEY_HERE")) {
            throw new Exception("NVIDIA API Key is not configured. Please add it to application.properties.");
        }

        String fullPrompt = promptInstruction + "\n\nFile: " + file.getFileName() + "\n\n" + file.getFileContent();

        // Build NVIDIA Request Payload (OpenAI compatible)
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "meta/llama-3.1-8b-instruct"); // You can change this to another supported NVIDIA model
        
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", fullPrompt);
        
        requestBody.put("messages", List.of(message));
        requestBody.put("max_tokens", 1024);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = restTemplate.postForObject(apiUrl, entity, Map.class);
            return extractTextFromResponse(response);
        } catch (Exception e) {
            throw new Exception("Error communicating with NVIDIA AI: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
            Map<String, Object> firstChoice = choices.get(0);
            Map<String, Object> message = (Map<String, Object>) firstChoice.get("message");
            return (String) message.get("content");
        } catch (Exception e) {
            return "Failed to parse AI response.";
        }
    }
}

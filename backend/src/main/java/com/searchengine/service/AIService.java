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

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Autowired
    private CodeFileRepository codeFileRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    public String explainCode(String fileId) throws Exception {
        return callGemini(fileId, "Please explain the following source code in detail:");
    }

    public String summarizeCode(String fileId) throws Exception {
        return callGemini(fileId, "Please provide a concise summary of what this code does:");
    }

    public String suggestImprovements(String fileId) throws Exception {
        return callGemini(fileId, "Please review this code and suggest improvements, optimizations, and best practices:");
    }

    private String callGemini(String fileId, String promptInstruction) throws Exception {
        CodeFile file = codeFileRepository.findById(fileId)
                .orElseThrow(() -> new Exception("File not found with ID: " + fileId));

        if (file.getFileContent() == null || file.getFileContent().isEmpty()) {
            throw new Exception("Source file is empty.");
        }

        if (apiKey == null || apiKey.equals("YOUR_API_KEY_HERE")) {
            throw new Exception("Gemini API Key is not configured. Please add it to application.properties.");
        }

        String fullPrompt = promptInstruction + "\n\nFile: " + file.getFileName() + "\n\n" + file.getFileContent();

        // Build Gemini Request Payload
        Map<String, Object> requestBody = new HashMap<>();
        Map<String, Object> contentMap = new HashMap<>();
        Map<String, Object> partsMap = new HashMap<>();
        
        partsMap.put("text", fullPrompt);
        contentMap.put("parts", List.of(partsMap));
        requestBody.put("contents", List.of(contentMap));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        String finalUrl = apiUrl + "?key=" + apiKey;

        try {
            Map<String, Object> response = restTemplate.postForObject(finalUrl, entity, Map.class);
            return extractTextFromResponse(response);
        } catch (Exception e) {
            throw new Exception("Error communicating with Gemini AI: " + e.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            Map<String, Object> firstCandidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) firstCandidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            return "Failed to parse AI response.";
        }
    }
}

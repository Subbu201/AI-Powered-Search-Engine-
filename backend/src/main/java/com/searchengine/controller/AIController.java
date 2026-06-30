package com.searchengine.controller;

import com.searchengine.service.AIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/ai")
public class AIController {

    @Autowired
    private AIService aiService;

    @PostMapping("/explain/{fileId}")
    public ResponseEntity<?> explainCode(@PathVariable String fileId) {
        try {
            String explanation = aiService.explainCode(fileId);
            return buildResponse(explanation);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/summary/{fileId}")
    public ResponseEntity<?> summarizeCode(@PathVariable String fileId) {
        try {
            String summary = aiService.summarizeCode(fileId);
            return buildResponse(summary);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/suggestions/{fileId}")
    public ResponseEntity<?> suggestImprovements(@PathVariable String fileId) {
        try {
            String suggestions = aiService.suggestImprovements(fileId);
            return buildResponse(suggestions);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error: " + e.getMessage());
        }
    }

    private ResponseEntity<?> buildResponse(String text) {
        Map<String, String> response = new HashMap<>();
        response.put("result", text);
        return ResponseEntity.ok(response);
    }
}

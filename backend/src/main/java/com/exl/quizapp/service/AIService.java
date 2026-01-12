package com.exl.quizapp.service;

import com.exl.quizapp.model.Question;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AIService {

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    // Spring AI automatically injects the ChatClient.Builder
    public AIService(ChatClient.Builder chatClientBuilder, ObjectMapper objectMapper) {
        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public List<Question> generateQuestions(String contextText, String topic, String difficulty, int count) {
        // 1. Construct the Prompt
        String promptMessage = String.format(
                "Generate %d multiple-choice questions on '%s' (Difficulty: %s). " +
                        "Base them strictly on this content: \n\n%s\n\n" +
                        "Return a raw JSON array (NO markdown, NO ```json wrapper). " +
                        "JSON Schema per object: { \"questionTitle\": \"...\", \"option1\": \"...\", \"option2\": \"...\", \"option3\": \"...\", \"option4\": \"...\", \"rightAnswer\": \"...\", \"difficultylevel\": \"%s\", \"category\": \"%s\" }",
                count, topic, difficulty, contextText, difficulty, topic
        );

        try {
            
            String jsonResponse = chatClient.prompt()
                    .user(promptMessage)
                    .call()
                    .content();

            // 3. Clean and Parse Response
            return parseAiResponse(jsonResponse);

        } catch (Exception e) {
            e.printStackTrace();
            // Fallback or rethrow
            throw new RuntimeException("AI Generation Failed: " + e.getMessage());
        }
    }

    private List<Question> parseAiResponse(String jsonResponse) {
        try {
            // Clean markdown if present (e.g., ```json ... ```)
            String cleanJson = jsonResponse.replace("```json", "").replace("```", "").trim();

            // Parse directly into List<Question>
            return objectMapper.readValue(cleanJson, new TypeReference<List<Question>>() {});
        } catch (JsonProcessingException e) {
            System.err.println("Failed to parse AI response: " + jsonResponse);
            return new ArrayList<>();
        }
    }
}
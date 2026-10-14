package com.DisenoProductos.EcoSolido.Integrations;

import com.DisenoProductos.EcoSolido.Services.HuggingFaceException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class GeminiIntegration {

    @Value("${gemini.api.key}")
    private String apiKey;

    // Buffer ampliado: el límite por defecto de WebClient es 256 KB y las fotos
    // de Cloudinary suelen superar ese tamaño, lo que causaba DataBufferLimitException
    private final WebClient webClient = WebClient.builder()
            .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(32 * 1024 * 1024))
            .build();

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

    public String describirFotos(List<String> urlFotos) {
        try {
            List<Map<String, Object>> parts = new ArrayList<>();

            parts.add(Map.of(
                    "text", "Describe estas imágenes en español en 2 oraciones como si fuera el reporte " +
                            "de una incidencia urbana sobre residuos o basura."
            ));

            for (String url : urlFotos) {
                System.out.println("Descargando imagen de: " + url);
                byte[] imageBytes = webClient.get()
                        .uri(url)
                        .retrieve()
                        .bodyToMono(byte[].class)
                        .block();

                System.out.println("Imagen descargada: " + imageBytes.length + " bytes");
                String base64 = Base64.getEncoder().encodeToString(imageBytes);
                System.out.println("Base64 length: " + base64.length());

                parts.add(Map.of(
                        "inlineData", Map.of(
                                "mimeType", detectarMimeType(url),
                                "data", base64
                        )
                ));
            }

            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of("parts", parts)
                    )
            );

            System.out.println("Enviando a Gemini API...");
            Map response = webClient.post()
                    .uri(GEMINI_URL + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(60))
                    .block();

            System.out.println("Respuesta de Gemini: " + response);
            List<Map> candidates = (List<Map>) response.get("candidates");
            Map content = (Map) candidates.get(0).get("content");
            List<Map> responseParts = (List<Map>) content.get("parts");
            String result = (String) responseParts.get(0).get("text");
            System.out.println("Descripción generada: " + result);
            return result;

        } catch (Exception e) {
            if (e instanceof WebClientResponseException wce) {
                System.err.println("Error Gemini: " + wce.getResponseBodyAsString());
            }
            e.printStackTrace();
            throw new HuggingFaceException("No se pudo describir las fotos con Gemini.", e);
        }
    }

    // Deduce el MIME type desde la extensión de la URL de Cloudinary
    private String detectarMimeType(String url) {
        String u = url.toLowerCase();
        if (u.endsWith(".png")) return "image/png";
        if (u.endsWith(".webp")) return "image/webp";
        if (u.endsWith(".gif")) return "image/gif";
        if (u.endsWith(".bmp")) return "image/bmp";
        if (u.endsWith(".heic") || u.endsWith(".heif")) return "image/heic";
        return "image/jpeg";
    }

    public String generarTitulo(String descripcion) {
        try {
            Map<String, Object> body = Map.of(
                    "contents", List.of(
                            Map.of("parts", List.of(
                                    Map.of("text", "Genera un título corto y descriptivo (máximo 6 palabras) " +
                                            "en español para una incidencia urbana con esta descripción: \"" +
                                            descripcion + "\". Responde SOLO con el título, sin comillas ni explicaciones.")
                            ))
                    )
            );

            Map response = webClient.post()
                    .uri(GEMINI_URL + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(body)
                    .retrieve()
                    .bodyToMono(Map.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();

            List<Map> candidates = (List<Map>) response.get("candidates");
            Map content = (Map) candidates.get(0).get("content");
            List<Map> responseParts = (List<Map>) content.get("parts");
            return ((String) responseParts.get(0).get("text")).trim();

        } catch (Exception e) {
            throw new HuggingFaceException("No se pudo generar el título con Gemini.", e);
        }
    }
}

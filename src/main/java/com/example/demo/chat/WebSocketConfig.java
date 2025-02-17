package com.example.demo.chat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.util.Map;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketConfig.class);

    // Intercepteur pour extraire le JWT
    private static class JwtHandshakeInterceptor implements HandshakeInterceptor {
        @Override
        public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                       WebSocketHandler wsHandler, Map<String, Object> attributes) {
            String rawQuery = request.getURI().getRawQuery();
            logger.info("🔍 Tentative de connexion WebSocket - Query: {}", rawQuery);

            if (rawQuery != null && rawQuery.contains("token=")) {
                String token = null;
                String[] params = rawQuery.split("&");
                for (String param : params) {
                    if (param.startsWith("token=")) {
                        token = param.substring("token=".length());
                        break;
                    }
                }
                if (token != null && !token.isEmpty()) {
                    attributes.put("jwt", token);
                    logger.info("✅ JWT extrait avec succès: {}", token);
                    return true;
                }
            }
            logger.error("❌ Échec de l'authentification WebSocket : Token manquant ou invalide.");
            return false;
        }

        @Override
        public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Exception exception) {
            if (exception != null) {
                logger.error("⚠️ Erreur après la poignée de main WebSocket: ", exception);
            }
        }
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        logger.info("🔧 Configuration du Message Broker...");
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
        logger.info("✅ Configuration du Message Broker terminée !");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        logger.info("🔧 Enregistrement du STOMP Endpoint à '/ws'...");
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .addInterceptors(new JwtHandshakeInterceptor());
        logger.info("✅ STOMP Endpoint enregistré avec succès !");
    }
}

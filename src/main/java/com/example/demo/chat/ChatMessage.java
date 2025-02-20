    package com.example.demo.chat;

    public class ChatMessage {

        public enum MessageType {
            CHAT,
            JOIN,
            LEAVE
        }

        private MessageType type;
        private String sender;
        private String receiver;
        private String content;

        public ChatMessage() {}

        public ChatMessage(MessageType type, String sender, String receiver, String content) {
            this.type = type;
            this.sender = sender;
            this.receiver = receiver;
            this.content = content;
        }

        // Getters and setters
        public MessageType getType() {
            return type;
        }
        public void setType(MessageType type) {
            this.type = type;
        }
        public String getSender() {
            return sender;
        }
        public void setSender(String sender) {
            this.sender = sender;
        }
        public String getReceiver() {
            return receiver;
        }
        public void setReceiver(String receiver) {
            this.receiver = receiver;
        }
        public String getContent() {
            return content;
        }
        public void setContent(String content) {
            this.content = content;
        }
    }

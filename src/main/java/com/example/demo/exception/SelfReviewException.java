package com.example.demo.exception;

public class SelfReviewException extends RuntimeException {
    public SelfReviewException() {
        super("Vous ne pouvez pas vous évaluer vous-même");
    }
}
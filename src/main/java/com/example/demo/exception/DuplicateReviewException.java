package com.example.demo.exception;

public class DuplicateReviewException extends RuntimeException {
    public DuplicateReviewException() {
        super("Vous avez déjà soumis un avis pour cette mission");
    }
}

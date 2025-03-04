package com.example.demo.model;
import java.util.Random;

public class VerificationUtil {
    public static String generateVerificationCode() {
        Random random = new Random();
        int code = 10000 + random.nextInt(90000); // génère un nombre entre 10000 et 99999
        return String.valueOf(code);
    }
}

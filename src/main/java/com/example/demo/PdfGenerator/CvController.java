package com.example.demo.PdfGenerator;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class CvController {

    private final CvGenerationService cvGenerationService;

    public CvController(CvGenerationService cvGenerationService) {
        this.cvGenerationService = cvGenerationService;
    }

    @PostMapping("/generate-cv")
    public ResponseEntity<byte[]> generateCv(@RequestBody Map<String, Object> consultantData) {
        try {
            // Validate input data
            if (consultantData == null || consultantData.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }

            byte[] pdfBytes = cvGenerationService.generateCv(consultantData);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "inline; filename=cv.pdf");
            headers.add("Content-Type", "application/pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();  // Log the error for debugging purposes
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

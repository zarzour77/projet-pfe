package com.example.demo.PdfGenerator;

import com.example.demo.model.Consultant;
import com.example.demo.repository.ConsultantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RequestMapping("/api/cv")
@RestController
public class CvController {

    @Autowired
    private CvGenerationService cvGenerationService;

    @Autowired
    private ConsultantRepository consultantRepository;

    public CvController(CvGenerationService cvGenerationService) {
        this.cvGenerationService = cvGenerationService;
    }

    @GetMapping("/{consultantId}")
    public ResponseEntity<byte[]> generateConsultantCv(@PathVariable Long consultantId) {
        Optional<Consultant> optionalConsultant = consultantRepository.findById(consultantId);
        if (!optionalConsultant.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Consultant consultant = optionalConsultant.get();

        // Prepare parameters for CV generation
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("nom", consultant.getNom());
        userDetails.put("prenom", consultant.getPrenom());
        userDetails.put("email", consultant.getEmail());
        userDetails.put("telephone", consultant.getTelephone());
        userDetails.put("adresse", consultant.getAdresse());
        userDetails.put("experienceYears", consultant.getExperienceYears());

        // Pass the list of competences, experiences, and importantly, domaines
        userDetails.put("competences", consultant.getCompetences());
        userDetails.put("experiences", consultant.getExperiences());
        userDetails.put("domaines", consultant.getDomaines());

        try {
            byte[] pdfBytes = cvGenerationService.generateCv(userDetails);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("inline")
                    .filename("cv.pdf")
                    .build());
            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @PostMapping("/saveCv/{consultantId}")
    public ResponseEntity<Void> saveConsultantCv(@PathVariable Long consultantId) {
        Optional<Consultant> optionalConsultant = consultantRepository.findById(consultantId);
        if (!optionalConsultant.isPresent()) {
            return ResponseEntity.notFound().build();
        }
        Consultant consultant = optionalConsultant.get();

        // Prepare parameters for CV generation
        Map<String, Object> userDetails = new HashMap<>();
        userDetails.put("nom", consultant.getNom());
        userDetails.put("prenom", consultant.getPrenom());
        userDetails.put("email", consultant.getEmail());
        userDetails.put("telephone", consultant.getTelephone());
        userDetails.put("adresse", consultant.getAdresse());
        userDetails.put("experienceYears", consultant.getExperienceYears());
        userDetails.put("competences", consultant.getCompetences());
        userDetails.put("experiences", consultant.getExperiences());
        userDetails.put("domaines", consultant.getDomaines());

        try {
            byte[] pdfBytes = cvGenerationService.generateCv(userDetails);
            consultant.setCv(pdfBytes);
            consultantRepository.save(consultant);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
    @GetMapping("/stored/{consultantId}")
    public ResponseEntity<byte[]> getStoredCv(@PathVariable Long consultantId) {
        Optional<Consultant> optionalConsultant = consultantRepository.findById(consultantId);
        if (!optionalConsultant.isPresent() || optionalConsultant.get().getCv() == null) {
            return ResponseEntity.notFound().build();
        }
        Consultant consultant = optionalConsultant.get();
        byte[] cvBytes = consultant.getCv();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("inline")
                .filename("cv.pdf")
                .build());

        return new ResponseEntity<>(cvBytes, headers, HttpStatus.OK);
    }

}

package com.example.demo.PdfGenerator;

import net.sf.jasperreports.engine.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CvGenerationService {

    public byte[] generateCv(Map<String, Object> userDetails) throws Exception {
        // Load Jasper template from resources
        ClassPathResource resource = new ClassPathResource("templates/cv_template.jrxml");
        InputStream templateStream = resource.getInputStream();
        if (templateStream == null) {
            throw new RuntimeException("Could not find Jasper template");
        }
        JasperReport jasperReport = JasperCompileManager.compileReport(templateStream);

        // Decode profile picture (Base64 to Image)
        String base64Image = (String) userDetails.get("profilePicture");
        if (base64Image != null && !base64Image.isEmpty()) {
            base64Image = base64Image.replaceFirst("^data:image/[^;]*;base64,", "");
            byte[] decodedImage = Base64.getDecoder().decode(base64Image);
            // Replace the original value with a ByteArrayInputStream
            userDetails.put("profilePicture", new java.io.ByteArrayInputStream(decodedImage));
        } else {
            throw new RuntimeException("Profile picture is missing or invalid");
        }

        // Prepare parameters for the report
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("nom", userDetails.get("nom"));
        parameters.put("prenom", userDetails.get("prenom"));
        parameters.put("email", userDetails.get("email"));
        parameters.put("telephone", userDetails.get("telephone"));
        parameters.put("experienceYears", userDetails.get("experienceYears"));
        parameters.put("profilePicture", userDetails.get("profilePicture"));
        parameters.put("adresse", userDetails.get("adresse"));

        String domaines = String.join(", ", (List<String>) userDetails.get("domaines"));
        String competences = String.join(", ", (List<String>) userDetails.get("competences"));
        // Generate the PDF report using an empty data source
        parameters.put("domaines", domaines);
        parameters.put("competences", competences);
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }


}

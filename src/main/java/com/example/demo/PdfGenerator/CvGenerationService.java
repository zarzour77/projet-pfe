package com.example.demo.PdfGenerator;

import com.example.demo.model.Competence;
import net.sf.jasperreports.engine.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

import java.io.InputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class CvGenerationService {

    public byte[] generateCv(Map<String, Object> userDetails) throws Exception {
        // Load and compile the main report template
        ClassPathResource resource = new ClassPathResource("templates/cv_template.jrxml");
        InputStream templateStream = resource.getInputStream();
        if (templateStream == null) {
            throw new RuntimeException("Could not find main Jasper template");
        }
        JasperReport jasperReport = JasperCompileManager.compileReport(templateStream);

        // Load and compile the experiences subreport template
        ClassPathResource subReportResource = new ClassPathResource("templates/experience_subreport.jrxml");
        InputStream subReportStream = subReportResource.getInputStream();
        if (subReportStream == null) {
            throw new RuntimeException("Could not find experience subreport Jasper template");
        }
        JasperReport compiledSubreport = JasperCompileManager.compileReport(subReportStream);

        // Load and compile the competences subreport template
        ClassPathResource competenceSubReportResource = new ClassPathResource("templates/competences_subreport.jrxml");
        InputStream competenceSubReportStream = competenceSubReportResource.getInputStream();
        if (competenceSubReportStream == null) {
            throw new RuntimeException("Could not find competences subreport Jasper template");
        }
        JasperReport compiledCompetenceSubreport = JasperCompileManager.compileReport(competenceSubReportStream);

        // Prepare main report parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("nom", userDetails.get("nom"));
        parameters.put("prenom", userDetails.get("prenom"));
        parameters.put("email", userDetails.get("email"));
        parameters.put("telephone", userDetails.get("telephone"));
        parameters.put("experienceYears", userDetails.get("experienceYears"));
        parameters.put("adresse", userDetails.get("adresse"));

        // Join domaines if needed
        String domaines = String.join(", ", (List<String>) userDetails.get("domaines"));
        parameters.put("domaines", domaines);
        // Create a data source for experiences
        List<?> experiences = (List<?>) userDetails.get("experiences");
        JRBeanCollectionDataSource experienceDataSource = new JRBeanCollectionDataSource(experiences);
        parameters.put("experienceDataSource", experienceDataSource);
        parameters.put("experienceSubreport", compiledSubreport);

        List<Competence> competences = (List<Competence>) userDetails.get("competences");
        JRBeanCollectionDataSource competenceDataSource = new JRBeanCollectionDataSource(competences);
        parameters.put("competenceDataSource", competenceDataSource);
        parameters.put("competenceSubreport", compiledCompetenceSubreport);


        // Generate the PDF report using an empty datasource for the main report.
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }


}

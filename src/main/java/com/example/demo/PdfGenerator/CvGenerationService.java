package com.example.demo.PdfGenerator;

import com.example.demo.model.Competence;
import net.sf.jasperreports.engine.*;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;

import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

        // Load and compile the domaines subreport template
        ClassPathResource domainesSubReportResource = new ClassPathResource("templates/domaines_subreport.jrxml");
        InputStream domainesSubReportStream = domainesSubReportResource.getInputStream();
        if (domainesSubReportStream == null) {
            throw new RuntimeException("Could not find domaines subreport Jasper template");
        }
        JasperReport compiledDomainesSubreport = JasperCompileManager.compileReport(domainesSubReportStream);

        // Load and compile the formations subreport template
        ClassPathResource formationsSubReportResource = new ClassPathResource("templates/formations_subreport.jrxml");
        InputStream formationsSubReportStream = formationsSubReportResource.getInputStream();
        if (formationsSubReportStream == null) {
            throw new RuntimeException("Could not find formations subreport Jasper template");
        }
        JasperReport compiledFormationsSubreport = JasperCompileManager.compileReport(formationsSubReportStream);

        // Load and compile the certifications subreport template
        ClassPathResource certificationsSubReportResource = new ClassPathResource("templates/certifications_subreport.jrxml");
        InputStream certificationsSubReportStream = certificationsSubReportResource.getInputStream();
        if (certificationsSubReportStream == null) {
            throw new RuntimeException("Could not find certifications subreport Jasper template");
        }
        JasperReport compiledCertificationsSubreport = JasperCompileManager.compileReport(certificationsSubReportStream);

        // Load and compile the langues subreport template
        ClassPathResource languesSubReportResource = new ClassPathResource("templates/langues_subreport.jrxml");
        InputStream languesSubReportStream = languesSubReportResource.getInputStream();
        if (languesSubReportStream == null) {
            throw new RuntimeException("Could not find langues subreport Jasper template");
        }
        JasperReport compiledLanguesSubreport = JasperCompileManager.compileReport(languesSubReportStream);

        // Prepare main report parameters
        Map<String, Object> parameters = new HashMap<>();
        parameters.put("nom", userDetails.get("nom"));
        parameters.put("prenom", userDetails.get("prenom"));
        parameters.put("email", userDetails.get("email"));
        parameters.put("telephone", userDetails.get("telephone"));
        parameters.put("experienceYears", userDetails.get("experienceYears"));
        parameters.put("adresse", userDetails.get("adresse"));

        // Create a data source for experiences
        List<?> experiences = (List<?>) userDetails.get("experiences");
        JRBeanCollectionDataSource experienceDataSource = new JRBeanCollectionDataSource(experiences);
        parameters.put("experienceDataSource", experienceDataSource);
        parameters.put("experienceSubreport", compiledSubreport);

        // Create a data source for competences
        List<Competence> competences = (List<Competence>) userDetails.get("competences");
        JRBeanCollectionDataSource competenceDataSource = new JRBeanCollectionDataSource(competences);
        parameters.put("competenceDataSource", competenceDataSource);
        parameters.put("competenceSubreport", compiledCompetenceSubreport);

        // Create a data source for domaines
        List<?> domaines = (List<?>) userDetails.get("domaines");
        JRBeanCollectionDataSource domainesDataSource = new JRBeanCollectionDataSource(domaines);
        parameters.put("domainesDataSource", domainesDataSource);
        parameters.put("domainesSubreport", compiledDomainesSubreport);

        // Create a data source for formations
        List<?> formations = (List<?>) userDetails.get("formations");
        JRBeanCollectionDataSource formationsDataSource = new JRBeanCollectionDataSource(formations);
        parameters.put("formationsDataSource", formationsDataSource);
        parameters.put("formationsSubreport", compiledFormationsSubreport);

        // Create a data source for certifications
        List<?> certifications = (List<?>) userDetails.get("certifications");
        JRBeanCollectionDataSource certificationsDataSource = new JRBeanCollectionDataSource(certifications);
        parameters.put("certificationsDataSource", certificationsDataSource);
        parameters.put("certificationsSubreport", compiledCertificationsSubreport);

        // Create a data source for langues
        List<?> langues = (List<?>) userDetails.get("langues");
        JRBeanCollectionDataSource languesDataSource = new JRBeanCollectionDataSource(langues);
        parameters.put("languesDataSource", languesDataSource);
        parameters.put("languesSubreport", compiledLanguesSubreport);

        // Generate the PDF report using an empty datasource for the main report.
        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, new JREmptyDataSource());
        return JasperExportManager.exportReportToPdf(jasperPrint);
    }
}

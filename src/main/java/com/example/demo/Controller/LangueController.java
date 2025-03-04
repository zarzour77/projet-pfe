package com.example.demo.Controller;

import com.example.demo.Service.LangueService;
import com.example.demo.model.Langue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/langues")
@CrossOrigin(origins = "http://localhost:5173")
public class LangueController {

    @Autowired
    private LangueService langueService;

    @GetMapping
    public List<Langue> getAllLangues() {
        return langueService.getAllLangues();
    }
}
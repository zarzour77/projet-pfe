package com.example.demo.Service;

import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

@Service
public class PythonDataService {

    private static final String PYTHON_SCRIPT_PATH = "src/main/python/data_generator.py";

    public void generateData() {
        try {
            ProcessBuilder pb = new ProcessBuilder("python3", PYTHON_SCRIPT_PATH);
            pb.directory(new File(System.getProperty("user.dir")));
            Process p = pb.start();

            // Lire la sortie
            BufferedReader reader = new BufferedReader(new InputStreamReader(p.getInputStream()));
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }

            int exitCode = p.waitFor();
            System.out.println("Python script exited with code: " + exitCode);

        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }
}
package com.example.packs;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/pacs")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PacsController {

    private final PacsFileService service;
    private final PacsLoanRepository repository;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPacsFile(@RequestParam("file") MultipartFile file) {
        try {
            int inserted = service.importFile(file);
            return ResponseEntity.ok("File processed successfully! Rows inserted: " + inserted);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error processing file: " + e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<PacsLoan>> getAllPacsLoans() {
        List<PacsLoan> loans = repository.findAll();
        return ResponseEntity.ok(loans);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacsLoan> getPacsLoanById(@PathVariable Long id) {
        return repository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}

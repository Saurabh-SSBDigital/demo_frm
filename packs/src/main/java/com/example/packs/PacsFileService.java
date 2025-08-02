package com.example.packs;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PacsFileService {

    private final PacsLoanRepository repository;

    private static final List<String> IGNORE_TOKENS = Arrays.asList(
            "(MEM)", "(PACS)", "0", "", "MEM", "PROD NAME"
    );

    public int importFile(MultipartFile file) throws Exception {
        int insertedCount = 0;

        try (BufferedReader br = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            while ((line = br.readLine()) != null) {

                // Skip headers, page numbers, lines with ---- or empty
                if (line.contains("REPORT-ID") || line.contains("SR.NO") || line.contains("PAGE NO") || line.startsWith("-") || line.trim().isEmpty()) {
                    continue;
                }

                // Only process lines that start with a number (like "1|61301000...")
                if (!line.matches("^\\s*\\d+.*")) continue;

                // Split by pipe
                String[] columns = line.split("\\|");

                // Clean unwanted tokens
                List<String> cleaned = Arrays.stream(columns)
                        .map(String::trim)
                        .filter(token -> !IGNORE_TOKENS.contains(token))
                        .collect(Collectors.toList());

                // Skip if less than expected columns
                if (cleaned.size() < 15) continue;

                // Fill PacsLoan entity safely
                PacsLoan loan = new PacsLoan();
                loan.setSrNo(get(cleaned, 0));
                loan.setPacsProductCodeAndName(get(cleaned, 1));
                loan.setCustomerNo(get(cleaned, 2));
                loan.setPacsAccountNo(get(cleaned, 3));
                loan.setPacsName(get(cleaned, 4));
                loan.setLimitSanctioned(get(cleaned, 5));
                loan.setDrawingPower(get(cleaned, 6));
                loan.setDueDate(get(cleaned, 7));
                loan.setRateOfIntPacs(get(cleaned, 8));
                loan.setAccruedIntPacs(get(cleaned, 9));
                loan.setExpiryRatePacs(get(cleaned, 10));
                loan.setOutstandingAmount(get(cleaned, 11));
                loan.setIrregularity(get(cleaned, 12));

                loan.setMemberSrNo(get(cleaned, 13));
                loan.setMemberProdName(get(cleaned, 14));
                loan.setMemberCustomerNo(get(cleaned, 15));
                loan.setMemberAccountNo(get(cleaned, 16));
                loan.setMemberAccountName(get(cleaned, 17));
                loan.setBrNo(get(cleaned, 18));
                loan.setMemberLimitSanctioned(get(cleaned, 19));
                loan.setMemberDrawingPower(get(cleaned, 20));
                loan.setMemberDueDate(get(cleaned, 21));
                loan.setMemberUnpaidPrinciple(get(cleaned, 22));
                loan.setMemberRateOfInt(get(cleaned, 23));
                loan.setMemberAccruedInt(get(cleaned, 24));
                loan.setMemberExpiryRate(get(cleaned, 25));
                loan.setMemberOutstanding(get(cleaned, 26));
                loan.setMemberIrregularity(get(cleaned, 27));

                repository.save(loan);
                insertedCount++;
            }
        }
        return insertedCount;
    }

    // Helper to avoid IndexOutOfBounds
    private String get(List<String> list, int index) {
        return index < list.size() ? list.get(index) : null;
    }
}

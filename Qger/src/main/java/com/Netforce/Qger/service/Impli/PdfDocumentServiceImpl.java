package com.Netforce.Qger.service.Impli;

import com.Netforce.Qger.entity.PdfDocument;
import com.Netforce.Qger.expectionHandler.BadRequestException;
import com.Netforce.Qger.repository.PdfDocumentRepository;
import com.Netforce.Qger.service.PdfDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PdfDocumentServiceImpl implements PdfDocumentService {

    private final PdfDocumentRepository pdfDocumentRepository;
    private final MessageSource messageSource;
    public PdfDocument savePdf(MultipartFile file) {
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException(
                    messageSource.getMessage("USER_NOT_FOUND", null, Locale.ENGLISH));
        }

        try {
            PdfDocument pdfDocument = new PdfDocument();
            pdfDocument.setName(file.getOriginalFilename());
            pdfDocument.setData(file.getBytes());
            return pdfDocumentRepository.save(pdfDocument);
        } catch (IOException e) {
            throw new RuntimeException("Error while processing file", e);
        }

    }

    @Override
    public PdfDocument getPdf(Long id) {
        return pdfDocumentRepository.findById(Math.toIntExact(id))
                .orElseThrow(() -> new RuntimeException("Document not found with id " + id));
    }
}

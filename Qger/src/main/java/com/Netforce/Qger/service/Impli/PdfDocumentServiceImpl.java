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
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class PdfDocumentServiceImpl implements PdfDocumentService {

    private final PdfDocumentRepository pdfDocumentRepository;
    private final MessageSource messageSource;
    public PdfDocument savePdf(MultipartFile file,String documentName) {
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException(
                    messageSource.getMessage("PDF_NOT_FOUND", null, Locale.ENGLISH));
        }

        try {
            PdfDocument pdfDocument = new PdfDocument();
            pdfDocument.setName(file.getOriginalFilename());
            pdfDocument.setData(file.getBytes());
            pdfDocument.setDocumentName(documentName);
            pdfDocument.setStatus(PdfDocument.Status.ACTIVE.value);// Set documentName from original filename
            return pdfDocumentRepository.save(pdfDocument);
        } catch (IOException e) {
            throw new RuntimeException("Error while processing file", e);
        }
    }


    @Override
    public PdfDocument getPdf(Long id) {
        return pdfDocumentRepository.findByIdAndStatus(Math.toIntExact(id),PdfDocument.Status.ACTIVE.value)
                .orElseThrow(() -> new RuntimeException("Document not found with id " + id));
    }

    public List<PdfDocument> getAllPdfDocuments(String searchKeyword) {
        return pdfDocumentRepository.findByDocumentNameContainingIgnoreCaseAndStatus(searchKeyword,PdfDocument.Status.ACTIVE.value);
    }
    @Override
    public PdfDocument updatePdf(Integer id, MultipartFile file, String docName) {
        PdfDocument existingPdf = pdfDocumentRepository.findByIdAndStatus(id, PdfDocument.Status.ACTIVE.value)
                .orElseThrow(() -> new RuntimeException("Document not found with id " + id));

        try {
            if (file != null && !file.isEmpty()) {
                existingPdf.setName(file.getOriginalFilename());
                existingPdf.setData(file.getBytes());
            }
            existingPdf.setDocumentName(docName);
            return pdfDocumentRepository.save(existingPdf);
        } catch (IOException e) {
            throw new RuntimeException("Error while updating file", e);
        }
    }


    @Override
    public void deletePdfDocument(long id){
        System.out.println("---------+"+id);
        PdfDocument existingPdf = pdfDocumentRepository.findByIdAndStatus(id,PdfDocument.Status.ACTIVE.value)
                .orElseThrow(
                        () ->
                                new BadRequestException(
                                        messageSource.getMessage("PDF_NOT_FOUND", null, Locale.ENGLISH)));
        existingPdf.setStatus(PdfDocument.Status.INACTIVE.value);
        pdfDocumentRepository.save(existingPdf);

    }
}

package com.Netforce.Qger.service;

import com.Netforce.Qger.entity.PdfDocument;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface PdfDocumentService {
    PdfDocument savePdf(MultipartFile file, String documentName, LocalDate documentExpire);
    PdfDocument getPdf(Long id);
    List<PdfDocument> getAllPdfDocuments(String searchKeyword);
    PdfDocument updatePdf(Integer id, MultipartFile file,String docName,LocalDate documentExpire);
    void deletePdfDocument(long id);
}

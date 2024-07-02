package com.Netforce.Qger.service;

import com.Netforce.Qger.entity.PdfDocument;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface PdfDocumentService {
    PdfDocument savePdf(MultipartFile file,String documentName);
    PdfDocument getPdf(Long id);
    List<PdfDocument> getAllPdfDocuments();
    PdfDocument updatePdf(Integer id, MultipartFile file,String docName);
    void deletePdfDocument(long id);
}

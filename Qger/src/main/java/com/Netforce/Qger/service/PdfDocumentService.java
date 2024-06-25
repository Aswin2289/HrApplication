package com.Netforce.Qger.service;

import com.Netforce.Qger.entity.PdfDocument;
import org.springframework.web.multipart.MultipartFile;

public interface PdfDocumentService {
    PdfDocument savePdf(MultipartFile file);
    PdfDocument getPdf(Long id);
}

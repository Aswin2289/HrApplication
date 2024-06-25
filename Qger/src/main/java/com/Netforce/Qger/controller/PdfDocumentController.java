package com.Netforce.Qger.controller;

import com.Netforce.Qger.entity.PdfDocument;
import com.Netforce.Qger.service.PdfDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/pdfdocument")
@RequiredArgsConstructor
public class PdfDocumentController {

  private final PdfDocumentService pdfDocumentService;

  @PostMapping("/upload")
  public ResponseEntity<String> uploadPdf(@RequestParam("file") MultipartFile file) {

    PdfDocument savedDocument = pdfDocumentService.savePdf(file);
    return ResponseEntity.ok("File uploaded successfully: " + savedDocument.getName());
  }

  @GetMapping("/view/{id}")
  public ResponseEntity<byte[]> viewPdf(@PathVariable Long id) {
    PdfDocument pdfDocument = pdfDocumentService.getPdf(id);

    return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + pdfDocument.getName() + "\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(pdfDocument.getData());
  }
}

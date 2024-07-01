package com.Netforce.Qger.controller;

import com.Netforce.Qger.entity.PdfDocument;
import com.Netforce.Qger.service.PdfDocumentService;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/pdfdocument")
@RequiredArgsConstructor
public class PdfDocumentController {

  private final PdfDocumentService pdfDocumentService;

  @PostMapping("/upload")
  public ResponseEntity<String> uploadPdf(@RequestParam("file") MultipartFile file,@RequestParam("documentName")String documentName) {

    PdfDocument savedDocument = pdfDocumentService.savePdf(file,documentName);
    return ResponseEntity.ok("File uploaded successfully: " + savedDocument.getName());
  }

  //  @GetMapping("/view/{id}")
  //  public ResponseEntity<byte[]> viewPdf(@PathVariable Long id) {
  //    PdfDocument pdfDocument = pdfDocumentService.getPdf(id);
  //
  //    return ResponseEntity.ok()
  //            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" +
  // pdfDocument.getName() + "\"")
  //            .contentType(MediaType.APPLICATION_PDF)
  //            .body(pdfDocument.getData());
  //  }
  @GetMapping("/view/{id}")
  public ResponseEntity<Map<String, Object>> getPdf(@PathVariable Long id) {
    PdfDocument pdfDocument = pdfDocumentService.getPdf(id);
    Map<String, Object> response = new HashMap<>();
    response.put("name", pdfDocument.getName());
    response.put("documentName", pdfDocument.getDocumentName());
    response.put("data", pdfDocument.getData());
    return new ResponseEntity<>(response, HttpStatus.OK);
  }
  @GetMapping("/all")
  public ResponseEntity<List<PdfDocument>> getAllPdfDocuments() {
    List<PdfDocument> pdfDocuments = pdfDocumentService.getAllPdfDocuments();
    return new ResponseEntity<>(pdfDocuments, HttpStatus.OK);
  }

  @PutMapping("/update/{id}")
  public ResponseEntity<String> updatePdf(
          @PathVariable Integer id,
          @RequestParam("file") MultipartFile file

  ) {
    PdfDocument updatedDocument = pdfDocumentService.updatePdf(id, file);
    return ResponseEntity.ok("File updated successfully: " + updatedDocument.getName());
  }
}

package com.Netforce.Qger.controller;


import com.Netforce.Qger.entity.PdfDocument;
import com.Netforce.Qger.entity.VehicleDocument;
import com.Netforce.Qger.entity.dto.responseDto.SuccessResponseDTO;
import com.Netforce.Qger.service.VehicleDocumentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/vehicle/document")
@RequiredArgsConstructor
public class VehicleDocumentController {

    private final VehicleDocumentService vehicleDocumentService;

    @PostMapping("/upload")
    public ResponseEntity<String> uploadPdf(@RequestParam("file") MultipartFile file,
                                            @RequestParam("documentName") String documentName,
                                            @RequestParam(value = "vehicleId", required = true) Integer vehicleId) {

        VehicleDocument savedDocument = vehicleDocumentService.saveDocument(file, documentName,vehicleId);
        return ResponseEntity.ok("File uploaded successfully: " + savedDocument.getName());
    }



    @GetMapping("/all/{vehicleId}")
    public ResponseEntity<List<VehicleDocument>> getAllPdfDocuments(@PathVariable Integer vehicleId) {
        List<VehicleDocument> pdfDocuments = vehicleDocumentService.getDocumentByVehicle(vehicleId);
        return new ResponseEntity<>(pdfDocuments, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updatePdf(
            @PathVariable Integer documentId,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam("documentName") String documentName) {
        VehicleDocument updatedDocument = vehicleDocumentService.updateVehicleDocument(file, documentName,documentId);
        return ResponseEntity.ok("File updated successfully: " + updatedDocument.getName());
    }

    @PutMapping("/delete/{id}")
    public ResponseEntity<Object> deletePdf(@PathVariable Integer id) {
        vehicleDocumentService.deleteVehicleDocument(id);
        return new ResponseEntity<>(
                new SuccessResponseDTO("201", "Document Deleted Successfully"), HttpStatus.CREATED);
    }

    @GetMapping("/view/{id}")
    public ResponseEntity<Map<String, Object>> getPdf(@PathVariable Long id) {
        VehicleDocument pdfDocument = vehicleDocumentService.getVehicleDocumentView(id);
        if (pdfDocument == null || pdfDocument.getData() == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Map<String, Object> response = new HashMap<>();
        response.put("name", pdfDocument.getName());
        response.put("documentName", pdfDocument.getDocumentName());
        response.put("data", pdfDocument.getData());
        return new ResponseEntity<>(response, HttpStatus.OK);
    }



}

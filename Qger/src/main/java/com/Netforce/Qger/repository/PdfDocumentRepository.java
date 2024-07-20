package com.Netforce.Qger.repository;

import com.Netforce.Qger.entity.PdfDocument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PdfDocumentRepository extends JpaRepository<PdfDocument,Integer> {

    Optional<PdfDocument> findByIdAndStatus(long id , byte status);
    List<PdfDocument>findAllByStatus(byte status);
    List<PdfDocument> findByDocumentNameContainingIgnoreCaseAndStatus(String name, byte status);

}

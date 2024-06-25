package com.Netforce.Qger.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "pdf_document")
public class PdfDocument {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Lob
    @Column(columnDefinition="LONGBLOB")
    private byte[] data;

    public  PdfDocument(String name, byte[] data) {
        this.name = name;
        this.data = data;
    }
}

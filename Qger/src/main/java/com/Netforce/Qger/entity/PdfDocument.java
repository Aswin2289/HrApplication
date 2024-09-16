package com.Netforce.Qger.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

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

    private String documentName;

    private LocalDate documentExpire;

    private byte status;

    public enum Status {
        // active-1 inactive(relieve)-0 exclude( permanent delete)-2
        INACTIVE((byte) 0), ACTIVE((byte) 1),DELETED((byte) 2);

        public final byte value;

        Status(byte value) {
            this.value = value;
        }
    }

    public  PdfDocument(String name, byte[] data) {
        this.name = name;
        this.data = data;
        this.status= Status.ACTIVE.value;
    }
    public  PdfDocument(byte status) {
        this.status= status;
    }
}

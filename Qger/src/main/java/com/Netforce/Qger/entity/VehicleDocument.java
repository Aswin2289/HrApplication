package com.Netforce.Qger.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.util.Date;
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "vehicle_document")
public class VehicleDocument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id", referencedColumnName = "id")
    @JsonIgnoreProperties("vehicle_id")
    private Vehicle vehicle;

    private String name;

    private String documentName;
    @Lob
    @Column(columnDefinition="LONGBLOB")
    private byte[] data;

    private byte status;

    @Temporal(TemporalType.TIMESTAMP)
    @CreationTimestamp
    private Date createdDate;

    @Temporal(TemporalType.TIMESTAMP)
    @UpdateTimestamp
    private Date updatedDate;

    public enum Status {
        // active-1 inactive(relieve)-0 exclude( permanent delete)-2
        INACTIVE((byte) 0), ACTIVE((byte) 1),DELETED((byte) 2);

        public final byte value;

        Status(byte value) {
            this.value = value;
        }
    }
}

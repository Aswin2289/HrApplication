package com.Netforce.Qger.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String vehicleNumber;
    private LocalDate manufactureDate;
    private byte vehicleType;
    private String modal;
    private String brand;

    private String insuranceProvider;
    private LocalDate insuranceExpire;
    private LocalDate istimaraDate;

    private long totalKilometer;
    private String Remarks;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    @JsonIgnoreProperties("user_id")
    private User user;

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

    public enum VehicleType{
        PRIVATE((byte)0),COMMERCIAL((byte)1),TRAILER((byte)2),EQUIPMENT((byte)3),HEAVY_EQUIPMENT((byte)4);
        public final byte value;
        VehicleType(byte value){this.value=value;}
    }
}
